document.addEventListener('DOMContentLoaded', function() {
    console.log('ManageMaterials.js loaded');

    // Function to toggle the visibility of the "Days Before Expiry" input
    window.toggleDaysInput = function() {
        const perishableRadio = document.getElementById('perishable');
        const nonPerishableRadio = document.getElementById('non-perishable');
        const daysBeforeExpiryContainer = document.getElementById('days-before-expiry-container');

        // Show or hide the days input based on the selected radio button
        if (perishableRadio.checked) {
            daysBeforeExpiryContainer.style.display = 'block';  // Show the input
        } else {
            daysBeforeExpiryContainer.style.display = 'none';  // Hide the input
        }
    };

    // Call toggleDaysInput initially to handle the state when the page loads
    toggleDaysInput();

    // Optional: Add event listeners to edit buttons (if needed)
    const editButtons = document.querySelectorAll('.btn-primary[data-material-id]');
    editButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const materialId = this.getAttribute('data-material-id');
            console.log(`Edit button clicked for material ID: ${materialId}`);
            // You can add your edit functionality here
        });
    });
    const form = document.querySelector('#addMaterialModal form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent form submission

            // Validate form fields
            const itemName = document.querySelector('#item-name').value.trim();
            const itemCategory = document.querySelector('#item-category').value;
            const unitOfMeasure = document.querySelector('#unit-of-measure').value;
            const purchasePrice = document.querySelector('#purchase-price').value.trim();
            const reorderLevel = document.querySelector('#reorder-level').value.trim();
            const perishable = document.querySelector('input[name="perishable"]:checked');
            const daysBeforeExpiry = document.querySelector('#days-before-expiry');

            // Check if required fields are filled
            if (!itemName || !itemCategory || !unitOfMeasure || !purchasePrice || !reorderLevel || !perishable) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Please fill out all required fields!',
                    customClass: {
                        popup: 'custom-swal-popup',
                        title: 'custom-swal-title',
                        confirmButton: 'custom-swal-confirm',
                    },
                    buttonsStyling: false, // Ensures custom styles are applied
                });
                return;
            }

            // Check if perishable is selected but days before expiry is missing
            if (perishable.value === 'true' && !daysBeforeExpiry.value.trim()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Please provide the number of days before expiry for perishable items!',
                    customClass: {
                        popup: 'custom-swal-popup',
                        title: 'custom-swal-title',
                        confirmButton: 'custom-swal-confirm',
                    },
                    buttonsStyling: false, // Ensures custom styles are applied
                });
                return;
            }

            // If everything is valid, show success alert
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Material saved successfully!',
                customClass: {
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title',
                    confirmButton: 'custom-swal-confirm',
                },
                buttonsStyling: false, // Ensures custom styles are applied
            }).then(() => {
                form.submit(); // Submit the form after success alert
            });
        });
    }
});