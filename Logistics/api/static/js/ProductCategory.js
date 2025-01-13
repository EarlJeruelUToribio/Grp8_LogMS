document.addEventListener('DOMContentLoaded', function () {
    const addCategoryForm = document.getElementById('add-category-form');

    addCategoryForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const categoryName = document.getElementById('category-name').value;

        fetch('/add-category/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // Get CSRF token
            },
            body: JSON.stringify({ categoryName: categoryName }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Optionally, you can add the new category to the dropdown
                const productCategorySelect = document.getElementById('product-category');
                const newOption = document.createElement('option');
                newOption.value = data.category_id;
                newOption.textContent = data.category_name;
                productCategorySelect.appendChild(newOption);
                productCategorySelect.value = data.category_id; // Set the new category as selected

                // Show success message
                Swal.fire('Success', 'Category added successfully!', 'success');
                // Close the modal
                $('#ProductCategoryModal').modal('hide');
            } else {
                Swal.fire('Error', data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire ('Error', 'An error occurred while adding the category.', 'error');
        });
    });

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
});