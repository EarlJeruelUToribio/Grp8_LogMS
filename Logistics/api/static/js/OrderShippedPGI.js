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

                // Check if the new status is "Shipped" and the checkout method is not "Cash-On-Delivery"
                if (newStatus === "Shipped" && 
                    (checkoutMethod === "gcash" || checkoutMethod === "paymaya" || checkoutMethod === "credit_card")) {
                    
                    const amount = basePrice * quantity; // Calculate total amount in centavos
                    const paymentMethod = checkoutMethod; // Use the checkout method
                    const referenceNumber = orderId; // Use the order ID as the reference number
                    const description = `Order: ${itemName} has been placed`;
                    const success_url = "http://127.0.0.1:8000/ManageOrder"; // URL to redirect after payment

                    const payload = {
                        data: {
                            attributes: {
                                send_email_receipt: true,
                                show_description: true,
                                show_line_items: true,
                                description: description,
                                success_url: success_url,
                                line_items: [
                                    {
                                        currency: "PHP",
                                        amount: amount, // Amount in centavos
                                        description: itemName, // Item name to be processed
                                        name: itemName, // Food item
                                        quantity: quantity // Based on the order quantity
                                    }
                                ],
                                payment_method_types: [paymentMethod], // Based on the checkout method
                                reference_number: referenceNumber
                            }
                        }
                    };

                    // Log the payload to the console for debugging
                    console.log('Payload being sent to payment microservice:', payload);

                    // Send POST request to payment microservice
                    try {
                        const response = await fetch("/create-checkout-session/", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(payload),
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        const data = await response.json();
                        console.log('Payment session created successfully:', data);
                    } catch (error) {
                        console.error('Error creating payment session:', error);
                    }
                }

                // Now submit the form to change the order status
                form.submit();
            };
        });
    });
});