// static/js/ManageMaterials.js

document.addEventListener('DOMContentLoaded', function() {
    // Add any JavaScript functionality for the ManageMaterials page here
    console.log('ManageMaterials.js loaded');

    // Example: Add event listeners to edit buttons
    const editButtons = document.querySelectorAll('.btn-primary');
    editButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const materialId = this.getAttribute('data-material-id');
            console.log(`Edit button clicked for material ID: ${materialId}`);
        });
    });
});