document.addEventListener("DOMContentLoaded", () => {
    // Fetch materials from the hidden div
    const materialsData = document.getElementById('materials-data').textContent;
    const materials = JSON.parse(materialsData);

    // Initialize material count
    let materialCount = 0;

    // Get the material fields container
    const materialFieldsContainer = document.getElementById('material-fields-container');

    // Function to add material fields
    function addMaterialField() {
        // Create a new material field
        const materialField = document.createElement('div');
        materialField.classList.add('material-field');
        materialField.innerHTML = `
            <div class="row g-3">
                <div class="col-md-4">
                    <label for="material-name-${materialCount}" class="form-label">Material Name:</label>
                    <select id="material-name-${materialCount}" name="material_name[]" class="form-select" required onchange="updateUnitOfMeasure(${materialCount})">
                        <option value="">Select Material</option>
                        ${materials.map(material => `<option value="${material.Inventory_ID}" data-unit="${material.UnitOfMeasure}">${material.ItemName}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="material-unit-of-measure-${materialCount}" class="form-label">Unit of Measure:</label>
                    <input type="text" id="material-unit-of-measure-${materialCount}" name="material_unit_of_measure[]" class="form-control" required readonly>
                </div>
                <div class="col-md- 3">
                    <label for="material-quantity-${materialCount}" class="form-label">Material Quantity:</label>
                    <input type="number" id="material-quantity-${materialCount}" name="material_quantity[]" class="form-control" required>
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-danger" onclick="deleteMaterialField(${materialCount})">Delete</button>
                </div>
            </div>
        `;

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

    // Function to delete a material field
    function deleteMaterialField(index) {
        const materialField = document.querySelector(`.material-field:nth-child(${index + 1})`);
        if (materialField) {
            materialField.remove();
        }
    }

    // Get the add material button
    const addMaterialButton = document.getElementById('add-material-button');

    // Add event listener to the add material button
    addMaterialButton.addEventListener('click', addMaterialField);
});