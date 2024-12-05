document.addEventListener('DOMContentLoaded', function() {
    // Log to console when the script is loaded
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
});