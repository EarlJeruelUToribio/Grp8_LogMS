document.addEventListener('DOMContentLoaded', function () {
    const materialsDataElement = document.getElementById('materials-data');
    if (!materialsDataElement) {
        console.error('Materials data element not found.');
        return;
    }

    const materialsData = JSON.parse(materialsDataElement.textContent);
    const materialsSection = document.getElementById('materials-section');
    const materialFieldsContainer = document.getElementById('material-fields-container');

    if (!materialsSection || !materialFieldsContainer) {
        console.error('Materials section or fields container not found.');
        return;
    }

    // Initialize material count
    let materialCount = 0;

    // Add Material functionality
    const addMaterialButton = document.getElementById('add-material-button');
    if (!addMaterialButton) {
        console.error('Add material button not found.');
        return;
    }

    addMaterialButton.addEventListener('click', function () {
        const materialField = document.createElement('div');
        materialField.classList.add('row', 'mb-3', 'material-field');

        materialField.innerHTML = `
            <div class="col-md-8">
                <select name="material_name[]" class="form-select" required>
                    <option value="">Select Material</option>
                    ${materialsData.map(material => `<option value="${material.Inventory_ID}" data-unit="${material.UnitOfMeasure}">${material.ItemName}</option>`).join('')}
                </select>
            </div>
            <div class="col-md-4">
                <input type="number" name="material_min_order_qty[]" class="form-control" placeholder="Min Order Qty" required>
                <button type="button" class="btn btn-danger remove-material-button">✖</button>
            </div>
        `;

        materialFieldsContainer.appendChild(materialField);
        materialsSection.querySelector('h3').style.display = 'block'; // Show materials heading

        // Add event listener to remove material field
        materialField.querySelector('.remove-material-button').addEventListener('click', function () {
            materialFieldsContainer.removeChild(materialField);
            if (materialFieldsContainer.children.length === 0) {
                materialsSection.querySelector('h3').style.display = 'none'; // Hide heading if no materials
            }
        });
    });
});