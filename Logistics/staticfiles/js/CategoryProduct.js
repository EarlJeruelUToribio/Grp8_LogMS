document.addEventListener('DOMContentLoaded', function () {
    const addCategoryForm = document.getElementById('add-category-form');

    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission

            const categoryName = document.getElementById('category-name').value.trim(); // Trim whitespace

            // Check if category name is empty
            if (!categoryName) {
                Swal.fire('Error', 'Category name cannot be empty.', 'error');
                return; // Exit if the category name is empty
            }

            fetch('/add-product-category/', { // Updated URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'), // Get CSRF token
                },
                body: JSON.stringify({ categoryName: categoryName }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const productCategorySelect = document.getElementById('product-category');
                    const newOption = document.createElement('option');
                    newOption.value = data.category_id;
                    newOption.textContent = data.category_name;
                    productCategorySelect.appendChild(newOption);
                    productCategorySelect.value = data.category_id; // Set the new category as selected

                    Swal.fire('Success', 'Category added successfully!', 'success');
                    $('#ProductCategoryModal').modal('hide');
                } else {
                    Swal.fire('Error', data.error, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while adding the category.', 'error');
            });
        });
    }

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
});