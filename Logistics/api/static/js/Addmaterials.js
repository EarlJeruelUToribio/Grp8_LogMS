document.addEventListener('DOMContentLoaded', function () {
    console.log('AddingMaterial.js loaded');

    // Form reference
    const form = document.querySelector('form');

    // Form validation and submission handling
    form.addEventListener('submit', function (event) {
        // Field values
        const itemName = document.getElementById('item-name').value.trim();
        const itemCategory = document.getElementById('item-category').value.trim();
        const unitOfMeasure = document.getElementById('unit-of-measure').value.trim();
        const purchasePrice = document.getElementById('purchase-price').value.trim();
        const reorderLevel = document.getElementById('reorder-level').value.trim();
        const perishable = document.querySelector('input[name="perishable"]:checked');
        const daysBeforeExpiry = document.getElementById('days-before-expiry').value.trim();

 // Store the missing fields
 let missingFields = [];

 // Validate all required fields
 if (!itemName) missingFields.push('Item Name');
 if (!itemCategory) missingFields.push('Item Category');
 if (!unitOfMeasure) missingFields.push('Unit of Measure');
 if (!purchasePrice) missingFields.push('Purchase Price');
 if (!reorderLevel) missingFields.push('Reorder Level');
 if (!perishable) missingFields.push('Perishable Type (Perishable/Non-Perishable)');

 // If Perishable is selected, check if Days Before Expiry is provided
 if (perishable && perishable.value === 'true' && (!daysBeforeExpiry || daysBeforeExpiry < 0)) {
     missingFields.push('Days Before Expiry');
 }

 // If there are missing fields, prevent form submission and show SweetAlert
 if (missingFields.length > 0) {
     event.preventDefault(); // Prevent form submission

     // Show SweetAlert with the missing fields
     Swal.fire({
         icon: 'error',
         title: 'Missing Required Fields',
         text: `Please fill in the following fields before submitting: ${missingFields.join(', ')}`,
         confirmButtonText: 'OK',
         customClass: {
             popup: 'swal-error-popup',
             title: 'swal-error-title',
             content: 'swal-error-content',
             confirmButton: 'swal-error-button'
         }
     });
     return; // Exit the function early to prevent form submission
 }

        // Success alert before submission
        event.preventDefault(); // Prevent default form submission temporarily
        Swal.fire({
            icon: 'success',
            title: 'Material Added',
            text: 'The material has been successfully added!',
            confirmButtonText: 'Ok',
            customClass: {
                popup: 'swal-success-popup',
                title: 'swal-success-title',
                content: 'swal-success-content',
                confirmButton: 'swal-success-button'
            }
        }).then(() => {
            form.submit(); // Proceed with form submission
        });
    });

    // Clear form after successful submission
    if (document.querySelector('.alert-success')) {
        form.reset();
    }

    // Toggle the "Days Before Expiry" input visibility
    const perishableInputs = document.querySelectorAll('input[name="perishable"]');
    perishableInputs.forEach(input => {
        input.addEventListener('change', toggleDaysInput);
    });

    function toggleDaysInput() {
        const perishable = document.querySelector('input[name="perishable"]:checked').value;
        const daysContainer = document.getElementById('days-before-expiry-container');
        daysContainer.style.display = perishable === 'true' ? 'block' : 'none';
    }

    // Initialize the toggle based on the default value
    toggleDaysInput();
});
