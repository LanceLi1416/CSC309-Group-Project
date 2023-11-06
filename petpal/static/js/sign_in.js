document.addEventListener("DOMContentLoaded", function () {
    // Select the form element by its ID
    const form = document.getElementById("signin-form");

    // Add a submit event listener to the form
    form.addEventListener("submit", function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the selected radio button value
        const petSeekerType = document.querySelector('input[id="petseeker"]:checked');
        const shelterType = document.querySelector('input[id="petshelter"]:checked');

        // Perform your form validation here
        if (form.checkValidity()) {
            // If validation passes, redirect the user
            if (petSeekerType) {
                window.location.href = "../../../html/index-in.html";
            }
            else if (shelterType) {
                window.location.href = "../../../html/index-in-shelter.html";
            }
            else {
                window.location.href = "../../../html/index-in.html";
            }
        }
    });
});