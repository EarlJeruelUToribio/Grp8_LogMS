document.addEventListener('DOMContentLoaded', () => {
    const wasteTableBody = document.getElementById('waste-table-body');
    const manageWasteUrl = '/ManageWasteRecords/'; // URL for fetching waste records
    const wasteForm = document.getElementById('waste-form'); // Reference to the form
    const submitButton = document.getElementById('submit-waste'); // Submit button reference

    // Function to fetch waste records from the server
    const fetchWasteRecords = async () => {
        try {
            console.log('Fetching from URL:', manageWasteUrl);
            const response = await fetch(manageWasteUrl, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            });
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
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    
    const addWasteRow = (record) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.Waste_ID}</td>
            <td>${record.IngredientName}</td>
            <td>${formatDate(record.DateOfIncident)}</td>
            <td>${record.QuantityLost} ${record.UnitOfMeasurement}</td>
            <td>${record.CauseOfLoss}</td>
            <td>${record.ActionTaken}</td>
        `;
        wasteTableBody.appendChild(row);
    };

    // Function to submit form data
    const submitWasteForm = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(wasteForm);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        try {
            const response = await fetch(manageWasteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(jsonData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                // Show SweetAlert Success Notification
                Swal.fire({
                    title: "Success!",
                    text: "Waste record submitted successfully.",
                    icon: "success",
                    confirmButtonColor: "#4CAF50"
                });

                // Reset the form
                wasteForm.reset();

                // Optionally, refresh waste records after submission
                wasteTableBody.innerHTML = ''; // Clear table before reloading
                fetchWasteRecords();
            } else {
                throw new Error(result.message || "Submission failed.");
            }
        } catch (error) {
            console.error("Error submitting waste record:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to submit the waste record. Please try again.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
        }
    };

    // Attach form submit event listener
    if (wasteForm) {
        wasteForm.addEventListener('submit', submitWasteForm);
    }

    // Fetch waste records when the page loads
    fetchWasteRecords();
});
