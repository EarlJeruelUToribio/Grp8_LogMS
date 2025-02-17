document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-kitchen-resource');

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemId = this.getAttribute('data-id');
            console.log('Item ID:', itemId); // Log the item ID for debugging
            const itemName = this.getAttribute('data-name');
            const itemCategory = this.getAttribute('data-category');
            const quantity = this.getAttribute('data-quantity');
            const reorderLevel = this.getAttribute('data-reorder');

            // Populate the modal fields with the existing data
            document.getElementById('kitchen-resource-name').value = itemName;
            document.getElementById('kitchen-resource-category').value = itemCategory;
            document.getElementById('kitchen-quantity').value = quantity;
            document.getElementById('kitchen-reorder-level').value = reorderLevel;

            // Update the form action to point to the edit URL
            const form = document.getElementById('addKitchenResourceForm');
            form.setAttribute('action', editKitchenResourceUrl.replace('0', itemId)); // Update the URL with the actual itemId
        });
    });
});