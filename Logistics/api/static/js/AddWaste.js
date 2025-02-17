// AddWaste.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('record-waste-form');
    const csrfToken = '{{ csrf_token }}'; // Ensure this is set correctly in your HTML
    const addWasteUrl = '/AddWasteRecord/'; // URL for adding waste records

    console.log('Add Waste URL:', addWasteUrl); // Log the URL being used

    // Function to handle form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission
        const formData = new FormData(form); // Create a FormData object from the form

        // Log the form data for debugging
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await fetch(addWasteUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': csrfToken // Include CSRF token in headers
                }
            });

            // Check if the response is OK (status in the range 200-299)
            if (!response.ok) {
                const errorText = await response.text(); // Get the raw response text
                console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // Parse the JSON response

            if (data.success) {
                form.reset(); // Reset the form after successful submission
                console.log('Waste record added successfully:', data.waste_id);
                fetchWasteRecords(); // Refresh the table after adding a new record
            } else {
                console.error('Error adding waste record:', data.error);
            }
        } catch (error) {
            console.error('Error submitting waste record:', error);
        }
    };

    // Event listener for form submission
    form.addEventListener('submit', handleFormSubmit);
});