// Get the material fields container
const materialFieldsContainer = document.getElementById('material-fields-container');

// Get the add material button
const addMaterialButton = document.getElementById('add-material-button');

// Initialize material count
let materialCount = 0;

// Fetch materials from the server (this should be passed as a JSON object in the template)
const materials = JSON.parse(document.getElementById('materials-data').textContent);

// Function to add material fields
function addMaterialField() {
    // Create a new material field
    const materialField = document.createElement('div');
    materialField.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <label for="material-name-${materialCount}" class="form-label">Material Name:</label>
                <select id="material-name-${materialCount}" name="material_name[]" class="form-select" required onchange="updateUnitOfMeasure(${materialCount})">
                    <option value="">Select Material</option>
                    ${materials.map(material => `<option value="${material.Inventory_ID}" data-unit="${material.UnitOfMeasure}">${material.ItemName}</option>`).join('')}
                </select>
            </div>
            <div class="col-md-6">
                <label for="material-unit-of-measure-${materialCount}" class="form-label">Unit of Measure:</label>
                <input type="text" id="material-unit-of-measure-${materialCount}" name="material_unit_of_measure[]" class="form-control" required readonly>
            </div>
            <div class="col-md-6">
                <label for="material-min-order-qty-${materialCount}" class="form-label">Minimum Order Quantity:</label>
                <input type="number" id="material-min-order-qty-${materialCount}" name="material_min_order_qty[]" class="form-control" required>
            </div>
        </div>
    `;

    // Append the material field to the container
    materialFieldsContainer.appendChild(materialField);

    // Show the materials heading if it's hidden
    const materialsHeading = document.getElementById('materials-heading');
    if (materialsHeading.style.display === 'none') {
        materialsHeading.style.display = 'block';
    }

    // Increment material count
    materialCount++;
}

// Function to update the Unit of Measure based on selected Material
function updateUnitOfMeasure(index) {
    const materialSelect = document.getElementById(`material-name-${index}`);
    const selectedOption = materialSelect.options[materialSelect.selectedIndex];
    const unitOfMeasureInput = document.getElementById(`material-unit-of-measure-${index}`);

    // Set the unit of measure based on the selected material
    if (selectedOption.value) {
        unitOfMeasureInput.value = selectedOption.getAttribute('data-unit');
    } else {
        unitOfMeasureInput.value = '';
    }
}

// Add event listener to the add material button
addMaterialButton.addEventListener('click', addMaterialField);