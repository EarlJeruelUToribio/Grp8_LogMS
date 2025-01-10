document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('record-waste-form');
    const wasteTableBody = document.querySelector('.waste-table tbody');

    // Fetch existing waste records and populate the table
    fetch(manageWasteUrl)  // Use the dynamically generated URL
        .then(response => {
            if (!response.ok) {
                console.error('Failed to fetch waste records:', response.statusText);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Check if data is an array
            if (Array.isArray(data)) {
                data.forEach(record => {
                    addWasteRow(record);
                });
            } else {
                console.error('Unexpected data format:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching waste records:', error);
        });

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);

        fetch(manageWasteUrl, {  // Use the dynamically generated URL
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrfToken // Include CSRF token in headers
            }
        })
        .then(response => {
            if (!response.ok) {
                console.error('Failed to submit waste record:', response.statusText);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Clear the form
                form.reset();
                // Add the new waste record to the table
                addWasteRow({
                    Waste_ID: data.waste_id, // Assuming the server returns the new Waste ID
                    IngredientName: formData.get('ingredient-name'),
                    Type: formData.get('type'),
                    QuantityLost: formData.get('quantity-lost'),
                    UnitOfMeasurement: formData.get('unit-of-measurement'),
                    CauseOfLoss: formData.get('cause-of-loss'),
                    DateOfIncident: formData.get('date-of-incident'),
                    AssociatedCosts: formData.get('associated-costs'),
                    ActionTaken: formData.get('action-taken')
                });
            } else {
                console.error('Error:', data.error); // Log any error returned by the server
            }
        })
        .catch(error => {
            console.error('Error submitting waste record:', error);
        });
    });

    function addWasteRow(record) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.Waste_ID}</td>
            <td>${record.IngredientName}</td>
            <td>${record.DateOfIncident}</td>
            <td>${record.QuantityLost} ${record.UnitOfMeasurement}</td>
            <td>${record.CauseOfLoss}</td>
            <td>${record.ActionTaken}</td>
        `;
        wasteTableBody.appendChild(row);
    }
});