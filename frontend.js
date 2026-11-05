document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const category = document.getElementById('category').value;
    const minRating = document.getElementById('minRating').value;
    const maxRating = document.getElementById('maxRating').value;
    const releaseYear = document.getElementById('releaseYear').value;

    const queryParams = new URLSearchParams({
        ...(category && { category }),
        ...(minRating && { minRating }),
        ...(maxRating && { maxRating }),
        ...(releaseYear && { releaseYear }),
    });

    const response = await fetch(`/search?${queryParams.toString()}`);
    const movies = await response.json();

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.innerHTML = `
            <h3>${movie.title}</h3>
            <p>Category: ${movie.category}</p>
            <p>Rating: ${movie.rating}</p>
            <p>Release Year: ${movie.releaseYear}</p>
        `;
        resultsContainer.appendChild(movieElement);
    });
});
