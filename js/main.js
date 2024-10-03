document.addEventListener("DOMContentLoaded", function() {
    const categoriesContainer = document.getElementById("categories");
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");

    // Initialize app by loading categories
    loadCategories();

    // Handle search button click
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        }
    });

    // Load categories from the server and display them
    async function loadCategories() {
        const categories = await fetchCategories();
        if (categories) {
            categories.forEach(category => {
                displayCategory(category);
            });
        }
    }

    // Display category with its title and horizontal movie list
    function displayCategory(category) {
        const categorySection = document.createElement('div');
        categorySection.className = 'category';

        const categoryTitle = document.createElement('h2');
        categoryTitle.innerText = category.title;
        categorySection.appendChild(categoryTitle);

        const movieList = document.createElement('div');
        movieList.className = 'movie-list';

        category.movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';

            // Add image element
            const movieImage = document.createElement('img');
            movieImage.src = movie.Poster;
            movieImage.alt = movie.Title;
            movieCard.appendChild(movieImage);

            // Add movie title
            const movieTitle = document.createElement('p');
            movieTitle.innerText = movie.Title;
            movieCard.appendChild(movieTitle);

            movieList.appendChild(movieCard);
        });

        categorySection.appendChild(movieList);
        categoriesContainer.appendChild(categorySection);
    }

    // Create a movie card element
    function createMovieCard(movie) {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        const movieImage = document.createElement("img");
        movieImage.src = movie.imageUrl;  // Assuming movie has an 'imageUrl' property
        movieCard.appendChild(movieImage);

        const movieTitle = document.createElement("h4");
        movieTitle.textContent = movie.title;
        movieCard.appendChild(movieTitle);

        // Add click event to show movie details
        movieCard.addEventListener("click", () => showMovieDetails(movie.id));

        return movieCard;
    }

    // Show movie details and available resolutions
    async function showMovieDetails(movieId) {
        const movieDetails = await fetchMovieDetails(movieId);
        if (movieDetails) {
            // Here you would show movie details in a new view and handle resolutions
            console.log("Movie details:", movieDetails);
        }
    }
    
    const fakeMoviesData = [
                            {
                                Title: "Inception",
                                Year: "2010",
                                Rated: "PG-13",
                                Released: "16 Jul 2010",
                                Runtime: "148 min",
                                Genre: "Action, Adventure, Sci-Fi",
                                Director: "Christopher Nolan",
                                Plot: "A thief who steals corporate secrets through the use of dream-sharing technology...",
                                Poster: "https://m.media-amazon.com/images/M/MV5BYTllODYwZjktZDEzYi00ZDZkLWFjZWMtMGVkYzc4NTczNzI0XkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_SX300.jpg"
                            },
                            {
                                Title: "The Dark Knight",
                                Year: "2008",
                                Rated: "PG-13",
                                Released: "18 Jul 2008",
                                Runtime: "152 min",
                                Genre: "Action, Crime, Drama",
                                Director: "Christopher Nolan",
                                Plot: "When the menace known as the Joker wreaks havoc...",
                                Poster: "https://m.media-amazon.com/images/M/MV5BYTllODYwZjktZDEzYi00ZDZkLWFjZWMtMGVkYzc4NTczNzI0XkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_SX300.jpg"
                            }
                        ];


    // Search for movies by query
    async function searchMovies(query) {
        try {
            // Simulating a movie search by filtering from fake data
        	const apiKey = 'ec20351c'; // Your API key
            const response = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}`);
            
        	 const searchResult = await response.json(); 

            // Clear previous categories
            //categoriesContainer.innerHTML =searchResultsText; 
        	 const searchCategory = {
                     title: `Search Results for "${query}"`,
                     movies: [searchResult] // Make it an array to handle it like other categories
                 };
                 displayCategory(searchCategory); // Display the result);
        } catch (error) {
            console.error("Error fetching movie data:", error);
            categoriesContainer.innerHTML = `<p>An error occurred. Please try again later. "${error}"</p>`;
        }
    }


});
