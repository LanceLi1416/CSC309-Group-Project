document.addEventListener("DOMContentLoaded", function () {
	// Get the input element
	let inputElement = document.getElementById("input4");

	// Add an event listener to allow the user to edit
	inputElement.addEventListener("input", function () {
		// Update the default value whenever the user edits the input
		defaultValue = inputElement.value;
	});
});
