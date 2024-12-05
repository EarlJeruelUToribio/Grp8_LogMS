// Add event listener to the "Add Product" button
document.getElementById('add-product-button').addEventListener('click', function() {
    addProductFields(); // Call the function to add new product fields
});

// Function to add product fields
function addProductFields() {
    const productFieldsContainer = document.getElementById('product-fields-container');
    const productsHeading = document.getElementById('products-heading');

    // Show the PRODUCTS heading if no products have been added yet
    if (productFieldsContainer.children.length === 0) {
        productsHeading.style.display = 'block'; // Show the heading
    }

    // Create a new div for the product fields
    const newProductDiv = document.createElement('div');
    newProductDiv.classList.add('row', 'g-3', 'mt-3'); // Add classes for styling

    // Raw Materials
    newProductDiv.innerHTML += `
        <div class="col-md-6">
            <label for="raw-materials" class="form-label">Raw Materials:</label>
            <select id="raw-materials" name="raw-materials" class="form-select" required>
                <option value="material1">Material 1</option>
                <option value="material2">Material 2</option>
                <option value="material3">Material 3</option>
            </select>
        </div>
    `;

    // Products
    newProductDiv.innerHTML += `
        <div class="col-md-6">
            <label for="products" class="form-label">Products:</label>
            <select id="products" name="products" class="form-select" required>
                <option value="egg">Egg</option>
                <option value="chicken">Chicken</option>
                <option value="pork">Pork</option>
            </select>
        </div>
    `;

    // Minimum Order Quantity
    newProductDiv.innerHTML += `
        <div class="col-md-6">
            <label for="min-order-quantity" class="form-label">Minimum Order Quantity:</label>
            <input type="number" id="min-order-quantity" name="min-order-quantity" class="form-control" required>
        </div>
    `;

    // Unit of Measure
    newProductDiv.innerHTML += `
        <div class="col-md-6">
            <label for="unit-of-measure" class="form-label">Unit of Measure:</label>
            <select id="unit-of-measure" name="unit-of-measure" class="form-select" required>
                <option value="g">Gram (g)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="l">Liter (l)</option>
                <option value="kl">Kiloliter (kl)</option>
                <option value="m">Meter (m)</option>
                <option value="cm">Centimeter (cm)</option>
                <option value="mm">Millimeter (mm)</option>
            </select>
        </div>
    `;

    // Append the new product fields to the container
    productFieldsContainer.appendChild(newProductDiv);
}
