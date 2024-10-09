const editButton = document.getElementById('edit-button');  // Get the edit button
const manualAdjustForm = document.getElementById('manual-adjust-form');  // Get the manual adjust form

// Toggle visibility of the Manual Adjust Reorder Levels form
editButton.addEventListener('click', function() {
    // Toggle the "hidden" class on the manual adjust form
    manualAdjustForm.classList.toggle('hidden');
});
