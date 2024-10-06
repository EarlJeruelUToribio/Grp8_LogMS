const editButton = document.getElementById('edit-button');

// Handle form submission for reorder level adjustment
adjustForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get form values
    const item = selectItem.value;
    const adjustedReorderLevel = parseFloat(document.getElementById('adjust-quantity').value);
    const reason = document.getElementById('reason-for-adjustment').value;

    // Update the reorder level in the table
    const rows = materialTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const itemName = row.cells[0].textContent;
        if (itemName === item) {
            row.cells[5].textContent = (adjustedReorderLevel % 1 === 0) ? adjustedReorderLevel : adjustedReorderLevel.toFixed(2); 
        }
    });

    // Clear the form fields
    adjustForm.reset();
    manualAdjustForm.classList.add('hidden'); // Hide the form after submission
});
