document.addEventListener("DOMContentLoaded", function () {
    // Select the form element by its ID
    const form = document.getElementById("signin-form");

    // Add a submit event listener to the form
    form.addEventListener("submit", function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Perform your form validation here
        if (form.checkValidity()) {
            // If validation passes, redirect the user
            window.location.href = "../index-in.html";
        }
    });
});