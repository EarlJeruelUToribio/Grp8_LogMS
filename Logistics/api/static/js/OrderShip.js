document.addEventListener('DOMContentLoaded', function () {
    const changeStatusButtons = document.querySelectorAll('.change-status-btn');

    changeStatusButtons.forEach(button => {
        button.addEventListener('click', function () {
            const orderId = this.getAttribute('data-order-id');
            const currentStatus = this.getAttribute('data-current-status');
            const itemId = this.getAttribute('data-item-id'); // Get the item ID
            const orderQuantity = this.getAttribute('data-quantity'); // Get the order quantity

            // Set the current status and item ID in the modal
            document.getElementById('modal-order-id').value = orderId;
            document.getElementById('modal-current-status').innerText = currentStatus;
            document.getElementById('item-id').value = itemId; // Set the item ID
            document.getElementById('order-quantity').innerText = orderQuantity; // Set the quantity in the modal

            // Change the status when the form is submitted
            const form = document.querySelector('#changeStatusModal form');
            form.onsubmit = function (event) {
                event.preventDefault(); // Prevent the default form submission

                const newStatus = document.getElementById('new-status').value;

                // If the new status is "Completed", send an AJAX request to update stock
                if (newStatus === "Completed") {
                    const quantity = parseInt(orderQuantity); // Use the order quantity directly

                    // Send AJAX request to update stock
                    fetch(`/update-stock/${itemId}/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCookie('csrftoken'), // Get CSRF token
                        },
                        body: JSON.stringify({ quantity: quantity })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('Success', 'Stock updated successfully!', 'success');
                        } else {
                            Swal.fire('Error', 'Failed to update stock.', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('Error', 'An error occurred while updating stock.', 'error');
                    });
                }

                // Submit the form to change the order status
                this.submit();
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
                // Check if this cookie string begins with the name we want
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});