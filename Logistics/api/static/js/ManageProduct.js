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
    // Create the options for the select element
    const options = materials.map(material => 
        `<option value="${material.id}" data-unit="${material.UnitOfMeasure}">${material.name}</option>`
    ).join('');

    return `
        <div class="col-md-5">
            <select class="form-select ingredient-select" required onchange="updateSmallerUnits(this)">
                <option value="" disabled selected>Select Ingredient</option>
                ${options} <!-- Insert the options here -->
            </select>
        </div>
            <input type="number" class="form-control" placeholder="Quantity" required>
        </div>
        <div class="col-md-2">
            <select class="form-select unit-select" required>
                <option value="" disabled selected>Select Unit</option>
                <!-- Smaller units will be populated here -->
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

async function handleAddProductSubmit(event) {
    event.preventDefault(); // Prevent default submission

    const formData = new FormData(this);
    const productName = formData.get("product_name").trim();
    const productCategory = formData.get("product_category");

    try {
        console.log("🔍 Checking for duplicate...");

        // 🔍 Send API request to check for duplicates
        const checkResponse = await fetch(`/api/check-duplicate-product/?product_name=${encodeURIComponent(productName)}&product_category=${encodeURIComponent(productCategory)}`);

        if (!checkResponse.ok) {
            console.error("❌ API Request Failed:", checkResponse.status);
            return;
        }

        const checkData = await checkResponse.json();
        console.log("🛠 Duplicate Check Response:", checkData);

        if (checkData.exists) {
            console.warn("🚨 Duplicate detected! Product not added.");
            await Swal.fire({
                icon: "error",
                title: "Duplicate Product",
                text: "A product with the same name and category already exists!",
            });
            return; // 🚫 STOP execution
        }

        console.log("✅ No duplicate found. Proceeding...");

        // ✅ Send Add Product request
        const addResponse = await fetch(addProductUrl, {
            method: "POST",
            body: formData,
        });

        const data = await addResponse.json();
        console.log("✅ Product Added Response:", data);

        if (data.success) {
            await Swal.fire({
                icon: "success",
                title: "Product Added!",
                text: "The product has been successfully added.",
            });
            location.reload();
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: data.message || "Something went wrong!",
            });
        }
    } catch (error) {
        console.error("❌ Error:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "An error occurred while adding the product.",
        });
    }
}

// Function to collect ingredients data from the form
function collectIngredientsData() {
    const ingredientRows = document.querySelectorAll('#ingredients-section .row');
    const materials = [];

    ingredientRows.forEach(row => {
        const ingredientSelect = row.querySelector('.ingredient-select');
        const quantityInput = row.querySelector('input[type="number"]');
        const unitSelect = row.querySelector('.unit-select');

        if (ingredientSelect.value && quantityInput.value && unitSelect.value) {
            materials.push({
                id: ingredientSelect.value,
                quantity: quantityInput.value,
                unit: unitSelect.value,
            });
        }
    });

    return materials;
}

// Function to convert quantity to a standard unit (if needed)
function convertToStandardUnit(quantity, unit) {
    // Implement conversion logic based on your requirements
    // For example, if the base unit is kilograms, convert grams to kilograms
    switch (unit) {
        case 'grams':
            return quantity / 1000; // Convert grams to kilograms
        case 'milligrams':
            return quantity / 1000000; // Convert milligrams to kilograms
        case 'liters':
            return quantity; // Assume liters is the base unit
        case 'milliliters':
            return quantity / 1000; // Convert milliliters to liters
        case 'centimeters':
            return quantity / 100; // Convert centimeters to meters
        case 'millimeters':
            return quantity / 1000; // Convert millimeters to meters
        default:
            return quantity; // No conversion needed
    }
}