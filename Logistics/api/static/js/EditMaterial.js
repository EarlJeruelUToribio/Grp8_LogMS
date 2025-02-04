document.addEventListener('DOMContentLoaded', function () {
    const editMaterialButtons = document.querySelectorAll('.edit-material-button');

    editMaterialButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const itemId = this.getAttribute('data-item-id');  // Get the item ID
            const itemName = this.getAttribute('data-item-name');
            const itemDescription = this.getAttribute('data-item-description');
            const itemCategory = this.getAttribute('data-item-category');
            const unitOfMeasure = this.getAttribute('data-unit-of-measure');
            const purchasePrice = this.getAttribute('data-purchase-price');
            const reorderLevel = this.getAttribute('data-reorder-level');
            const perishable = this.getAttribute('data-perishable');
            const daysBeforeExpiry = this.getAttribute('data-days-before-expiry');

            // Set the form action to the correct URL
            const form = document.getElementById('edit-material-form');
            form.action = `/edit-material/${itemId}/`;  // Set the action to the correct URL

            document.getElementById('edit-item-name').value = itemName;
            document.getElementById('edit-item-description').value = itemDescription;
            document.getElementById('item-category').value = itemCategory;
            document.getElementById('edit-unit-of-measure').value = unitOfMeasure;
            document.getElementById('edit-purchase-price').value = purchasePrice;
            document.getElementById('edit-reorder-level').value = reorderLevel;
            document.getElementById('edit-perishable').checked = (perishable === 'true');
            document.getElementById('edit-non-perishable').checked = (perishable === 'false');
            document.getElementById('edit-days-before-expiry').value = daysBeforeExpiry;

            // Enable or disable the days input based on the selected radio button
            const daysBeforeExpiryInput = document.getElementById('edit-days-before-expiry');
            if (perishable === 'true') {
                daysBeforeExpiryInput.disabled = false;  // Enable the input
            } else {
                daysBeforeExpiryInput.disabled = true;   // Disable the input
                daysBeforeExpiryInput.value = '';        // Clear the input value
            }
        });
    });
});