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

let viewList = {
    main: document.getElementById('mainView'),
    series: document.getElementById('seriesView'),
    season: document.getElementById('seasonView'),
    episode: document.getElementById('episodeView'),
    film: document.getElementById('filmView'),
    video: document.getElementById('videoView')
};
let currentViewName = 'main';
viewWorkflow.push('main');
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

const videoPlayer = document.getElementById('videoPlayer');
    // let lastOkPressTime = 0; // Track the last time OK was pressed
    // const doubleClickDelay = 300; // Delay for double click detection (in ms)
    // Request fullscreen when the video is ready to play
    videoPlayer.addEventListener('loadedmetadata', () => {
        // Check if fullscreen is available
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.webkitRequestFullscreen) { // For Safari
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) { // For IE/Edge
            videoPlayer.msRequestFullscreen();
        }
    });


    const exampleMovies = [
        {
            title: 'Popular Movies',
            sublist: [
                {
                    title: 'Series 1',
                    cardImage: "https://m.media-amazon.com/images/M/MV5BYTllODYwZjktZDEzYi00ZDZkLWFjZWMtMGVkYzc4NTczNzI0XkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_SX300.jpg", 
                    description: 'Description of Series 1',
                    type: 'series', // Indicating this is a series
                    sublist: [
                        { 
                            title: 'Season 1', 
                            type: 'season',
                            description: 'Season 1 Description', 
                            cardImage: "https://m.media-amazon.com/images/M/MV5BYTllODYwZjktZDEzYi00ZDZkLWFjZWMtMGVkYzc4NTczNzI0XkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_SX300.jpg", 
                            sublist: [
                        {
                            title: 'episodes 1', 
                            type: 'episode',
                            description: 'episodes 1 Description', 
                            cardImage: "https://m.media-amazon.com/images/M/MV5BYTllODYwZjktZDEzYi00ZDZkLWFjZWMtMGVkYzc4NTczNzI0XkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_SX300.jpg", 
                            sublist: [
                              { 
                                title: 'resolution 1',
                                type: 'video',
                                 description: 'resolution 1 Description',
                                 cardImage: "https://m.media-amazon.com/images/M/MV5BYTllODYwZjktZDEzYi00ZDZkLWFjZWMtMGVkYzc4NTczNzI0XkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_SX300.jpg", 
                                 url: "https://www.w3schools.com/html/mov_bbb.mp4"
                                },
                                { 
                                    title: 'resolution 2',
                                    type: 'video',
                                     description: 'resolution 1 Description',
                                     cardImage: "https://m.media-amazon.com/images/M/MV5BYTllODYwZjktZDEzYi00ZDZkLWFjZWMtMGVkYzc4NTczNzI0XkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_SX300.jpg", 
                                     url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                                    }
                                                                                                   ]}, 
                        {title: 'episodes 2', type: 'episode', description: 'episodes 2 Description', sublist: [
                            { 
                                title: 'resolution 3',
                                type: 'video',
                                 description: 'resolution 2 Description',
                                 cardImage: "https://m.media-amazon.com/images/M/MV5BYTllODYwZjktZDEzYi00ZDZkLWFjZWMtMGVkYzc4NTczNzI0XkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_SX300.jpg", 
                                 url: "https://www.w3schools.com/html/mov_bbb.mp4"
                                }   
                        ]},
                          ] 
                        },
                        { title: 'Season 2', type: 'season', description: 'Season 2 Description', episodes: [] },
                    ]
                },
                {
                    title: 'Movie 1',
                    cardImage: "https://m.media-amazon.com/images/M/MV5BYTllODYwZjktZDEzYi00ZDZkLWFjZWMtMGVkYzc4NTczNzI0XkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_SX300.jpg", 
                    description: 'Description of Movie 1',
                    type: 'film',
                    state: 'movie' // Regular movie
                },
                // Add more movies as needed
            ]
        }
                           
                       ];


// Function to exit the app
function exitApp() {
    console.log("Exiting the app...");
    // Exit the Tizen application
    tizen.application.getCurrentApplication().exit();
}



document.getElementById('searchButton').onclick = () => {
    let query = document.getElementById('searchField').value;
    console.log(query);
};

function handleRemoteInVideo(event){
        switch (event.keyCode) {
            case 13: // Enter key
                if (videoPlayer.paused) {
                    videoPlayer.play();
                } else {
                    videoPlayer.pause();
                }
                    // const currentTime = new Date().getTime();
                    // if (currentTime - lastOkPressTime < doubleClickDelay) {
                    //     // Double click detected, toggle fullscreen
                    //     toggleFullScreen();
                    // }
                    // lastOkPressTime = currentTime;
                break;
            case 37: // Left arrow key (rewind)
            videoPlayer.currentTime -= 10; // Rewind 10 seconds
                break;
            case 39: // Right arrow key (fast-forward)
            videoPlayer.currentTime += 10; // Fast-forward 10 seconds
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

document.addEventListener('keydown', function(event) {
    console.log("key: "+event.keyCode);
    if (currentViewName === 'video') {
        return handleRemoteInVideo(event);
    }

    let keyView = document.getElementById('keyView');
    keyView.innerHTML = "key: "+event.keyCode;
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
    console.log('updateFocus: '+currentViewName);
    if(currentViewName === 'video') {
        return;
    }
    const rows = viewList[currentViewName].querySelectorAll('.selectableRow');
    

    if(rowIndex >= rows.length){
        rowIndex = rows.length -1;
    }else if(rowIndex < 0){
        rowIndex = 0;
    }

    console.log("nextCat: "+rowIndex+ ", catSize: "+rows.length)
    let nextRow = rows[rowIndex];

    if(nextRow == null){
        console.log("nextRow is unknown: "+ rowIndex);
        return;
    }

    const cols = nextRow.querySelectorAll('.selectableCol');

    if(cols != null){
        // Remove highlight from all movies
        cols.forEach(col => col.classList.remove('highlighted'));
    }

    console.log("nextCol: "+colIndex+ ", colsSize: "+cols.length);
  /*  let lastSelectedColumn = nextCategory.dataset.lastSelectedColumn;
    if(movieIndex == 0){
        movieIndex = lastSelectedColumn;
    }
*/
    if(colIndex >= cols.length){
        colIndex = cols.length -1;
    }else if(colIndex < 0){
        colIndex = 0;
    }


  

    
    
    // Highlight the selected movie card
    if (cols.length > 0) {
        cols[colIndex].classList.add('highlighted');
        cols[colIndex].focus(); // Focus on the current movie
    }
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
function navigateMovies(direction) {
        // let view = getActiveView();
    const rows = viewList[currentViewName].querySelectorAll('.selectableRow');
    let currentRow = rows[currentRowIndex];

//console.log("currentCategory: "+ currentCategoryIndex +", col: "+currentMovieIndex);
if(currentRow == null){
    console.log("currentRow is unknown");
    return;
}
    const cols = currentRow.querySelectorAll('.selectableCol');

    
    //currentCategory.dataset.lastSelectedColumn = currentMovieIndex;

    if(cols != null){
        // Remove highlight from all movies
        cols.forEach(col => col.classList.remove('highlighted'));
    }
    

    // Remove highlight from all categories
   // categories.forEach(category => category.classList.remove('highlighted'));


    switch (direction){
        case 'next':
            // in selected row move column right
            updateFocus(currentRowIndex, (currentColIndex + 1));
            break;
        case 'prev':
            // in selected row move column left
            updateFocus(currentRowIndex, (currentColIndex - 1));
            break;
        case 'up':
            // move selected row up
            updateFocus((currentRowIndex -1), 0);
            break;
        case 'down':
            // move selected row up
            updateFocus((currentRowIndex +1), 0);
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


function displayMovies(movies) {
    const categoriesContainer = document.getElementById('categoriesContainer');
    categoriesContainer.innerHTML = ''; // Clear previous movies

    // categories.forEach(movie => {
    //     let categoryContainer = generateSearchResultView('search', movie);
    //     // Add the category container to the main categories container
 
    // });

    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.classList.add('selectableRow');

    let movieListView = generateMovieListView(movies);
    categoryDiv.appendChild(movieListView);


    categoriesContainer.appendChild(categoryDiv);
    // Focus the first movie card in the first category, if any
    if (categoriesContainer.firstChild && categoriesContainer.firstChild.querySelector('.movie-card')) {
        categoriesContainer.firstChild.querySelector('.movie-card').focus();
    }
}

function generateCategoryView_old(category){
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

function generateSublistView(view, type, movies){
    // Create a container for the category
    let categoryContainer = view.querySelector('#sublistContainer');
    if (currentViewName !== 'main') {
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

function generateMovieListView(movies){
    // Create a container for the movies in this category
    let movieList = document.createElement('div');
    movieList.classList.add('movie-list'); // Add class to apply any horizontal scrolling styles if needed
    movies.forEach(movie => {
       let movieCard = generateMovieCard(movie)
       movieList.appendChild(movieCard);
    });
    return movieList
}

function generateMovieCard(movie){
    let movieCard = document.createElement('div');
    movieCard.classList.add('movie-card'); // Add class for identification
    movieCard.classList.add('selectableCol');
    movieCard.innerHTML = `<h3>${movie.title}</h3><img src="${movie.cardImage}" alt="${movie.title}">`;
    movieCard.tabIndex = 0; // Make the movie card focusable
    // movieCard.dataset.movieId = movieCounter++;
    movieCard.onclick = () => showMovieDetails(movie); // Show details on click
    return movieCard;
}


function goBack() {
    console.log(viewWorkflow);
    let lastView = viewWorkflow.pop();
    console.log('goback:lastView: '+ lastView);
    console.log(viewWorkflow);
    viewList[lastView].style.display = 'none';
    let previousView =  viewWorkflow[viewWorkflow.length -1];
    console.log('goback:previousView: '+ previousView);
    viewList[previousView].style.display = 'block';
    currentViewName = previousView;
    updateFocus(0,0);
}

function handleBackPress() {
    // Check if user is in the main view
    console.log('handleBackPress: '+currentViewName + ', count: '+backPressCount);
    if (currentViewName === 'main' || currentViewName === 'video') {
        if (backPressCount === 0) {
            backPressCount += 1;
            console.log("Press back again to exit.");
            // Start a timer to reset the backPressCount after 1 second
            backPressTimer = setTimeout(() => {
                backPressCount = 0;
            }, 1000);
        } else {
            if (currentViewName === 'video') {
                videoPlayer.pause();
                if (document.fullscreenElement) {
                    document.exitFullscreen(); // Exit fullscreen
                }
                backPressCount = 0;
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
    let type = movie.type.toLowerCase();
    if (type === null) {
        console.log('unknown movie type');
        return;
    }
    let view = viewList[type];
    if (view === null) {
        console.log('unknown movie type: '+type);
        return;
    }
    showView(type);


    if (type === 'video') {
        videoPlayer.innerHTML = '';
        // let videoElement = view.querySelector('video');
        let videoSource = document.createElement('source');
        videoSource.src = movie.url;
        videoSource.type = 'video/mp4';
        videoPlayer.appendChild(videoSource);
        updateFocus(0,0); 
        return;
    }

    view.querySelector('#title').innerHTML = `<h4>${movie.title}</h4>`;

    view.querySelector('#image').src = movie.cardImage;

    view.querySelector('#description').innerText = movie.description;

    if (movie.sublist == null || movie.sublist.length === 0) {
        return;
    }

    // let category = {
    //     title: type,
    //     sublist: movie.sublist
    // };


    
    generateSublistView(view, type, movie.sublist);

    updateFocus(0,0); 
    // if (movie.type === 'series') {
    //     displaySeasons(movie.sublist); // Show seasons for series
    // } else if (movie.type === 'season') {
    //     displayEpisodes(movie.sublist); // Show seasons for series
    // }else {
    //     // Hide the seasons container if it's not a series
    //     document.getElementById('seasonsContainer').style.display = 'none';
    // }
}

function showView(type){
    console.log("showView: " +type);
    Object.keys(viewList).forEach(name => {
        if (type === name) {
        console.log("show: " +name);
        viewList[name].style.display = 'block';
        currentViewName = name;
        viewWorkflow.push(name);
        }else{
            console.log("hide: " +name);
            viewList[name].style.display = 'none';
        }
    });
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


// Example usage
// const url = 'https://raw.githubusercontent.com/alyabroudy1/omerFlex-php/refs/heads/main/test-search.json'; // Replace with your actual URL
// const url = 'https://gist.githubusercontent.com/deepakpk009/99fd994da714996b296f11c3c371d5ee/raw/28c4094ae48892efb71d5122c1fd72904088439b/media.json'
const url = "http://194.164.53.40/movie/search/sonic";
fetchData(url).then(data => {
    if (data) {
        console.log(data); // Handle the fetched data
        // Example: Access the title of the first result
        displayMovies(data);
    }
});





updateFocus(0, 0);
