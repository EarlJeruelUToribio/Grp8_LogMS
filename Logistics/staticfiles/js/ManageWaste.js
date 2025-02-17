// ManageWaste.js
document.addEventListener('DOMContentLoaded', () => {
    const wasteTableBody = document.getElementById('waste-table-body');
    const manageWasteUrl = '/ManageWasteRecords/'; // URL for fetching waste records

    // Function to fetch waste records from the server
    const fetchWasteRecords = async () => {
        try {
            console.log('Fetching from URL:', manageWasteUrl); // Log the URL being fetched
            const response = await fetch(manageWasteUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.waste_records) {
                data.waste_records.forEach(addWasteRow);
            } else {
                console.error('No waste records found.');
            }
        } catch (error) {
            console.error('Error fetching waste records:', error);
            // Optionally, you can display an error message to the user
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
        wasteTableBody.appendChild(row); // Append the new row to the table
    };

    // Fetch waste records when the page loads
    fetchWasteRecords();
});