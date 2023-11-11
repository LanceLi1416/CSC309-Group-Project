const filterToggleButton = document.getElementById('filter-toggle-button');
    const filterSmallDiv = document.getElementById('filter-small');

    filterToggleButton.addEventListener('click', () => {
        filterSmallDiv.classList.toggle('show');
    });

const dropdownItems = document.querySelectorAll('.dropdown-item');
// on click of dropdown item, set the value of the dropdown button to the value of the dropdown item
dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
        const dropdownButton = item.parentElement.parentElement.parentElement.querySelector('.dropdown-toggle');
        dropdownButton.innerHTML = item.innerHTML;
        dropdownButton.classList.remove('btn-danger');
        dropdownButton.classList.remove('btn-warning');
        dropdownButton.classList.remove('btn-info');
        dropdownButton.classList.remove('btn-success');
        if (item.innerHTML === "Available") {
            dropdownButton.classList.add('btn-info');
        }
        if (item.innerHTML === "Pending") {
            dropdownButton.classList.add('btn-secondary');
        }
        if (item.innerHTML === "Adopted") {
            dropdownButton.classList.add('btn-warning');
        }
        if (item.innerHTML === "Withdrawn") {
            dropdownButton.classList.add('btn-danger');
        }
    });
});