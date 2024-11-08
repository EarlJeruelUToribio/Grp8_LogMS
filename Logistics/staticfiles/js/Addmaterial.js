// static/js/AddMaterial.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('AddMaterial.js loaded');

    // Select elements
    const perishableRadio = document.getElementById('perishable');
    const nonPerishableRadio = document.getElementById('non-perishable');
    const expiryDaysInput = document.getElementById('expiry-days');

    // Function to toggle the 'Days before Expiry' input based on selection
    function toggleExpiryInput() {
        if (perishableRadio.checked) {
            expiryDaysInput.disabled = false; // Enable input
        } else if (nonPerishableRadio.checked) {
            expiryDaysInput.disabled = true;  // Disable input
            expiryDaysInput.value = '';       // Clear the input value
        }
    }

    // Attach event listeners to radio buttons to trigger the toggle function
    perishableRadio.addEventListener('change', toggleExpiryInput);
    nonPerishableRadio.addEventListener('change', toggleExpiryInput);

    // Call the function on page load to ensure the correct state
    window.onload = toggleExpiryInput;

    // Form validation
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        const itemName = document.getElementById('item-name').value;
        const itemCategory = document.getElementById('item-category').value;
        const unitOfMeasure = document.getElementById('unit-of-measure').value;
        const purchasePrice = document.getElementById('purchase-price').value;
        const reorderLevel = document.getElementById('reorder-level').value;
        
        // Check if required fields are filled
        if (!itemName || !itemCategory || !unitOfMeasure || !purchasePrice || !reorderLevel) {
            event.preventDefault();
            alert('Please fill in all required fields.');
        }

        // Additional check for expiry days input
        if (perishableRadio.checked && !expiryDaysInput.value) {
            event.preventDefault();
            alert('Please specify the days before expiry for perishable items.');
        }
    });

    // Clear form after successful submission
    if (document.querySelector('.alert-success')) {
        form.reset();
    }
});
