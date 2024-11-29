document.addEventListener('DOMContentLoaded', function() {
    // Add any JavaScript functionality for the ManageMaterials page here
    console.log('ManageMaterials.js loaded');

    // Function to toggle the visibility of the "Days Before Expiry" input
    window.toggleDaysInput = function() {
        const perishableRadio = document.getElementById('perishable');
        const daysBeforeExpiryContainer = document.getElementById('days-before-expiry-container');

        if (perishableRadio.checked) {
            daysBeforeExpiryContainer.style.display = 'block';  // Show the input
        } else {
            daysBeforeExpiryContainer.style.display = 'none';  // Hide the input
        }
    };

    // Call toggleDaysInput initially to handle the state when the page loads
    toggleDaysInput();

    // Example: Add event listeners to edit buttons (Optional - if needed)
    const editButtons = document.querySelectorAll('.btn-primary');
    editButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const materialId = this.getAttribute('data-material-id');
            console.log(`Edit button clicked for material ID: ${materialId}`);
        });
    });
});
