function openEditModal(resourceId) {
    // Get the current values from the table
    const quantity = document.getElementById(`quantity-to-repair-${resourceId}`).innerText;
    const status = document.getElementById(`status-${resourceId}`).innerText;

    // Set the values in the modal
    document.getElementById('resource-id').value = resourceId;
    document.getElementById('edit-quantity').value = quantity;
    document.getElementById('edit-status').value = status;

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('editResourceModal'));
    modal.show();
}

// Add event listener for the form submission
document.getElementById('editResourceForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const resourceId = document.getElementById('resource-id').value;
    const quantity = document.getElementById('edit-quantity').value;
    const status = document.getElementById('edit-status').value;

    // Send the data to the server using AJAX
    fetch(`/edit-maintenance-resource/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'), // Get CSRF token
        },
        body: JSON.stringify({
            resource_id: resourceId,
            quantity: quantity,
            status: status,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the table with new values
            document.getElementById(`quantity-to-repair-${resourceId}`).innerText = quantity;
            document.getElementById(`status-${resourceId}`).innerText = status;

            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editResourceModal'));
            modal.hide();
            Swal.fire('Success', 'Resource updated successfully!', 'success');
        } else {
            Swal.fire('Error', data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'An error occurred while updating the resource.', 'error');
    });
});

// Function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie string begins with the name we want
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}