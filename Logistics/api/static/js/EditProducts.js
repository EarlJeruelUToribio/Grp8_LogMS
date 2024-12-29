// EditProduct.js

document.addEventListener('DOMContentLoaded', function () {
    // Attach click event to all edit buttons
    const editButtons = document.querySelectorAll('#edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const productId = row.getAttribute('data-product-id');
            const productName = row.cells[1].innerText;
            const productCategory = row.cells[2].innerText;
            const productDescription = row.cells[3].innerText;
            const productPrice = row.cells[4].innerText.replace('₱', '').trim();
            const productImage = row.cells[5].querySelector('img') ? row.cells[5].querySelector('img').src : '';

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
            const ingredients = JSON.parse(row.getAttribute('data-ingredients')); // Assuming you pass ingredients as JSON
            ingredients.forEach(ingredient => {
                const newIngredientRow = document.createElement('div');
                newIngredientRow.classList.add('row', 'mb-2', 'align-items-center');
                newIngredientRow.innerHTML = getIngredientRowHTML(ingredient.id, ingredient.quantity);
                editIngredientsSection.appendChild(newIngredientRow);
            });
        });
    });

    // Add event listener for adding ingredients in the edit modal
    const editAddIngredientButton = document.getElementById('edit-add-ingredient-button');
    editAddIngredientButton.addEventListener('click', addEditIngredientRow);
});

// Function to add a new ingredient row in the edit modal
function addEditIngredientRow() {
    const editIngredientsSection = document.getElementById('edit-ingredients-section');
    const newIngredientRow = document.createElement('div');
    newIngredientRow.classList.add('row', 'mb-2', 'align-items-center');
    newIngredientRow.innerHTML = getIngredientRowHTML(); // Call the same function to get the HTML
    editIngredientsSection.appendChild(newIngredientRow);
}

// Function to generate HTML for a new ingredient row
function getIngredientRowHTML(selectedId = '', selectedQuantity = '') {
    // Create the options for the select element
    const options = materials.map(material => 
        `<option value="${material.id}" ${material.id === selectedId ? 'selected' : ''}>${material.name}</option>`
    ).join('');

    return `
        <div class="col-md-5">
            <select class="form-select ingredient-select" required>
                <option value="" disabled selected>Select Ingredient</option>
                ${options} <!-- Insert the options here -->
            </select>
        </div>
        <div class="col-md-5">
            <input type="number" class="form-control" placeholder="Quantity" value="${selectedQuantity}" required>
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-danger remove-ingredient" onclick="removeIngredient(this)">Remove</button>
        </div>
    `;
}

// Function to remove an ingredient row
function removeIngredient(button) {
    button.closest('.row').remove();
}