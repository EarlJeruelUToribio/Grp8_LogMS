document.addEventListener('DOMContentLoaded', function() {
    console.log('AddMaterial.js loaded');

    // Form validation
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        const itemName = document.getElementById('item-name').value;
        const itemCategory = document.getElementById('item-category').value;
        const unitOfMeasure = document.getElementById('unit-of-measure').value;
        const purchasePrice = document.getElementById('purchase-price').value;
        const reorderLevel = document.getElementById('reorder-level').value;
        const perishable = document.querySelector('input[name="perishable"]:checked');
        const daysBeforeExpiry = document.getElementById('days-before-expiry').value;

        if (!itemName || !itemCategory || !unitOfMeasure || !purchasePrice || !reorderLevel || !perishable) {
            event.preventDefault();
            alert('Please fill in all required fields.');
            return;
        }

        if (perishable.value === 'true' && (!daysBeforeExpiry || daysBeforeExpiry < 0)) {
            event.preventDefault();
            alert('Please enter a valid number of days before expiry for perishable items.');
        }
    });

    // Clear form after successful submission
    if (document.querySelector('.alert-success')) {
        form.reset();
    }
});