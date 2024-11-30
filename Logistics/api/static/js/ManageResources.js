document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form'); // Select the form in the modal

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form); // Create a FormData object from the form

        // Send a POST request to the server
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
            // Handle success
            alert(data.message); // Show success message
            location.reload(); // Reload the page to see the new resource
        })
        .catch(error => {
            // Handle error
            alert('Error: ' + error.message);
        });
    });
});

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