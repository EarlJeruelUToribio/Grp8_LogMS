document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#addResourcesModal form'); // Select the form in the modal
    
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission to perform validation

            // Get values from the form fields
            const resourceName = document.querySelector('#resource-name').value.trim();
            const resourceCategory = document.querySelector('#resource-category').value.trim();
            const quantity = document.querySelector('#quantity').value.trim();
            const reorderLevel = document.querySelector('#reorder-level').value.trim();

            // Check if any required fields are empty
            if (!resourceName || !resourceCategory || !quantity || !reorderLevel) {
                // Show error alert if any field is missing
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Please fill out all required fields!',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    buttonsStyling: false // Ensures custom styles are applied
                });
                return; // Prevent form submission if validation fails
            }

            // Collect form data if all fields are valid
            const formData = new FormData(form); // Create a FormData object from the form

            // Send a POST request to the server (AJAX)
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', // Indicate that the request is AJAX
                    'X-CSRFToken': getCookie('csrftoken'), // Include CSRF token
                },
            })
            .then(response => {
                if (response.ok) {
                    return response.json(); // Parse JSON response
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Handle success - Show success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: data.message || 'Resource added successfully!',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    },
                    buttonsStyling: false // Ensures custom styles are applied
                }).then(() => {
                    location.reload(); // Reload the page to see the new resource
                });
            })
            .catch(error => {
                // Handle error - Show error alert
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'There was an error processing your request: ' + error.message,
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    buttonsStyling: false // Ensures custom styles are applied
                });
            });
        });
    }
});

// Utility function to get the CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
