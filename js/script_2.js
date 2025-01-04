// // var categoriesContainer = document.getElementById('categoriesContainer');
// // var mainView = document.getElementById('mainView');
// // var detailView = document.getElementById('detailView');
//
// // var detailsView = document.getElementById('detailsView');
//
// // var seasonView = document.getElementById('seasonView');
// // var itemView = document.getElementById('itemView');
//
// // var videoView = document.getElementById('videoView');
// // var sublistContainers = {
// //     season: detailsView.querySelector('#seasonsSublistContainer'),
// //     item: detailsView.querySelector('#itemsSublistContainer'),
// //     resolution: detailsView.querySelector('#resolutionsSublistContainer'),
// // };
//
var viewWorkflow = [];

var fetchUrl = "http://194.164.53.40/movie/fetch/";
var searchUrl = "http://194.164.53.40/movie/search/";
var homepageUrl = "http://194.164.53.40/movie/homepage?tv=true";

var viewList = {
    Main: document.getElementById('mainView'),
    Search: document.getElementById('searchResultView'),
    Series: document.getElementById('seriesView'),
    Season: document.getElementById('seasonView'),
    Episode: document.getElementById('episodeView'),
    Film: document.getElementById('filmView'),
    Video: document.getElementById('videoView'),
    Browse: document.getElementById('browseView')
};
var currentViewName = 'Main';
// view workflow
var defaultWorkflowItem = {};
defaultWorkflowItem.view = 'Main';
defaultWorkflowItem.row = 0;
defaultWorkflowItem.col = 0;
viewWorkflow.push(defaultWorkflowItem);
// Array to store the selectable items
//var items = document.querySelectorAll('.selectable');
var currentCategoryIndex = 0; // Track the current category index
var currentMovieIndex = 0; // Track the current movie index

// // var categoryCounter = 0;
var currentRowIndex = 0;
var currentColIndex = 0;

// Function to update focus on the current item


var backPressCount = 0;
var backPressTimer = null;

var avPlayer = null;

// var videoPlayer = document.getElementById('videoPlayer');
//     // var lastOkPressTime = 0; // Track the last time OK was pressed
//     // var doubleClickDelay = 300; // Delay for double click detection (in ms)
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
//     });#

document.getElementById('searchButton').onclick = function () {
    var query = document.getElementById('searchField').value;
    console.log(query);
     fetchData(searchUrl + query).then(function (data) {
         if (data) {
             var categoriesContainer = viewList['Search'].querySelector('#categoriesContainer');
             showView('Search');
             console.log(data); // Handle the fetched data
             // Example: Access the title of the first result
             displayMovies(data, categoriesContainer);
             updateFocus(0, 0);
         }
     });
};

function handleRemoteInVideo(event) {
    // Media seek during playback
    var successCallback = function () {
        console.log('Media seek successful');
    };

    var errorCallback = function () {
        console.log('Media seek failed');
    };

    // Jump forward by 5000 ms
    var currentTime = webapis.avplay.getCurrentTime();
    var duration = webapis.avplay.getDuration();
    var newTime = 0;

    console.log(webapis.avplay.getState());
    console.log(duration);

    switch (event.keyCode) {
        case 13: // Enter key
            if (webapis.avplay.getState() === 'PAUSED') {
                webapis.avplay.play();
            } else {
                webapis.avplay.pause();
            }
            break;

        case 37: // Left arrow key (rewind)
            if (duration > 0 && currentTime - 5000 > 0) {
                newTime = currentTime - 5000;
                console.log('bTime: ' + newTime + ', ' + duration);
                webapis.avplay.seekTo(newTime, successCallback, errorCallback);
            }
            break;

        case 39: // Right arrow key (fast-forward)
            if (duration > 0 && currentTime + 5000 < duration) {
                newTime = currentTime + 5000;
                console.log('fTime: ' + newTime + ', ' + duration);
                webapis.avplay.seekTo(newTime, successCallback, errorCallback);
            }
            break;

        case 10009: // Tizen back key
        case 8:
            handleBackPress();
            break;

        default:
            break;
    }
}

// function toggleFullScreen() {
//     if (!document.fullscreenElement) {
//         if (videoPlayer.requestFullscreen) {
//             videoPlayer.requestFullscreen();
//         }
//     } else {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         }
//     }
// }


// Function to update focus on the current item
function updateFocus(rowIndex, colIndex) {
    var currentViewWF = getCurrentViewWorkflow();
    // console.log('updateFocus: ' + currentViewWF.view);
    if (currentViewWF.view === 'Video') {
        return;
    }
    var rows = viewList[currentViewWF.view].querySelectorAll('.selectableRow');

    if (rowIndex >= rows.length) {
        rowIndex = rows.length - 1;
    } else if (rowIndex < 0) {
        rowIndex = 0;
    }

    console.log("nextCat: " + rowIndex + ", catSize: " + rows.length);
    var nextRow = rows[rowIndex];

    if (nextRow == null) {
        console.log("nextRow is unknown: " + rowIndex);
        return;
    }

    var cols = nextRow.querySelectorAll('.selectableCol');

    // maybe do it in the navigate method before being adjusted
    if (cols == null) {
        return;
    }
    // Remove highlight from all movies
    Array.prototype.forEach.call(cols, function(col) {
        col.classList.remove('highlighted');
    });

    // console.log("nextCol: " + colIndex + ", colsSize: " + cols.length);
    /*  var lastSelectedColumn = nextCategory.dataset.lastSelectedColumn;
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
    currentViewWF.row = rowIndex;
    currentRowIndex = rowIndex;
    currentColIndex = colIndex;
}


// Function to exit the app
function exitApp() {
    console.log("Exiting the app...");
    // Exit the Tizen application
    webapis.avplay.stop();
    webapis.avplay.close();
    tizen.application.getCurrentApplication().exit();
}

function navigateMovies(direction) {
    // var view = getActiveView();
    var currentViewWF = getCurrentViewWorkflow();
    var rows = viewList[currentViewWF.view].querySelectorAll('.selectableRow');
    var currentRow = rows[currentViewWF.row];

//console.log("currentCategory: "+ currentCategoryIndex +", col: "+currentMovieIndex);
    if (currentRow == null) {
        console.log("currentRow is unknown");
        return;
    }
    var cols = currentRow.querySelectorAll('.selectableCol');
    var currentCol = cols[currentViewWF.col];

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
        var movies = categories[currentCategoryIndex].querySelectorAll('.movie-card');
        currentMovieIndex = (currentMovieIndex + 1) % movies.length; // Loop back to first movie
    } else if (direction === 'prev') {
        var movies = categories[currentCategoryIndex].querySelectorAll('.movie-card');
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

// Function to navigate through movies and categories
function getCurrentViewWorkflow() {
    return viewWorkflow[viewWorkflow.length - 1];
}

function fetchData(url) {
    return new Promise(function(resolve, reject) {
        try {
            fetch(url)
                .then(function(response) {
                    // Check if the request was successful
                    if (!response.ok) {
                        throw new Error('HTTP error! status: ' + response.status);
                    }
                    return response.json();
                })
                .then(function(data) {
                    resolve(data); // Return the parsed data
                })
                .catch(function(error) {
                    console.error('Error fetching data:', error);
                    reject(null);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            reject(null);
        }
    });
}

document.addEventListener('keydown', function (event) {
    // console.log("key: " + event.keyCode + ', v: ' + getCurrentViewWorkflow().view);
    if (getCurrentViewWorkflow().view === 'Video') {
        return handleRemoteInVideo(event);
    }

    var keyView = document.getElementById('keyView');
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

function goBack() {
    console.log(viewWorkflow);
    var lastView = viewWorkflow.pop();
    console.log('goback:lastView: ' + lastView.view);
    // console.log(viewWorkflow);
    viewList[lastView.view].style.display = 'none';
    var previousView = viewWorkflow[viewWorkflow.length - 1];
    console.log('goback:previousView: ' + previousView.view);
    viewList[previousView.view].style.display = 'block';
    currentViewName = previousView.view;
    // updateFocus(0,0);
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

function generateSearchResultView(category) {
    // Add the category container to the main categories container
    var categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.classList.add('selectableRow');

    var categoryTitleView = document.createElement('h2');
    categoryTitleView.innerText = category.category;
    categoryDiv.appendChild(categoryTitleView);

    var movieListView = generateMovieListView(category.result);
    categoryDiv.appendChild(movieListView);

    return categoryDiv;
}

function generateMovieListView(movies) {
    // Create a container for the movies in this category
    var movieList = document.createElement('div');
    movieList.classList.add('movie-list'); // Add class to apply any horizontal scrolling styles if needed
    Array.prototype.forEach.call(movies, function(movie) {
        var movieCard = generateMovieCard(movie);
        movieList.appendChild(movieCard);
    });
    return movieList;
}

function generateMovieCard(movie) {
    var movieCard = document.createElement('div');
    movieCard.classList.add('movie-card'); // Add class for identification
    movieCard.classList.add('selectableCol');
    var image = movie.cardImage;
    if (image == null) {
        image = movie.tvgLogo;
    }
    movieCard.innerHTML = '<h3>' + movie.title + '</h3><img src="' + image + '" alt="' + movie.title + '">';
    movieCard.tabIndex = 0; // Make the movie card focusable
    // movieCard.dataset.movieId = movieCounter++;
    movieCard.onclick = function() {
        showMovieDetails(movie); // Show details on click
    };
    return movieCard;
}

function showMovieDetails(movie) {
    var type = movie.type;
    if (type == 'Iptv_channel') {
        type = 'Video';
    }
    if (type == null) {
        type = movie.state;
        console.log('movie state: ' + type);
    }
    if (type == null) {
        console.log('unknown movie type');
        return;
    }
    console.log('movie type: ' + type);
    var view = viewList[type];
    if (view === null) {
        console.log('unknown movie type: ' + type);
        return;
    }

    if (type === 'Video') {
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

    view.querySelector('#title').innerHTML = '<h4>' + movie.title + '</h4>';

    var image = movie.cardImage;
    if (image == null) {
        image = movie.tvgLogo;
    }
    view.querySelector('#image').src = image;

    view.querySelector('#description').innerText = movie.description;
    var url = movie.videoUrl;
    if (url == null) {
        url = movie.url;
    }

    fetchData(url).then(function(data) {
        if (data) {
            console.log(data); // Handle the fetched data
            if (data == null || data.length === 0) {
                return;
            }

            generateSublistView(view, type, data);

            updateFocus(0, 0);
        }
    });
}

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
    if (input.indexOf('|') !== -1) {
        // Split the input into URL and parameters
        var parts = input.split('|');
        var url = parts[0];
        var params = parts[1];

        // Split parameters by '&' and then key-value pairs by '='
        var paramArray = params.split('&').map(function (param) {
            var keyValue = param.split('=');
            var key = keyValue[0].trim();
            var value = keyValue[1].trim();
            var obj = {};
            obj[key] = value;
            return obj;
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

function playVideoNow(result) {
    console.log("playVideoNow: ");
    console.log(result.url);
    webapis.avplay.open(result.url);
    setAVPlayerListeners();

    if (result.params.length > 0) {
        result.params.forEach(function (param) {
            for (var key in param) {
                if (key.toLowerCase() === 'user-agent') {
                    webapis.avplay.setStreamingProperty('USER_AGENT', param[key]);
                }
                console.log(key + " => " + param[key]);
            }
        });
    }

    webapis.avplay.prepareAsync(function () {
        webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
        webapis.avplay.setStreamingProperty("ADAPTIVE_INFO", "FIXED_MAX_RESOLUTION=7680x4320");
        webapis.avplay.play();
    }, function (error) {
        console.error('Error preparing AVPlay:', error);
    });
}

function playMovie(movie) {
    var objElem = document.createElement('object');
    objElem.type = 'application/avplayer';

    // Append the object element to your document
    viewList['Video'].appendChild(objElem);

    var result = parseUrlWithParams(movie.url);
    playVideoNow(result);
}


function showView(type) {
    console.log("showView: " + type);
    var found = false;
    Object.keys(viewList).forEach(function(name) {
        if (type === name) {
            console.log("show: " + name);
            viewList[name].style.display = 'block';
            currentViewName = name;

            var workflowItem = {};
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

function displayMovies(categories, categoriesContainer) {

    categoriesContainer.innerHTML = ''; // Clear previous movies
    if (!Array.isArray(categories)) {
        categories = [categories];
        console.log('not array size: ' + categories.length);
    }
    categories.forEach(function(cat) {
        var categoryContainer = generateSearchResultView(cat);
        categoriesContainer.appendChild(categoryContainer);
    });

    // Focus the first movie card in the first category, if any
    if (categoriesContainer.firstChild && categoriesContainer.firstChild.querySelector('.movie-card')) {
        categoriesContainer.firstChild.querySelector('.movie-card').focus();
    }
}




function test() {
    var element = document.getElementById('myElement');
    element.textContent = 'Element modified by JavaScript! 3333';
    element.style.color = 'blue';
    element.style.fontSize = '30px';


    // Find the element with the id 'searchView'
    // let searchViewElement = document.getElementById('searchView');
    // let keyViewElement = document.getElementById('keyView');
    // keyViewElement.innerHTML = 'eeeeeeeee';

// Check if the element exists
    if (element) {
        // Add the class 'highlighted' to the element
        if (element.classList) {
            element.classList.add('highlighted');
        }
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
   let url = 'http://194.164.53.40/movie/fetch/17302';
    fetchData(url).then(function(data) {
        if (data) {
            var categoriesContainer = viewList['Main'].querySelector('#categoriesContainer');
console.log(data);
            // var element = document.getElementById('myElement');
            // element.textContent = 'Element size ' + data.length;

            // console.log(data); // Handle the fetched data
            // Example: Access the title of the first result
            displayMovies(data, categoriesContainer);
        }
    });

    updateFocus(0, 0);
    // test();
});