const apiUrl = 'http://www.omdbapi.com/?t=t&apikey=ec20351c';  // Replace with your API endpoint

// Fetch categories from server
async function fetchCategories() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.categories;  // Assuming the API response contains a 'categories' array
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Fetch movie details based on movie ID
async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`${apiUrl}/${movieId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
}
