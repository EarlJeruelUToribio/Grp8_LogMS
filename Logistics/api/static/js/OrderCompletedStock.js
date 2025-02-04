document.addEventListener('DOMContentLoaded', () => {
    const changeStatusButtons = document.querySelectorAll('.change-status-btn');

    changeStatusButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Store the current order details in the modal
            const orderId = event.currentTarget.getAttribute('data-order-id');
            const currentStatus = event.currentTarget.getAttribute('data-current-status');
            const itemId = event.currentTarget.getAttribute('data-item-id');
            const quantity = parseInt(event.currentTarget.getAttribute('data-quantity')); // Ensure quantity is an integer

            // Set the modal fields
            document.getElementById('modal-order-id').value = orderId;
            document.getElementById('modal-current-status').textContent = currentStatus;
            document.getElementById('order-quantity').textContent = quantity;
            document.getElementById('item-id').value = itemId;

            // Add an event listener to the form submission
            const form = document.querySelector('#changeStatusModal form');
            form.onsubmit = async (e) => {
                e.preventDefault(); // Prevent the default form submission

                const newStatus = document.getElementById('new-status').value;

                // If the new status is "Completed", send an AJAX request to update stock
                if (newStatus === "Completed") {
                    const quantityToUpdate = quantity; // Use the order quantity directly

                    console.log(`Updating stock for item ID: ${itemId} with quantity: ${quantityToUpdate}`);

                    // Send AJAX request to update stock
                    try {
                        const response = await fetch(`/update-stock/${itemId}/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': getCookie('csrftoken'), // Get CSRF token
                            },
                            body: JSON.stringify({ quantity: quantityToUpdate })
                        });

                        const data = await response.json();

                        if (data.success) {
                            Swal.fire('Success', 'Stock updated successfully!', 'success');
                        } else {
                            Swal.fire('Error', 'Failed to update stock.', 'error');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        Swal.fire('Error', 'An error occurred while updating stock.', 'error');
                    }
                }

                // Now submit the form to change the order status
                form.submit();
            };
        });
    });

    // Function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});