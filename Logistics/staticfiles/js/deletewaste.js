document.addEventListener('DOMContentLoaded', () => {
    const wasteTableBody = document.getElementById('waste-table-body');
    
    wasteTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const wasteId = event.target.getAttribute('data-id');
            if (confirm(`Are you sure you want to delete waste record ID: ${wasteId}?`)) {
                fetch(`/ManageWasteRecords/${wasteId}/delete/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => {
                    if (response.ok) {
                        alert('Record deleted successfully');
                        event.target.closest('tr').remove();
                    } else {
                        alert('Failed to delete the record');
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        }
    });
});
