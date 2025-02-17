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
            const totalPrice = (quantity * basePrice * 100).toFixed(0); // Convert to cents
            paymentData = {
                transaction_id: generateTransactionID(),
                PaymentDate: formatDateToYDM(new Date()),
                Amount: parseFloat(totalPrice),
                PaymentMethod: checkoutMethod,
                Description: "Logistics Purchase"
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

        // Check if the new status is "Shipped" and payment method is one of the accepted methods
        const acceptedPaymentMethods = ["gcash", "paymaya", "credit_card"];
        if (newStatus === "Shipped" && paymentData?.PaymentMethod === "gcash" || "paymaya" || "credit_card") {
            console.log('Sending payment record as status is "Shipped"...');
            const paymentSuccess = await sendPaymentRecord(paymentData);
            if (!paymentSuccess) {
                console.log('Payment process failed, form will not be submitted.');
                return; // Stop form submission if payment faileds
            }
        } else {
            console.log('No action required for this status or payment method.');
        }

        // Submit the form after handling payment logic
        form.submit();
    });

    const success_url = "https://logistics-5mci.onrender.com/"; // ✅ Correct format

    async function sendPaymentRecord(paymentData) {
        console.log('Sending payment data:', JSON.stringify(paymentData)); // Log the payment data before sending
        
        const testPayload = {
            data: {
                attributes: {
                    send_email_receipt: true,
                    show_description: true,
                    show_line_items: true,
                    description: paymentData.Description,
                    success_url: success_url,
                    line_items: [
                        {
                            name: "Item " + paymentData.transaction_id, // Use item name or ID
                            amount: parseInt(paymentData.Amount), // Amount in cents
                            currency: "PHP",
                            quantity: 1, // Adjust as necessary
                            description: paymentData.Description // Customize as needed
                        }
                    ],
                    payment_method_types: [paymentData.PaymentMethod],
                    reference_number: paymentData.transaction_id.replace(/\s+/g, '_'),
                    billing: {
                        address: {
                            line1: "123 Test St", // Replace with actual billing address
                            line2: "Apt 4B",
                            city: "Test City",
                            state: "Test State",
                            postal_code: "12345",
                            country: "PH"
                        },
                        email: "test@example.com", // Replace with actual email
                        name: "Test User", // Replace with actual name
                        phone: "09171234567" // Replace with actual phone number
                    }
                }
            }
        };

        console.log("Test Payload to PayMongo:", testPayload);
    
        try {
            const response = await fetch("https://capstone-paymentgateway.onrender.com/create-checkout-session/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(testPayload),
            });
    
            const textResponse = await response.text();
            console.log("Response status:", response.status);
            console.log("Response body:", textResponse);
    
            // Check if the response is valid JSON
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (jsonError) {
                console.error("Failed to parse JSON response:", jsonError);
                return;
            }
    
            // Check for the checkout URL
            const checkout_url = data?.data?.attributes?.checkout_url || data?.details?.data?.attributes?.checkout_url;
            if (checkout_url) {
                console.log("Test Checkout URL:", checkout_url);
                // Redirect to the test checkout URL
                window.location.href = checkout_url; 
            } else {
                console.error("Checkout URL not found in response:", data);
                Swal.fire("Error", "Checkout URL not found.", "error");
            }
        } catch (error) {
            console.error("Error processing test payment:", error);
            Swal.fire("Error", "Failed to process test payment. Please try again.", "error");
        }
    }

        // Function to send test data to PayMongo
        async function sendTestData() {
            const testPayload = {
                data: {
                    attributes: {
                        send_email_receipt: true,
                        show_description: true,
                        show_line_items: true,
                        description: "Test Order Payment",
                        success_url: success_url,
                        line_items: [
                            {
                                name: "Test Item",
                                amount: Math.round(1000 * 100), // Test amount in cents (e.g., 1000 PHP)
                                currency: "PHP",
                                quantity: 1,
                                description: "Test Item Description"
                            }
                        ],
                        payment_method_types: ["gcash"],
                        reference_number: null,
                        billing: {
                            address: {
                                line1: "123 Test St",
                                line2: "Apt 4B",
                                city: "Test City",
                                state: "Test State",
                                postal_code: "12345",
                                country: "PH"
                            },
                            email: "test@example.com",
                            name: "Test User",
                            phone: "09171234567"
                        }
                    }
                }
            };
        
            console.log("Test Payload to PayMongo:", testPayload);
        
            try {
                const response = await fetch("https://capstone-paymentgateway.onrender.com/create-checkout-session/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(testPayload),
                });
        
                const textResponse = await response.text();
                console.log("Response status:", response.status);
                console.log("Response body:", textResponse);
        
                // Check if the response is valid JSON
                let data;
                try {
                    data = JSON.parse(textResponse);
                } catch (jsonError) {
                    console.error("Failed to parse JSON response:", jsonError);
                    return;
                }
        
                // Check for the checkout URL
                const checkout_url = data?.data?.attributes?.checkout_url || data?.details?.data?.attributes?.checkout_url;
                if (checkout_url) {
                    console.log("Test Checkout URL:", checkout_url);
                    // Redirect to the test checkout URL
                    window.location.href = checkout_url; 
                } else {
                    console.error("Checkout URL not found in response:", data);
                    Swal.fire("Error", "Checkout URL not found.", "error");
                }
            } catch (error) {
                console.error("Error processing test payment:", error);
                Swal.fire("Error", "Failed to process test payment. Please try again.", "error");
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

    function formatDateToYDM(date) {
        const year = date.getFullYear();
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        return `${year}-${day}-${month}`;
    }

    function generateTransactionID() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `LOG-${year}${month}${day}${hours}${minutes}${seconds}`; // Format: LOG-YYYYMMDDHHMMSS
    }
});