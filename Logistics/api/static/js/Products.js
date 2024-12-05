// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const addIngredientButton = document.getElementById('add-ingredient-button');
    const addProductForm = document.getElementById('add-product-form');

    // Event listeners
    addIngredientButton.addEventListener('click', addIngredientRow);
    addProductForm.addEventListener('submit', handleAddProductSubmit);
});

// Function to add a new ingredient row
function addIngredientRow() {
    const ingredientsSection = document.getElementById('ingredients-section');
    const newIngredientRow = document.createElement('div');
    newIngredientRow.classList.add('row', 'mb-2', 'align-items-center');
    newIngredientRow.innerHTML = getIngredientRowHTML();
    ingredientsSection.appendChild(newIngredientRow);
}

// Function to generate HTML for a new ingredient row
function getIngredientRowHTML() {
    return `
        <div class="col-md-5">
            <select class="form-select ingredient-select" required>
                <option value="" disabled selected>Select Ingredient</option>
                {% for material in materials %}
                    <option value="{{ material.Inventory_ID }}">{{ material.ItemName }}</option>
                {% endfor %}
            </select>
        </div>
        <div class="col-md-5">
            <input type="number" class="form-control" placeholder="Quantity" required>
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

// Function to handle the form submission for adding a product
function handleAddProductSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this); // Create FormData object
    const materials = collectIngredientsData();

    // Append materials to FormData
    materials.forEach(material => {
        formData.append(`material_name[]`, material.id);
        formData.append(`material_quantity[]`, material.quantity);
    });

    // Send data to the server
    fetch(addProductUrl, { // Use the variable defined in the template
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product added successfully!');
            location.reload(); // Reload the page to see the new product
        } else {
            alert('Error adding product: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to collect ingredient data from the form
function collectIngredientsData() {
    const ingredientSelects = document.querySelectorAll('.ingredient-select');
    const ingredientQuantities = document.querySelectorAll('input[placeholder="Quantity"]');

    const materials = [];
    for (let i = 0; i < ingredientSelects.length; i++) {
        const ingredientId = ingredientSelects[i].value;
        const quantity = ingredientQuantities[i].value;
        if (ingredientId && quantity) {
            materials.push({ id: ingredientId, quantity: quantity });
        }
    }
    return materials;
}