// ManageWaste.js
document.addEventListener('DOMContentLoaded', () => {
    const wasteTableBody = document.getElementById('waste-table-body');
    const manageWasteUrl = '/ManageWasteRecords/'; // URL for fetching waste records

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

    // Note: Without fetchWasteRecords, you won't be populating the table dynamically.
    // You can still add rows manually if you have data available.

    // If you want to add hardcoded data for testing, you can do it like this:
    const sampleData = [
        {
            Waste_ID: 1,
            IngredientName: "Ingredient A",
            DateOfIncident: "2025-01-01",
            QuantityLost: 10,
            UnitOfMeasurement: "kg",
            CauseOfLoss: "Spoilage",
            ActionTaken: "Discarded"
        },
        {
            Waste_ID: 2,
            IngredientName: "Ingredient B",
            DateOfIncident: "2025-01-02",
            QuantityLost: 5,
            UnitOfMeasurement: "kg",
            CauseOfLoss: "Overproduction",
            ActionTaken: "Composted"
        }
    ];

    // Populate the table with sample data
    sampleData.forEach(addWasteRow);
});