document.addEventListener('DOMContentLoaded', () => {
    const changeStatusButtons = document.querySelectorAll('.change-status-btn');
    const form = document.querySelector('#changeStatusModal form');
    console.log('CSRF Token:', getCookie('csrftoken'));

    // Store payment data to be sent later
    let paymentData = null;

    changeStatusButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const orderId = event.currentTarget.getAttribute('data-order-id');
            const currentStatus = event.currentTarget.getAttribute('data-current-status');
            const itemId = event.currentTarget.getAttribute('data-item-id');
            const quantity = parseInt(event.currentTarget.getAttribute('data-quantity'));
            const checkoutMethod = event.currentTarget.getAttribute('data-checkout-method');
            const basePrice = parseFloat(event.currentTarget.getAttribute('data-base-price'));

            document.getElementById('modal-order-id').value = orderId;
            document.getElementById('modal-current-status').textContent = currentStatus;
            document.getElementById('order-quantity').textContent = quantity;
            document.getElementById('item-id').value = itemId;

            // Prepare payment data
            const totalPrice = (quantity * basePrice).toFixed(2);
            paymentData = {
                transaction_id: orderId,
                PaymentDate: new Date().toISOString().split('T')[0],
                Amount: parseFloat(totalPrice),
                PaymentMethod: checkoutMethod,
                Description: `Payment for order ${orderId} - Item ID: ${itemId} (Quantity: ${quantity})`
            };

            console.log('Button clicked for order:', orderId);
            console.log('Payment Data prepared:', paymentData);
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submission intercepted');

        const newStatus = document.getElementById('new-status').value;
        const checkoutMethod = document.getElementById('checkout-method').value;

        // If the status is "Shipped" and the payment method is online, handle PayMongo integration
        if (newStatus === "Shipped" && ["gcash", "paymaya", "credit_card"].includes(checkoutMethod)) {
            console.log('Processing online payment through PayMongo...');
            try {
                // Prepare the PayMongo payload
                const payload = {
                    data: {
                        attributes: {
                            description: "Order payment",
                            success_url: "http://127.0.0.1:8004/success",
                            amount: Math.round(paymentData.Amount * 100), // Convert to cents
                            line_items: [
                                {
                                    name: "Item Name",  // Replace with the actual item name
                                    amount: Math.round(paymentData.Amount * 100), // Convert to cents
                                    currency: "PHP",
                                    quantity: 1,
                                    description: "Customer Purchase"
                                }
                            ],
                            payment_method_types: [checkoutMethod],
                            reference_number: paymentData.transaction_id, // Use the actual reference number
                            send_email_receipt: true,
                        },
                    },
                };

                console.log("Payload to PayMongo:", payload);

                // Send the payload to the PayMongo checkout session endpoint
                const response = await fetch("http://192.168.1.83:8006/create-checkout-session/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload),
                });

                // Check the response and redirect to the PayMongo checkout URL
                const data = await response.json();
                const checkout_url = data?.data?.attributes?.checkout_url;
                if (checkout_url) {
                    window.location.href = checkout_url; // Redirect to PayMongo checkout
                } else {
                    console.error("Checkout URL not found in response.");
                    Swal.fire("Error", "Checkout URL not found.", "error");
                }
            } catch (error) {
                console.error("Error processing online payment:", error);
                Swal.fire("Error", "Failed to process payment. Please try again.", "error");
            }
        } else {
            // Only send payment record if new status is "Shipped" and payment method is cash on delivery
            if (newStatus === "Shipped" && paymentData?.PaymentMethod === "cash_on_delivery") {
                console.log('Sending payment record as status is "Shipped"...');
                await sendPaymentRecord(paymentData);
            }

            // Submit the form after handling payment logic
            form.submit();
        }
    });

    async function sendPaymentRecord(paymentData) {
        console.log('Sending payment data:', JSON.stringify(paymentData)); // Log the payment data before sending

        try {
            const response = await fetch('http://127.0.0.1:8008/payment-record/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                const errorDetails = await response.json(); // Get exact validation errors
                console.error('Server responded with errors:', errorDetails);
                throw new Error('Validation failed: ' + JSON.stringify(errorDetails));
            }

            const responseData = await response.json();
            console.log('Payment record saved successfully:', responseData);
            Swal.fire('Success', 'Payment record saved successfully!', 'success');
        } catch (error) {
            console.error('Error sending payment record:', error);
            Swal.fire('Error', `Failed to save payment record: ${error.message}`, 'error');
        }
    }

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