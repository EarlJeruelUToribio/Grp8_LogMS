// static/js/EditMaterial.js

document.addEventListener('DOMContentLoaded', function() {
    // Add any JavaScript functionality for the EditMaterial page here
    console.log('EditMaterial.js loaded');

    // Example: Form validation
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        const itemName = document.getElementById('item-name').value;
        const purchasePrice = document.getElementById('purchase-price').value;
        const reorderLevel = document.getElementById('reorder-level').value;

        if (!itemName || !purchasePrice || !reorderLevel) {
            event.preventDefault();
            alert('Please fill in all required fields.');
        }
    });
});