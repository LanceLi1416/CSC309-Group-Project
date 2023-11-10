document.addEventListener("DOMContentLoaded", function () {
	// Get the input element
	let inputElement = document.getElementById("input4");

	// Add an event listener to allow the user to edit
	inputElement.addEventListener("input", function () {
		// Update the default value whenever the user edits the input
		defaultValue = inputElement.value;
	});
});

function previewImage(event) {
    var input = event.target;

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var imagePreview = document.getElementById('profile-image');
                    imagePreview.src = e.target.result;

                    imagePreview.style.height = "100px";
                    imagePreview.style.width = "100px";
                    imagePreview.style.objectFit = "cover";
                    imagePreview.style.borderRadius = "50%";
                    
                }
                reader.readAsDataURL(input.files[0]);
            }
}