const filterToggleButton = document.getElementById('filter-toggle-button');
    const filterSmallDiv = document.getElementById('filter-small');

    filterToggleButton.addEventListener('click', () => {
        filterSmallDiv.classList.toggle('show');
    });