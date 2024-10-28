// const categoriesContainer = document.getElementById('categoriesContainer');
// const mainView = document.getElementById('mainView');
// const detailView = document.getElementById('detailView');

// const detailsView = document.getElementById('detailsView');

// const seasonView = document.getElementById('seasonView');
// const itemView = document.getElementById('itemView');

// const videoView = document.getElementById('videoView');
// const sublistContainers = {
//     season: detailsView.querySelector('#seasonsSublistContainer'),
//     item: detailsView.querySelector('#itemsSublistContainer'),
//     resolution: detailsView.querySelector('#resolutionsSublistContainer'),
// };

let viewWorkflow = [];

const fetchUrl = "http://194.164.53.40/movie/fetch/";
const searchUrl = "http://194.164.53.40/movie/search/";
const homepageUrl = "http://194.164.53.40/movie/homepage?tv=true";

let viewList = {
    Main: document.getElementById('mainView'),
    Series: document.getElementById('seriesView'),
    Season: document.getElementById('seasonView'),
    Episode: document.getElementById('episodeView'),
    Film: document.getElementById('filmView'),
    Video: document.getElementById('videoView'),
    Browse: document.getElementById('browseView')
};
let currentViewName = 'Main';
// view workflow
let defaultWorkflowItem = {};
defaultWorkflowItem.view = 'Main';
defaultWorkflowItem.row = 0;
defaultWorkflowItem.col = 0;
viewWorkflow.push(defaultWorkflowItem);
// Array to store the selectable items
//const items = document.querySelectorAll('.selectable');
// let currentCategoryIndex = 0; // Track the current category index
// let currentMovieIndex = 0; // Track the current movie index

// let categoryCounter = 0;
let currentRowIndex = 0;
let currentColIndex = 0;

// Function to update focus on the current item


let backPressCount = 0;
let backPressTimer = null;

let avPlayer = null;

// const videoPlayer = document.getElementById('videoPlayer');
//     // let lastOkPressTime = 0; // Track the last time OK was pressed
//     // const doubleClickDelay = 300; // Delay for double click detection (in ms)
//     // Request fullscreen when the video is ready to play
//     videoPlayer.addEventListener('loadedmetadata', () => {
//         // Check if fullscreen is available
//         if (videoPlayer.requestFullscreen) {
//             videoPlayer.requestFullscreen();
//         } else if (videoPlayer.webkitRequestFullscreen) { // For Safari
//             videoPlayer.webkitRequestFullscreen();
//         } else if (videoPlayer.msRequestFullscreen) { // For IE/Edge
//             videoPlayer.msRequestFullscreen();
//         }
//     });


// Function to exit the app
function exitApp() {
    console.log("Exiting the app...");
    // Exit the Tizen application
    webapis.avplay.stop();
    webapis.avplay.close();
    tizen.application.getCurrentApplication().exit();
}


document.getElementById('searchButton').onclick = () => {
    let query = document.getElementById('searchField').value;
    console.log(query);
    fetchData(searchUrl + query + '?tv=true').then(data => {
        if (data) {
            console.log(data); // Handle the fetched data
            // Example: Access the title of the first result
            displayMovies(data);
        }
    });
};

function handleRemoteInVideo(event) {
    //Media seek during playback
    var successCallback = function () {
        console.log('Media seek successful');
    }

    var errorCallback = function () {
        console.log('Media seek failed');
    }
    //Jump forward by 5000 ms
    var currentTime = webapis.avplay.getCurrentTime();
    let duration = webapis.avplay.getDuration();
//   var newTime = currentTime + 5000;
    let newTime = 0;
    console.log(webapis.avplay.getState());
    console.log(duration);
    switch (event.keyCode) {
        case 13: // Enter key
            if (webapis.avplay.getState() === 'PAUSED') {
                webapis.avplay.play();
            } else {
                webapis.avplay.pause();
            }
            // const currentTime = new Date().getTime();
            // if (currentTime - lastOkPressTime < doubleClickDelay) {
            //     // Double click detected, toggle fullscreen
            //     toggleFullScreen();
            // }
            // lastOkPressTime = currentTime;
            break;
        case 37: // Left arrow key (rewind)
            // videoPlayer.currentTime -= 10; // Rewind 10 seconds
            if (duration > 0 && currentTime - 5000 > 0) {
                newTime = currentTime - 5000;
                console.log('bTime: ' + newTime + ', ' + duration);
                webapis.avplay.seekTo(newTime, successCallback, errorCallback);
            }

            break;
        case 39: // Right arrow key (fast-forward)
            //Case 1 Fast-forward by 15000 ms
            if (duration > 0 && currentTime + 5000 < duration) {
                newTime = currentTime + 5000;
                console.log('fTime: ' + newTime + ', ' + duration);
                webapis.avplay.seekTo(newTime, successCallback, errorCallback);
            }

            // webapis.avplay.jumpForward(15000,successCallback,errorCallback);
            // videoPlayer.currentTime += 10; // Fast-forward 10 seconds
            break;
        case 10009: // Tizen back key
        case 8:
            // if (document.fullscreenElement) {
            //     document.exitFullscreen();
            // } else {
            //     console.log('exit');
            //     // tizen.application.getCurrentApplication().exit();
            // }
            handleBackPress();
            break;
        default:
            break;
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

document.addEventListener('keydown', function (event) {
    console.log("key: " + event.keyCode + ', v: '+getCurrentViewWorkflow().view);
    if (getCurrentViewWorkflow().view === 'Video') {
        return handleRemoteInVideo(event);
    }

    let keyView = document.getElementById('keyView');
    keyView.innerHTML = "key: " + event.keyCode;
    switch (event.keyCode) {
        //case 'ArrowLeft':
        //case 'a':
        case 37:
            navigateMovies('prev');
            break;
        // case 'ArrowRight':
        //case 'd':
        case 39:
            navigateMovies('next');
            break;
        //case 'ArrowUp':
        //case 'w':
        case 38:
            navigateMovies('up');
            break;
        //case 'ArrowDown':
        //case 's':
        case 40:
            navigateMovies('down');
            break;
        //case 'Enter':
        case 13:
        case 65376:
            selectMovie();
            break;
        //case 'Backspace':
        case 10009:
        case 8:
            handleBackPress();
            break;
    }
});


// Function to update focus on the current item
function updateFocus(rowIndex, colIndex) {
    let currentViewWF = getCurrentViewWorkflow();
    console.log('updateFocus: ' + currentViewWF.view);
    if (currentViewWF.view === 'Video') {
        return;
    }
    const rows = viewList[currentViewWF.view].querySelectorAll('.selectableRow');


    if (rowIndex >= rows.length) {
        rowIndex = rows.length - 1;
    } else if (rowIndex < 0) {
        rowIndex = 0;
    }

    console.log("nextCat: " + rowIndex + ", catSize: " + rows.length)
    let nextRow = rows[rowIndex];

    if (nextRow == null) {
        console.log("nextRow is unknown: " + rowIndex);
        return;
    }

    const cols = nextRow.querySelectorAll('.selectableCol');

    // maybe do it in the navigate method before being adjusted
    if (cols != null) {
        // Remove highlight from all movies
        cols.forEach(col => col.classList.remove('highlighted'));
    }

    console.log("nextCol: " + colIndex + ", colsSize: " + cols.length);
    /*  let lastSelectedColumn = nextCategory.dataset.lastSelectedColumn;
      if(movieIndex == 0){
          movieIndex = lastSelectedColumn;
      }
  */
    if (colIndex >= cols.length) {
        colIndex = cols.length - 1;
    } else if (colIndex < 0) {
        colIndex = 0;
    }


    // Highlight the selected movie card
    if (cols.length > 0) {
        cols[colIndex].classList.add('highlighted');
        cols[colIndex].focus(); // Focus on the current movie
    }
    currentViewWF.col = colIndex;
    currentViewWF.row = rowIndex
    currentRowIndex = rowIndex;
    currentColIndex = colIndex;
}

// function getActiveView() {
//     Object.keys(viewList).forEach(name => {
//         if (viewList[name].style.display === 'block') {
//         console.log("getActiveView: " +name);
//         return viewList[name];
//         }
//     });
//     return viewList['mainView'];
// }

// Function to navigate through movies and categories
function getCurrentViewWorkflow() {
    return viewWorkflow[viewWorkflow.length - 1];
}

function navigateMovies(direction) {
    // let view = getActiveView();
    let currentViewWF = getCurrentViewWorkflow();
    const rows = viewList[currentViewWF.view].querySelectorAll('.selectableRow');
    let currentRow = rows[currentViewWF.row];

//console.log("currentCategory: "+ currentCategoryIndex +", col: "+currentMovieIndex);
    if (currentRow == null) {
        console.log("currentRow is unknown");
        return;
    }
    const cols = currentRow.querySelectorAll('.selectableCol');
    let currentCol = cols[currentViewWF.col];

    //currentCategory.dataset.lastSelectedColumn = currentMovieIndex;

    if (currentCol === null) {
        // Remove highlight from all movies
        cols.forEach(col => col.classList.remove('highlighted'));
        currentViewWF.col = 0;
    } else {
        currentCol.classList.remove('highlighted')
    }


    // Remove highlight from all categories
    // categories.forEach(category => category.classList.remove('highlighted'));


    switch (direction) {
        case 'next':
            // in selected row move column right
            // console.log(getCurrentViewWorkflow());
            updateFocus(currentViewWF.row, (currentViewWF.col + 1));
            // console.log(getCurrentViewWorkflow());
            break;
        case 'prev':
            // in selected row move column left
            updateFocus(currentViewWF.row, (currentViewWF.col - 1));
            break;
        case 'up':
            // move selected row up
            updateFocus((currentViewWF.row - 1), 0);
            break;
        case 'down':
            // move selected row up
            updateFocus((currentViewWF.row + 1), 0);
            break;
    }

    /*
    switch (direction){
        case 'next':
            // in selected row move column right
            updateFocus(currentCategoryIndex, (currentMovieIndex + 1));
            break;
        case 'prev':
            // in selected row move column left
            updateFocus(currentCategoryIndex, (currentMovieIndex - 1));
            break;
        case 'up':
            // move selected row up
            updateFocus((currentCategoryIndex -1), 0);
            break;
        case 'down':
            // move selected row up
            updateFocus((currentCategoryIndex +1), 0);
            break;
    }
    */

    /*
    if (direction === 'next') {
        const movies = categories[currentCategoryIndex].querySelectorAll('.movie-card');
        currentMovieIndex = (currentMovieIndex + 1) % movies.length; // Loop back to first movie
    } else if (direction === 'prev') {
        const movies = categories[currentCategoryIndex].querySelectorAll('.movie-card');
        currentMovieIndex = (currentMovieIndex - 1 + movies.length) % movies.length; // Loop back to last movie
    } else if (direction === 'up') {
        currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length; // Loop back to last category
        currentMovieIndex = 0; // Reset to the first movie in the new category
    } else if (direction === 'down') {
        currentCategoryIndex = (currentCategoryIndex + 1) % categories.length; // Loop back to first category
        currentMovieIndex = 0; // Reset to the first movie in the new category
    }
*/
    // updateFocus(currentCategoryIndex, currentMovieIndex); // Update the highlighted movie
}

// Function to select the current movie
function selectMovie() {
    const rows = viewList[currentViewName].querySelectorAll('.selectableRow');
    const currentRow = rows[currentRowIndex];
    const cols = currentRow.querySelectorAll('.selectableCol');

    // Get the currently selected movie
    const selectedCol = cols[currentColIndex];
    // const movieId = selectedCol.dataset.movieId ; // Assume movie ID is stored in a data attribute

    // console.log('movieId: '+ movieId);
    // if(movieId != null){
    //     // Logic to show the movie details
    //     return selectedCol.onclick(); // Call a function to display movie details
    // }
    if (selectedCol) {
        selectedCol.click(); // This simulates a user clicking the element
    }
}

// Continue with your existing showMovieDetails and other functions...


function displayMovies(categories) {

    const categoriesContainer = document.getElementById('categoriesContainer');
    categoriesContainer.innerHTML = ''; // Clear previous movies

    categories.forEach(cat => {
        let categoryContainer = generateSearchResultView(cat);
        categoriesContainer.appendChild(categoryContainer);
    });


    // Focus the first movie card in the first category, if any
    if (categoriesContainer.firstChild && categoriesContainer.firstChild.querySelector('.movie-card')) {
        categoriesContainer.firstChild.querySelector('.movie-card').focus();
    }
}

function generateSearchResultView(category) {
// Add the category container to the main categories container
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.classList.add('selectableRow');
    let categoryTitleView = document.createElement('h2');
    categoryTitleView.innerText = category.category;
    categoryDiv.appendChild(categoryTitleView);

    let movieListView = generateMovieListView(category.result);
    categoryDiv.appendChild(movieListView);

    return categoryDiv;
}

function generateCategoryView_old(category) {
    // Create a container for the category
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category');
    categoryContainer.classList.add('selectableRow');
    categoryContainer.dataset.lastSelectedColumn = 0;
    // categoryContainer.dataset.categoryIndex = categoryCounter++;

    // Create and add the category title
    const categoryTitle = document.createElement('h2');
    categoryTitle.innerText = category.title;
    categoryContainer.appendChild(categoryTitle);

    // Create a container for the movies in this category
    const movieList = document.createElement('div');
    movieList.classList.add('movie-list'); // Add class to apply any horizontal scrolling styles if needed

    // Add each movie card to the movie list
    let movieCounter = 1;
    // category.sublist.forEach(movie => {
    category.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card'); // Add class for identification
        movieCard.classList.add('selectableCol');
        movieCard.innerHTML = `<h3>${movie.title}</h3><img src="${movie.cardImage}" alt="${movie.title}">`;
        movieCard.tabIndex = 0; // Make the movie card focusable
        movieCard.dataset.movieId = movieCounter++;
        movieCard.onclick = () => showMovieDetails(movie); // Show details on click
        movieList.appendChild(movieCard);
        // Optionally, set a data attribute for the movie ID
        //movieCard.setAttribute('data-id', movie.id);
    });

    // Add the movie list to the category container
    categoryContainer.appendChild(movieList);

    return categoryContainer;
}

function generateSublistView(view, type, movies) {
    // Create a container for the category
    let categoryContainer = view.querySelector('#sublistContainer');
    if (currentViewName !== 'Main') {
        categoryContainer.innerHTML = '';
    }

    categoryContainer.classList.add('category');
    categoryContainer.classList.add('selectableRow');
    categoryContainer.dataset.lastSelectedColumn = 0;
    // categoryContainer.dataset.categoryIndex = categoryCounter++;

    // Create and add the category title
    let categoryTitle = document.createElement('h2');
    categoryTitle.innerText = type;
    categoryContainer.appendChild(categoryTitle);


    // Create a container for the movies in this category
    let movieList = generateMovieListView(movies);
    // Add the movie list to the category container
    categoryContainer.appendChild(movieList);

    categoryContainer;
}

function generateMovieListView(movies) {
    // Create a container for the movies in this category
    let movieList = document.createElement('div');
    movieList.classList.add('movie-list'); // Add class to apply any horizontal scrolling styles if needed
    movies.forEach(movie => {
        let movieCard = generateMovieCard(movie)
        movieList.appendChild(movieCard);
    });
    return movieList
}

function generateMovieCard(movie) {
    let movieCard = document.createElement('div');
    movieCard.classList.add('movie-card'); // Add class for identification
    movieCard.classList.add('selectableCol');
    let image = movie.cardImage;
    if (image == null) {
        image = movie.tvgLogo;
    }
    movieCard.innerHTML = `<h3>${movie.title}</h3><img src="${image}" alt="${movie.title}">`;
    movieCard.tabIndex = 0; // Make the movie card focusable
    // movieCard.dataset.movieId = movieCounter++;
    movieCard.onclick = () => showMovieDetails(movie); // Show details on click
    return movieCard;
}


function goBack() {
    console.log(viewWorkflow);
    let lastView = viewWorkflow.pop();
    console.log('goback:lastView: ' + lastView.view);
    // console.log(viewWorkflow);
    viewList[lastView.view].style.display = 'none';
    let previousView = viewWorkflow[viewWorkflow.length - 1];
    console.log('goback:previousView: ' + previousView.view);
    viewList[previousView.view].style.display = 'block';
    currentViewName = previousView.view;
    // updateFocus(0,0);
}

function handleBackPress() {
    // Check if user is in the main view
    console.log('handleBackPress: ' + getCurrentViewWorkflow().view + ', count: ' + backPressCount);
    if (getCurrentViewWorkflow().view === 'Main' || getCurrentViewWorkflow().view === 'Video') {
        if (backPressCount === 0) {
            backPressCount += 1;
            console.log("Press back again to exit.");
            // Start a timer to reset the backPressCount after 1 second
            backPressTimer = setTimeout(() => {
                backPressCount = 0;
            }, 1000);
        } else {
            if (getCurrentViewWorkflow().view === 'Video') {
                console.log('handleBackPress: ' + getCurrentViewWorkflow().view + ', count: ' + backPressCount);
                // videoPlayer.pause();
                webapis.avplay.stop();
                if (document.fullscreenElement) {
                    document.exitFullscreen(); // Exit fullscreen
                }
                backPressCount = 0;
                webapis.avplay.close();
                viewList['Video'].innerHTML = '';
                return goBack();
            }
            // Exit the app if back is pressed twice within 1 second
            exitApp();
        }
    } else {
        // Logic for navigating back if not in the main view
        backPressCount = 0;
        goBack();
    }
}

function showMovieDetails(movie) {
    // mainView.style.display = 'none'; // Hide main view
    // detailsView.style.display = 'block'; // Show detail view
    let type = movie.type;
    if (type == 'Iptv_channel'){
        type = 'Video';
    }
    // console.log('showMovieDetails: ' + movie.state);
    // console.log(movie);
    if (type == null) {
        type = movie.state;
        console.log('movie state: ' + type);
    }
    if (type == null) {
        console.log('unknown movie type');
        return;
    }
    // type = type.toLowerCase();
    console.log('movie type: ' + type);
    let view = viewList[type];
    if (view === null) {
        console.log('unknown movie type: ' + type);
        return;
    }

    if (type === 'Video') {
        // videoPlayer.innerHTML = '';

        // var videoPlayer = new tizen.VideoPlayer('videoPlayer');
        // const videoPlayer = webapis.avplay;
        // videoPlayer.setHTTPHeader('Referer', 'https://wecima.movie');
// videoPlayer.open('https://www.w3schools.com/html/mov_bbb.mp4');
// videoPlayer.play('https://www.w3schools.com/html/mov_bbb.mp4', {
//     fullscreen: true
// });
// videoPlayer.play();


// var objElem = document.createElement('object');
// objElem.type = 'application/avplayer';
// objElem.style.left = '100px';
// objElem.style.top = '200px';
// objElem.style.width = '600px';
// objElem.style.height = '400px';
// viewList['Video'].appendChild(objElem);
// showView(type);
// webapis.avplay.open('https://www.w3schools.com/html/mov_bbb.mp4');
// webapis.avplay.play();

        // let videoElement = view.querySelector('video');
        // let videoSource = document.createElement('source');
        // videoSource.src = movie.url;
        // videoSource.type = 'video/mp4';

        // initAVPlay();
        // const headers = new Headers({
        //     'Authorization': 'Bearer YOUR_TOKEN',
        //     'Referer': 'https://wecima.movie'
        // });

        // avPlayer.open(videoUrl);
        // avPlayer.setHTTPHeader('Referer', 'https://wecima.movie');

        //  // Prepare the player (setting resolution, screen size, etc.)
        //  avPlayer.prepare();

        //  // Start playing the video
        //  avPlayer.play();

        //  window.onload = function() {
        //     playVideoWithHeaders();
        // };

        // Fetch the video with custom headers
        // fetch(movie.url, { headers })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.blob();
        //     })
        //     .then(blob => {
        //         // Create a Blob URL from the fetched video
        //         const videoBlobUrl = URL.createObjectURL(blob);

        //         // Set the video element source to the Blob URL
        //             // const videoElement = document.getElementById('myVideo');
        //         videoPlayer.src = videoBlobUrl;
        //     })
        //     .catch(error => {
        //         console.error('There was a problem with the fetch operation:', error);
        //     });
// 
// 
        // videoPlayer.appendChild(videoSource);
        // updateFocus(0,0); 
        showView(type);
        playMovie(movie);
        return;
    }
    if (!showView(type)) {
        console.log('unknown view: ' + type);
        return;
    }
    if (type === 'Browse') {
        console.log('view: ' + type);
        return;
    }


    view.querySelector('#title').innerHTML = `<h4>${movie.title}</h4>`;

    let image = movie.cardImage;
    if (image == null) {
        image = movie.tvgLogo;
    }
    view.querySelector('#image').src = image;

    view.querySelector('#description').innerText = movie.description;
    let url = movie.videoUrl;
    if (url == null) {
        url = movie.url;
    }

    // fetchData(fetchUrl + movie.id + '?tv=true').then(data => {
    fetchData(url).then(data => {
        if (data) {
            console.log(data); // Handle the fetched data
            if (data == null || data.length === 0) {
                return;
            }

            generateSublistView(view, type, data);

            updateFocus(0, 0);
        }
    });


    // let category = {
    //     title: type,
    //     sublist: movie.sublist
    // };


    // if (movie.type === 'series') {
    //     displaySeasons(movie.sublist); // Show seasons for series
    // } else if (movie.type === 'season') {
    //     displayEpisodes(movie.sublist); // Show seasons for series
    // }else {
    //     // Hide the seasons container if it's not a series
    //     document.getElementById('seasonsContainer').style.display = 'none';
    // }
}

function showView(type) {
    console.log("showView: " + type);
    let found = false;
    Object.keys(viewList).forEach(name => {
        if (type === name) {
            console.log("show: " + name);
            viewList[name].style.display = 'block';
            currentViewName = name;


            let workflowItem = {};
            workflowItem.view = name;
            workflowItem.row = 0;
            workflowItem.col = 0;
            viewWorkflow.push(workflowItem);
            found = true;
        } else {
            console.log("hide: " + name);
            viewList[name].style.display = 'none';
        }
    });
    return found;
}


// Function to fetch data from a URL
async function fetchData(url) {
    try {
        const response = await fetch(url);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return the parsed data

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// function initAVPlay() {
//     if (!avPlayer) {
//         avPlayer = webapis.avplay;  // Get the AVPlay object
//         avPlayer.init();  // Initialize AVPlay
//     }
// }


// Set event listeners
function setAVPlayerListeners() {
    var listener = {
        onbufferingstart: function () {
            console.log("Buffering start.");
        },

        onbufferingprogress: function (percent) {
            // console.log("Buffering progress data : " + percent);
        },

        onbufferingcomplete: function () {
            console.log("Buffering complete.");
        },
        onstreamcompleted: function () {
            console.log("Stream Completed");
            webapis.avplay.stop();
        },

        oncurrentplaytime: function (currentTime) {
            // console.log("Current playtime: " + currentTime);
        },

        onerror: function (eventType) {
            console.log("event type error : " + eventType);
        },

        onevent: function (eventType, eventData) {
            console.log("event type: " + eventType + ", data: " + eventData);
        },

        onsubtitlechange: function (duration, text, data3, data4) {
            console.log("subtitleText: " + text);
        },
        ondrmevent: function (drmEvent, drmData) {
            console.log("DRM callback: " + drmEvent + ", data: " + drmData);
        }
    };

    webapis.avplay.setListener(listener);

}

function parseUrlWithParams(input) {
    // Check if the string contains '||'
    if (input.includes('|')) {
        // Split the input into URL and parameters
        let [url, params] = input.split('|');

        // Split parameters by '&' and then key-value pairs by '='
        let paramArray = params.split('&').map(param => {
            let [key, value] = param.split('=');
            return {[key.trim()]: value.trim()};
        });

        return {
            url: url.trim(),
            params: paramArray
        };
    } else {
        return {
            url: input.trim(),
            params: []
        };
    }
}

function playMovie(movie) {

    var objElem = document.createElement('object');
    objElem.type = 'application/avplayer';

    /*
    //Adjust the size and position of the media display area
    //by changing the CSS style attribute
    objElem.style.left = 100 + 'px';
    objElem.style.top = 200 + 'px';
    objElem.style.width = 600 + 'px';
    objElem.style.height = 400 + 'px';
    */

    //Append the object element to your document
    viewList['Video'].appendChild(objElem);


    // For example,  video positon is
    // left: 100 px / top: 200 px / width: 600 px / height: 400 px

    // Case 1: Application resolution 1920x1080 px
    // webapis.avplay.setDisplayRect(100,200,600,400);

    // Case 2: Other application resolution

    // // Base resolution of avplay
    // var avplayBaseWidth = 1920;

    // // Calculate ratio to base resolution
    // var ratio = avplayBaseWidth / window.document.documentElement.clientWidth;

    // // Convert rectangle to base resolution
    // var newLeft = 100 * ratio;
    // var newTop = 200 * ratio;
    // var newWidth = 600 * ratio;
    // var newHeight = 400 * ratio;

    // webapis.avplay.setDisplayRect(newLeft,newTop,newWidth,newHeight);

    // var successCallback = function() {
    //     console.log('The media has finished preparing');
    //     }

    //     var errorCallback = function() {
    //     console.log('The media has failed to prepare');
    //     }
    //     webapis.avplay.prepareAsync(successCallback,errorCallback);


    // var avplay = webapis.avplay;


    // Example usage
    // const input = "https://www.google.com||user-agent=android 7&referer=google.com";

    // Output:
    // {
    //   url: 'https://www.google.com',
    //   params: [{ 'user-agent': 'android 7' }, { referer: 'google.com' }]
    // }


    // Initialize the AVPlay object
    // let iptvurl = 'https://airmax.boats:443/airmaxtv1122/airmaxtv2211/306.ts||user-agent=airmaxtv';
    // let link = 'https://varcdnx10-18.erea12.shop:82/d/nvrtwaiubgeyf3tkampif3ypo4c5b4ajjcpfx2khekomyg5pfa2docvyqvxgfcmhwvuqlovp/_WeCima.Show_Al.Ameel.S01E34.720p.mp4';
    // webapis.avplay.open();


    const result = parseUrlWithParams(movie.url);

    // console.log(result);

    webapis.avplay.open(result.url);
    // webapis.avplay.open(link);
    setAVPlayerListeners();


    // //
    if (result.params.length > 0) {
        result.params.forEach(param => {
            for (let key in param) {
                if (key.toLowerCase() === 'user-agent') {
                    webapis.avplay.setStreamingProperty('USER_AGENT', param[key]);
                }
                console.log(`${key} => ${param[key]}`);
            }
        });
    }

    // var json = {
    //     // "HttpHeader" : "Referer=https://wecima.movie/",

    //     "Referer" : "https://wecima.movie/",
    // };
    // var properties = JSON.stringify(json);
    // // webapis.avplay.setStreamingProperty('USER_AGENT', properties);
    // webapis.avplay.setStreamingProperty('COOKIE', properties);
    // webapis.avplay.setStreamingProperty('CUSTOM_MESSAGE', properties);
    //     // Object.keys(result.params).forEach(name => {
    //     //             console.log("getActiveView: " +Object.keys(result.params[name]));
    //     //         });
    // }


    // function drmEventCallback(event, data) {
    //     if(data.name == "DrmError") {
    //         // error handling
    //         console.log(data);
    //     }
    // }

    // function prepareCallback() {
    //     webapi.avplay.play();
    // }
    // Set custom HTTP headers
    //  webapis.avplay.setDrm('PLAYREADY',"SetProperties", JSON.stringify({
    //     'Referer': 'https://wecima.movie/',
    //     'User-Agent': 'airmaxtv'
    // }));


    // // webapis.avplay.open(url);
    // webapis.avplay.setListener({ondrmevent:drmEventCallback});
    // webapis.avplay.setDrm("PLAYREADY", "SetProperties", properties);

    // avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_FULL_SCREEN');
    // try {
    //     // Set the display mode to full screen or letter box
    //     avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');
    //     console.log("setting display mode done ");
    // } catch (e) {
    //     console.error("Error setting display mode: ", e);
    // }

    // webapis.avplay.setStreamingProperty('USER_AGENT',  'android 7');
    // webapis.avplay.setStreamingProperty("COOKIE", "Referer=https://wecima.movie/");

    // webapis.avplay.setStreamingProperty('REFERRER',  'https://wecima.movie');
    // Prepare and play the video
    webapis.avplay.prepareAsync(function () {
        // webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX')
        webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
        webapis.avplay.setStreamingProperty("ADAPTIVE_INFO", "FIXED_MAX_RESOLUTION=7680x4320");
        webapis.avplay.play();

    }, function (error) {
        console.error('Error preparing AVPlay:', error);
    });

}


// Example usage
// const url = 'https://raw.githubusercontent.com/alyabroudy1/omerFlex-php/refs/heads/main/test-search.json'; // Replace with your actual URL
// const url = 'https://gist.githubusercontent.com/deepakpk009/99fd994da714996b296f11c3c371d5ee/raw/28c4094ae48892efb71d5122c1fd72904088439b/media.json'
// const url = "http://194.164.53.40/movie/search/sonic";
fetchData(homepageUrl).then(data => {
    if (data) {
        // console.log(data); // Handle the fetched data
        // // Example: Access the title of the first result
        displayMovies(data);
    }
});
updateFocus(0, 0);
