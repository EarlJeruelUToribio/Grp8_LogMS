document.getElementById('addCategoryForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const categoryName = document.getElementById('categoryName').value;

    fetch('/add-category/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken'), // Function to get CSRF token
        },
        body: new URLSearchParams({
            'categoryName': categoryName,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Optionally, you can update the category dropdown here
            const categorySelect = document.getElementById('item-category');
            const newOption = document.createElement('option');
            newOption.value = data.category_id;
            newOption.textContent = data.category_name;
            categorySelect.appendChild(newOption);
            categorySelect.value = data.category_id; // Set the new category as selected
            Swal.fire('Success!', 'Category added successfully!', 'success'); // SweetAlert for success
        } else {
            Swal.fire('Error!', data.error, 'error'); // SweetAlert for error
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error!', 'An error occurred while adding the category.', 'error');
    });
});

// Function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie string begins with the name we want
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}