document.addEventListener("DOMContentLoaded", function () {
    // Get references to the input and anchor elements
    const searchInput = document.getElementById("search-input");
    const searchLink = document.getElementById("search-link");
    const baseHref = searchLink.getAttribute("href");

    // Add an event listener to the search input to update the href when it changes
    searchInput.addEventListener("input", function () {
        const searchValue = encodeURIComponent(searchInput.value); // Encode the search query
        const searchURL = `${baseHref}?search=${searchValue}`; // Construct the URL

        // Set the href attribute of the anchor element
        searchLink.href = searchURL;
    });
    
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
    
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
    
            form.classList.add('was-validated')
        }, false)
    });
});