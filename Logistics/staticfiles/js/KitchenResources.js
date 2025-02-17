document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#addKitchenResourceForm'); // Select the form in the modal
    
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission to perform validation

            // Get values from the form fields
            const resourceName = document.querySelector('#kitchen-resource-name').value.trim();
            const resourceCategory = document.querySelector('#kitchen-resource-category').value.trim();
            const quantity = document.querySelector('#kitchen-quantity').value.trim();
            const reorderLevel = document.querySelector('#kitchen-reorder-level').value.trim();

            // Check if any required fields are empty
            if (!resourceName || !resourceCategory || !quantity || !reorderLevel) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Please fill out all required fields!',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                });
                return; // Prevent form submission if validation fails
            }

            // Collect form data if all fields are valid
            const formData = new FormData(form);

            // Send a POST request to the server (AJAX)
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: data.message || 'Kitchen resource added successfully!',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    },
                    buttonsStyling: false
                }).then(() => {
                    location.reload(); // Reload the page to see the new resource
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'There was an error processing your request: ' + error.message,
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
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