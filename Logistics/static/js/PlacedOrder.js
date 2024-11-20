document.addEventListener('DOMContentLoaded', () => {
    const materialSelect = document.getElementById('material');
    const quantityInput = document.getElementById('quantity');
    const basePriceSpan = document.getElementById('base-price');
    const totalCostSpan = document.getElementById('total-cost');
    const unitOfMeasureSpan = document.getElementById('unit-of-measure');
    const supplierSelect = document.getElementById('supplier-name');

    materialSelect.addEventListener('change', () => {
        const selectedMaterial = materialSelect.options[materialSelect.selectedIndex];
        const basePrice = selectedMaterial.getAttribute('data-price');
        const uom = selectedMaterial.getAttribute('data-uom');
        const suppliersData = JSON.parse(selectedMaterial.getAttribute('data-suppliers'));

        unitOfMeasureSpan.textContent = uom;
        basePriceSpan.textContent = basePrice;
        supplierSelect.innerHTML = '<option value="" disabled selected>Select Supplier</option>'; // Reset supplier options

        // Populate supplier options based on selected material
        suppliersData.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.Supplier_ID; // Assuming Supplier_ID is the identifier
            option.textContent = supplier.SupplierName; // Display the supplier name
            supplierSelect.appendChild(option);
        });

        calculateTotalCost();
    });

    quantityInput.addEventListener('input', () => {
        calculateTotalCost();
    });

    function calculateTotalCost() {
        const quantity = parseInt(quantityInput.value) || 0;  // Default to 0 if NaN
        const basePrice = parseFloat(basePriceSpan.textContent) || 0;  // Default to 0 if NaN
        const totalCost = quantity * basePrice;
        totalCostSpan.textContent = totalCost.toFixed(2);
    }
});