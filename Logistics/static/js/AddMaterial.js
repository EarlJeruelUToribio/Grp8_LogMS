// static/js/AddMaterial.js

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

        if (!itemName || !itemCategory || !unitOfMeasure || !purchasePrice || !reorderLevel) {
            event.preventDefault();
            alert('Please fill in all required fields.');
        }
    });

    // Clear form after successful submission
    if (document.querySelector('.alert-success')) {
        form.reset();
    }
});