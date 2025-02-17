document.addEventListener('DOMContentLoaded', () => {
    const changeStatusButtons = document.querySelectorAll('.change-status-btn');
    const form = document.querySelector('#changeStatusModal form'); // Select form here
    console.log('CSRF Token:', getCookie('csrftoken'));

    changeStatusButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const orderId = event.currentTarget.getAttribute('data-order-id');
            const currentStatus = event.currentTarget.getAttribute('data-current-status');
            const itemId = event.currentTarget.getAttribute('data-item-id');
            const quantity = parseInt(event.currentTarget.getAttribute('data-quantity'));

            // Set modal fields
            document.getElementById('modal-order-id').value = orderId;
            document.getElementById('modal-current-status').textContent = currentStatus;
            document.getElementById('order-quantity').textContent = quantity;
            document.getElementById('item-id').value = itemId;

            console.log('Button clicked for order:', orderId);
        });
    });

     // Attach form submission event outside the button click
     form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submission intercepted');

        const newStatus = document.getElementById('new-status').value;
        const itemId = document.getElementById('item-id').value;
        const quantity = parseInt(document.getElementById('order-quantity').textContent);

        if (newStatus === "Completed") {
            console.log(`Updating stock for item ID: ${itemId} with quantity: ${quantity}`);

            try {
                const response = await fetch(`/update-stock/${itemId}/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify({ quantity: quantity })
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

        // After handling stock update, submit the form to change order status
        form.submit();
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