document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-resource');

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const resourceId = this.getAttribute('data-id');
            const resourceName = this.getAttribute('data-name');
            const resourceCategory = this.getAttribute('data-category');
            const resourceQuantity = this.getAttribute('data-quantity');
            const resourceReorder = this.getAttribute('data-reorder');

            // Populate the modal fields
            document.getElementById('edit-resource-id').value = resourceId;
            document.getElementById('edit-resource-name').value = resourceName;
            document.getElementById('edit-resource-category').value = resourceCategory;
            document.getElementById('edit-quantity').value = resourceQuantity;
            document.getElementById('edit-reorder-level').value = resourceReorder;
        });
    });
});