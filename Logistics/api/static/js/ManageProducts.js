document.addEventListener("DOMContentLoaded", () => {
    // SEARCH FUNCTIONALITY
    const searchBar = document.getElementById("search-bar");
    const productTable = document.querySelector(".product-table tbody");
    const allRows = Array.from(productTable.rows);

    const filterProducts = () => {
        const searchTerm = searchBar.value.toLowerCase();
        allRows.forEach(row => {
            const productName = row.cells[1].textContent.toLowerCase();
            const productCategory = row.cells[2].textContent.toLowerCase();
            if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    };

    searchBar.addEventListener("input", filterProducts);

    // TOGGLE AVAILABILITY FUNCTIONALITY
    window.toggleAvailability = (button) => {
        const currentStatus = button.getAttribute('data-available');
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        button.textContent = newStatus;
        button.setAttribute('data-available', newStatus);
        // Add AJAX call if needed to update the backend
    };

    // MATERIAL FIELDS DYNAMIC HANDLING
    const materialsData = document.getElementById('materials-data').textContent;
    const materials = JSON.parse(materialsData);
    let materialCount = 0;
    const materialFieldsContainer = document.getElementById('material-fields-container');
    const materialsHeading = document.getElementById('materials-heading');

    const addMaterialField = () => {
        const materialField = document.createElement('div');
        materialField.classList.add('material-field');
        materialField.innerHTML = `
            <div class="row g-3 align-items-center">
                <div class="col-md-4">
                    <label for="material-name-${materialCount}" class="form-label">Material Name:</label>
                    <select id="material-name-${materialCount}" name="material_name[]" class="form-select" required onchange="updateUnitOfMeasure(${materialCount})">
                        <option value="">Select Material</option>
                        ${materials.map(material => `
                            <option value="${material.Inventory_ID}" data-unit="${material.UnitOfMeasure}">
                                ${material.ItemName}
                            </option>`).join('')}
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="material-unit-of-measure-${materialCount}" class="form-label">Unit of Measure:</label>
                    <input type="text" id="material-unit-of-measure-${materialCount}" name="material_unit_of_measure[]" class="form-control" readonly>
                </div>
                <div class="col-md-3">
                    <label for="material-quantity-${materialCount}" class="form-label">Quantity:</label>
                    <input type="number" id="material-quantity-${materialCount}" name="material_quantity[]" class="form-control" required>
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-danger" onclick="deleteMaterialField(${materialCount})">Delete</button>
                </div>
            </div>
        `;
        materialFieldsContainer.appendChild(materialField);
        if (materialsHeading.style.display === 'none') materialsHeading.style.display = 'block';
        materialCount++;
    };

    window.updateUnitOfMeasure = (index) => {
        const materialSelect = document.getElementById(`material-name-${index}`);
        const selectedOption = materialSelect.options[materialSelect.selectedIndex];
        const unitOfMeasureInput = document.getElementById(`material-unit-of-measure-${index}`);
        unitOfMeasureInput.value = selectedOption.value ? selectedOption.getAttribute('data-unit') : '';
    };

    window.deleteMaterialField = (index) => {
        const materialField = document.querySelectorAll('.material-field')[index];
        if (materialField) materialField.remove();
    };

    const addMaterialButton = document.getElementById('add-material-button');
    addMaterialButton.addEventListener('click', addMaterialField);
});
