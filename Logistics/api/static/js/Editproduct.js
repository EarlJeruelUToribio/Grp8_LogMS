document.addEventListener('DOMContentLoaded', function () {
    // Attach click event to all edit buttons
    const editButtons = document.querySelectorAll('#edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const productId = row.getAttribute('data-product-id');
            const productName = row.cells[0].innerText;
            const productCategory = row.cells[1].innerText;
            const productDescription = row.cells[2].innerText;
            const productPrice = row.cells[3].innerText.replace('₱', '').trim();

            // Populate the edit modal with the product data
            document.getElementById('edit-product-name').value = productName;
            document.getElementById('edit-product-category').value = productCategory;
            document.getElementById('edit-product-description').value = productDescription;
            document.getElementById('edit-product-price').value = productPrice;

            // Set the form action to the edit URL
            const editForm = document.getElementById('edit-product-form');
            editForm.action = `/edit_product/${productId}/`; // Adjust the URL as needed

            // Populate the ingredients section
            const editIngredientsSection = document.getElementById('edit-ingredients-section');
            editIngredientsSection.innerHTML = ''; // Clear existing ingredients

            // Add existing ingredients to the modal
            const ingredients = JSON.parse(row.getAttribute('data-ingredients')); // Retrieve ingredients data
            ingredients.forEach(ingredient => {
                const newIngredientRow = document.createElement('div');
                newIngredientRow.classList.add('row', 'mb-2', 'align-items-center');
                newIngredientRow.innerHTML = getIngredientRowHTML(ingredient.id, ingredient.quantity);
                editIngredientsSection.appendChild(newIngredientRow);
            });
        });
    });
});

// Function to generate HTML for a new ingredient row
function getIngredientRowHTML(selectedId = '', selectedQuantity = '') {
    // Create the options for the select element
    const options = materials.map(material => 
        `<option value="${material.id}" ${material.id === selectedId ? 'selected' : ''} data-unit="${material.unit}">${material.name}</option>`
    ).join('');

    return `
        <div class="col-md-5">
            <select class="form-select ingredient-select" required onchange="updateSmallerUnits(this)">
                <option value="" disabled selected>Select Ingredient</option>
                ${options} <!-- Insert the options here -->
            </select>
        </div>
        <div class="col-md-5">
            <input type="number" class="form-control" placeholder="Quantity" value="${selectedQuantity}" required>
        </div>
        <div class="col-md-2">
            <select class="form-select unit-select" required>
                <option value="" disabled selected>Select Unit</option>
            </select>
        </div>
        <div class="col-md-1">
            <button type="button" class="btn btn-danger remove-ingredient" onclick="removeIngredient(this)">Remove</button>
        </div>
    `;
}

// Function to update smaller units based on the selected ingredient
function updateSmallerUnits(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const selectedUnit = selectedOption.getAttribute('data-unit');
    const smallerUnitSelect = selectElement.closest('.row').querySelector('.unit-select');

    // Clear existing options
    smallerUnitSelect.innerHTML = '';

    // Define smaller units based on the selected unit
    let smallerUnits = [];
    switch (selectedUnit) {
        case 'kg':
            smallerUnits = ['grams', 'milligrams'];
            break;
        case 'l':
            smallerUnits = ['liters', 'milliliters'];
            break;
        case 'm':
            smallerUnits = ['centimeters', 'millimeters'];
            break;
        case 'pcs':
        case 'box':
            smallerUnits = []; // No smaller units
            break;
    }

    // Populate smaller units
    smallerUnits.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit.charAt(0).toUpperCase() + unit.slice(1); // Capitalize first letter
        smallerUnitSelect.appendChild(option);
    });
}

// Function to remove an ingredient row
function removeIngredient(button) {
    button.closest('.row').remove();
}

// Event listener for the edit product form submission
document.getElementById('edit-product-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this); // Create FormData object
    const ingredients = collectIngredientsData(); // Collect ingredient data

    // Append ingredients to FormData
    ingredients.forEach(ingredient => {
        formData.append(`material_name[]`, ingredient.id);
        formData.append(`material_quantity[]`, ingredient.quantity);
        formData.append(`material_unit[]`, ingredient.unit);
    });

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value; // Get CSRF token

    // Send data to the server
    fetch(this.action, { // Use the action URL from the form
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken, // Include CSRF token
        },
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Show SweetAlert for successful product update
            Swal.fire({
                icon: 'success',
                title: 'Product Updated!',
                text: 'The product has been successfully updated.',
            }).then(() => {
                location.reload(); // Reload the page to see the updated product
            });
        } else {
            // Handle errors
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.message || 'Something went wrong!',
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while updating the product: ' + error.message,
        });
    });
});

// Function to collect ingredient data from the form
function collectIngredientsData() {
    const ingredientRows = document.querySelectorAll('#edit-ingredients-section .row');
    const ingredients = [];

    ingredientRows.forEach(row => {
        const selectElement = row.querySelector('.ingredient-select');
        const quantityInput = row.querySelector('input[type="number"]');
        const unitSelect = row.querySelector('.unit-select');

        if (selectElement.value && quantityInput.value) {
            ingredients.push({
                id: selectElement.value,
                quantity: quantityInput.value,
                unit: unitSelect.value,
            });
        }
    });

    return ingredients;
}