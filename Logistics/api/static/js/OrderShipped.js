document.addEventListener('DOMContentLoaded', () => {
    const changeStatusButtons = document.querySelectorAll('.change-status-btn');

    changeStatusButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Store the current order details in the modal
            const orderId = event.currentTarget.getAttribute('data-order-id');
            const currentStatus = event.currentTarget.getAttribute('data-current-status');
            const itemName = event.currentTarget.getAttribute('data-item-name');
            const quantity = parseInt(event.currentTarget.getAttribute('data-quantity')); // Ensure quantity is an integer
            const checkoutMethod = event.currentTarget.getAttribute('data-checkout-method');
            const basePrice = parseFloat(event.currentTarget.getAttribute('data-base-price')); // Get the base price

            // Set the modal fields
            document.getElementById('modal-order-id').value = orderId;
            document.getElementById('modal-current-status').textContent = currentStatus;
            document.getElementById('order-quantity').textContent = quantity;
            document.getElementById('item-id').value = event.currentTarget.getAttribute('data-item-id');

            // Add an event listener to the form submission
            const form = document.querySelector('#changeStatusModal form');
            form.onsubmit = async (e) => {
                e.preventDefault(); // Prevent the default form submission

                const newStatus = document.getElementById('new-status').value;

                // Check if the new status is "Shipped" and the checkout method is "Cash-On-Delivery"
                if (newStatus === "Shipped" && checkoutMethod === "cash_on_delivery") {
                    const totalAmount = basePrice * quantity; // Calculate total amount using base price
                    const paymentDate = new Date().toISOString();
                    const description = `Order: ${itemName} has been placed`;

                    const financePayload = {
                        transaction_id: orderId,
                        PaymentDate: paymentDate,
                        Amount: totalAmount, // Use the calculated total amount
                        PaymentMethod: "cash-on-delivery",
                        Description: description
                    };

                    // Log the payload to the console for debugging
                    console.log('Payload being sent to payment record:', financePayload);

                    // Send POST request to finance URL
                    try {
                        const response = await fetch("http://127.0.0.1:8000/payment-record/", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(financePayload),
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        const data = await response.json();
                        console.log('Success:', data);
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }

                // Now submit the form to change the order status
                form.submit();
            };
        });
    });
});

async function calculateTotalAmount(orderId, quantity) {
    const response = await fetch(`/orders/${orderId}/`); // Fetch order details
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const orderDetails = await response.json();

    // Log the order details to verify the structure
    console.log('Order details:', orderDetails);

    // Ensure that the item price is retrieved correctly
    const itemPrice = orderDetails.Items.PurchasePrice; // Adjust according to your data structure

    // Check if itemPrice is valid
    if (itemPrice === undefined || itemPrice === null) {
        console.error('Item price is not available in order details:', orderDetails);
        return 0; // Return 0 or handle the error as needed
    }

    // Calculate total amount in centavos
    const totalAmount = itemPrice * quantity; // Total amount in centavos
    return totalAmount; // Return total amount
}