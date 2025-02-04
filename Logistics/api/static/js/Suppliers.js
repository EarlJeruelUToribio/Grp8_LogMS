document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.add-material-button').addEventListener('click', function() {
        const materialSelect = document.querySelector('.material-select');
        const selectedMaterialId = materialSelect.value;
        const selectedMaterialText = materialSelect.options[materialSelect.selectedIndex].text;
        const quantityInput = document.querySelector('.material-quantity').value;

        if (selectedMaterialId && quantityInput) {
            const materialsList = document.getElementById('materials-list');
            const newMaterialSection = document.createElement('div');
            newMaterialSection.className = 'list-group-item d-flex justify-content-between align-items-center';
            newMaterialSection.dataset.materialId = selectedMaterialId;
            newMaterialSection.textContent = `${selectedMaterialText} - Qty: ${quantityInput}`;

            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-danger btn-sm remove-material';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function() {
                materialsList.removeChild(newMaterialSection);
            });
            newMaterialSection.appendChild(removeButton);
            materialsList.appendChild(newMaterialSection);

            materialSelect.value = '';
            document.querySelector('.material-quantity').value = '';
        } else {
            alert('Please select a material and enter a quantity.');
        }
    });

    const addSupplier = (formData) => {
        fetch(addSupplierUrl, {  // Use the URL from the variable
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,  // Use the CSRF token from the variable
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${formData['supplier-name']}</td>
                    <td>${formData['supplier-address']}</td>
                    <td>${formData['supplier-email']}</td>
                    <td>${formData['contact-number']}</td>
                    <td>${formData['payment-terms']}</td>
                    <td>Active</td>
                    <td><a href="/edit-supplier/${data.supplier_id}/" class="btn btn-primary">Edit</a></td>
                `;
                document.getElementById('supplier-table-body').appendChild(newRow);
                $('#addSupplierModal').modal('hide');
                document.getElementById('add-supplier-form').reset();
            } else {
                alert('Error adding supplier: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    document.getElementById('add-supplier-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            'supplier-name': document.getElementById('supplier-name').value,
            'supplier-address': document.getElementById('supplier-address').value,
            'supplier-email': document.getElementById('supplier-email').value,
            'contact-number': document.getElementById('contact-number').value,
            'payment-terms': document.getElementById('payment-terms').value,
            'material_name[]': Array.from(document.querySelectorAll('#materials-list .list-group-item')).map(item => item.dataset.materialId),
            'material_min_order_qty[]': Array.from(document.querySelectorAll('#materials-list .list-group-item')).map(item => item.textContent.split(' - Qty: ')[1])
        };

        // Call the function to add the supplier
        addSupplier(formData);
    });
});