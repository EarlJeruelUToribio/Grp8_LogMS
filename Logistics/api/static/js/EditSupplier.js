document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-button');

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const supplierId = this.getAttribute('data-supplier-id');
            const supplierName = this.getAttribute('data-supplier-name');
            const supplierAddress = this.getAttribute('data-supplier-address');
            const supplierEmail = this.getAttribute('data-supplier-email');
            const contactNumber = this.getAttribute('data-contact-number');
            const paymentTerms = this.getAttribute('data-payment-terms');

            // Populate the modal fields with the supplier data
            document.getElementById('edit-supplier-id').value = supplierId;
            document.getElementById('edit-supplier-name').value = supplierName;
            document.getElementById('edit-supplier-address').value = supplierAddress;
            document.getElementById('edit-supplier-email').value = supplierEmail;
            document.getElementById('edit-contact-number').value = contactNumber;
            document.getElementById('edit-payment-terms').value = paymentTerms;

            // Load existing materials for the supplier
            loadExistingMaterials(supplierId);
        });
    });

    // Function to load existing materials for the supplier
    function loadExistingMaterials(supplierId) {
        // Fetch existing materials from the server or use a predefined list
        // This is a placeholder; implement the actual fetching logic as needed
        const existingMaterials = []; // Replace with actual data fetching logic

        const editMaterialsList = document.getElementById('edit-materials-list');
        editMaterialsList.innerHTML = ''; // Clear existing materials

        existingMaterials.forEach(material => {
            const newMaterialSection = document.createElement('div');
            newMaterialSection.className = 'list-group-item d-flex justify-content-between align-items-center';
            newMaterialSection.dataset.materialId = material.id; // Assuming material has an id property
            newMaterialSection.textContent = `${material.name} - Qty: ${material.quantity}`; // Adjust based on your data structure

            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-danger btn-sm remove-material';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function() {
                editMaterialsList.removeChild(newMaterialSection);
            });
            newMaterialSection.appendChild(removeButton);
            editMaterialsList.appendChild(newMaterialSection);
        });
    }

    // Handle form submission for editing supplier
    const editSupplierForm = document.getElementById('edit-supplier-form');
    editSupplierForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(editSupplierForm);
        const supplierId = document.getElementById('edit-supplier-id').value;

        fetch(`/edit-supplier/${supplierId}/`, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Optionally, refresh the supplier list or update the UI
                location.reload(); // Reload the page to see the updated supplier list
            } else {
                alert('Error updating supplier: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Handle adding materials in the Edit Supplier modal
    document.querySelector('.add-edit-material-button').addEventListener('click', function() {
        const materialSelect = document.querySelector('.edit-material-select');
        const selectedMaterialId = materialSelect.value;
        const selectedMaterialText = materialSelect.options[materialSelect.selectedIndex].text;
        const quantityInput = document.querySelector('.edit-material-quantity').value;

        if (selectedMaterialId && quantityInput) {
            const editMaterialsList = document.getElementById('edit-materials-list');
            const newMaterialSection = document.createElement('div');
            newMaterialSection.className = 'list-group-item d-flex justify-content-between align-items-center';
            newMaterialSection.dataset.materialId = selectedMaterialId;
            newMaterialSection.textContent = `${selectedMaterialText} - Qty: ${quantityInput}`;

            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-danger btn-sm remove-material';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function() {
                editMaterialsList.removeChild(newMaterialSection);
            });
            newMaterialSection.appendChild(removeButton);
            editMaterialsList.appendChild(newMaterialSection);

            materialSelect.value = '';
            document.querySelector('.edit-material-quantity').value = '';
        } else {
            alert('Please select a material and enter a quantity.');
        }
    });
});