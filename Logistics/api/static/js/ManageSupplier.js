document.querySelector('.add-material-button').addEventListener('click', function() {
    const materialSelect = document.querySelector('.material-select');
    const selectedMaterialId = materialSelect.value; // This should be the ID
    const selectedMaterialText = materialSelect.options[materialSelect.selectedIndex].text;
    const quantityInput = document.querySelector('.material-quantity').value;

    if (selectedMaterialId && quantityInput) {
        const materialsList = document.getElementById('materials-list');
        const newMaterialSection = document.createElement('div');
        newMaterialSection.className = 'list-group-item d-flex justify-content-between align-items-center';
        newMaterialSection.dataset.materialId = selectedMaterialId; // Store the material ID in a data attribute
        newMaterialSection.textContent = `${selectedMaterialText} - Qty: ${quantityInput}`;

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm remove-material';
        removeButton.textContent = 'Remove';
        newMaterialSection.appendChild(removeButton);
        materialsList.appendChild(newMaterialSection);

        // Add event listener to remove button
        removeButton.addEventListener('click', function() {
            materialsList.removeChild(newMaterialSection);
        });

        // Clear the selection and input
        materialSelect.value = '';
        document.querySelector('.material-quantity').value = '';
    } else {
        alert('Please select a material and enter a quantity.');
    }
});

document.getElementById('add-supplier-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather supplier data
    const supplierData = {
        'supplier-name': document.getElementById('supplier-name').value,
        'supplier-address': document.getElementById('supplier-address').value,
        'supplier-email': document.getElementById('supplier-email').value,
        'contact-number': document.getElementById('contact-number').value,
        'payment-terms': document.getElementById('payment-terms').value,
        'material_name[]': Array.from(document.querySelectorAll('#materials-list .list-group-item')).map(item => {
            return item.dataset.materialId; // Get the material ID from the data attribute
        }),
        'material_min_order_qty[]': Array.from(document.querySelectorAll('#materials-list .list-group-item')).map(item => {
            const quantity = item.textContent.split(' - Qty: ')[1].replace('Qty: ', '');
            return quantity;
        })
    };

    // Send supplier data to the server using fetch
    fetch('{% url "AddSupplier" %}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}' // Include CSRF token for security
        },
        body: JSON.stringify(supplierData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Add the new supplier to the table
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

            // Close the modal
            $('#addSupplierModal').modal('hide');
            // Clear the form document.getElementById('add-supplier-form').reset();
        } else {
            alert('Error adding supplier: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});