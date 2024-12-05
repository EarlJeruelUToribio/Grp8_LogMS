document.addEventListener('DOMContentLoaded', () => {
    const addMaterialButton = document.querySelector('.add-material-button');
    const materialsList = document.getElementById('materials-list');
    const supplierForm = document.getElementById('add-supplier-form');

    addMaterialButton.addEventListener('click', () => {
        const materialSelect = document.querySelector('.material-select');
        const quantityInput = document.querySelector('.material-quantity').value;

        if (materialSelect.value && quantityInput) {
            const newMaterialSection = document.createElement('div');
            newMaterialSection.className = 'list-group-item d-flex justify-content-between align-items-center';
            newMaterialSection.dataset.materialId = materialSelect.value;
            newMaterialSection.textContent = `${materialSelect.options[materialSelect.selectedIndex].text} - Qty: ${quantityInput}`;

            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-danger btn-sm remove-material';
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => materialsList.removeChild(newMaterialSection);
            newMaterialSection.appendChild(removeButton);
            materialsList.appendChild(newMaterialSection);

            // Clear the selection and input
            materialSelect.value = '';
            document.querySelector('.material-quantity').value = '';
        } else {
            alert('Please select a material and enter a quantity.');
        }
    });

    supplierForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const supplierData = {
            'supplier-name': document.getElementById('supplier-name').value,
            'supplier-address': document.getElementById('supplier-address').value,
            'supplier-email': document.getElementById('supplier-email').value,
            'contact-number': document.getElementById('contact-number').value,
            'payment-terms': document.getElementById('payment-terms').value,
            'material_name[]': Array.from(materialsList.children).map(item => item.dataset.materialId),
            'material_min_order_qty[]': Array.from(materialsList.children).map(item => item.textContent.split(' - Qty: ')[1].replace('Qty: ', ''))
        };

        fetch('{% url "AddSupplier" %}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}'
            },
            body: JSON.stringify(supplierData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${supplierData['supplier-name']}</td>
                    <td>${supplierData['supplier-address']}</td>
                    <td>${supplierData['supplier-email']}</td>
                    <td>${supplierData['contact-number']}</td>
                    <td>${supplierData['payment-terms']}</td>
                    <td>Active</td>
                    <td><a href="/edit-supplier/${data.supplier_id}/" class="btn btn-primary">Edit</a></td>
                `;
                document.getElementById('supplier-table-body').appendChild(newRow);

                // Close the modal and reset the form
                $('#addSupplierModal').modal('hide');
                supplierForm.reset();
            } else {
                alert('Error adding supplier: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});