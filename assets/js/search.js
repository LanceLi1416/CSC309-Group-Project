document.addEventListener("DOMContentLoaded", function () {
    // Get the search query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    // Check if a search query was submitted and display it
    if (searchQuery) {
        const searchTermElement = document.getElementById("search-term");
        searchTermElement.textContent = searchQuery;
    }

    const filterToggleButton = document.getElementById('filter-toggle-button');
    const filterSmallDiv = document.getElementById('filter-small');

    filterToggleButton.addEventListener('click', () => {
        filterSmallDiv.classList.toggle('show');
    });
});