document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('record-waste-form');
    const wasteTableBody = document.getElementById('waste-table-body');
    const manageWasteUrl = window.manageWasteUrl;  // This will still point to the updated URL

    // Function to fetch existing waste records
    const fetchWasteRecords = async () => {
        try {
            const response = await fetch(manageWasteUrl);
            const data = await response.json();
            if (Array.isArray(data.waste_records)) {
                data.waste_records.forEach(addWasteRow);
            }
        } catch (error) {
            console.error('Error fetching waste records:', error);
        }
    };

    // Function to handle form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch(manageWasteUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': csrfToken
                }
            });
            const data = await response.json();
            if (data.success) {
                form.reset();
                addWasteRow({
                    Waste_ID: data.waste_id,
                    IngredientName: formData.get('ingredient-name'),
                    QuantityLost: formData.get('quantity-lost'),
                    UnitOfMeasurement: formData.get('unit-of-measurement'),
                    CauseOfLoss: formData.get('cause-of-loss'),
                    DateOfIncident: formData.get('date-of-incident'),
                    ActionTaken: formData.get('action-taken')
                });
            } else {
                console.error('Error:', data.error);
            }
        } catch (error) {
            console.error('Error submitting waste record:', error);
        }
    };

    // Function to add a new row to the waste table
    const addWasteRow = (record) => {
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
    };

    // Event listeners
    form.addEventListener('submit', handleFormSubmit);
    fetchWasteRecords();
});