document.addEventListener('DOMContentLoaded', () => {
    const changeStatusButtons = document.querySelectorAll('.change-status-btn');
    const form = document.querySelector('#changeStatusModal form'); // Select form here
    console.log('CSRF Token:', getCookie('csrftoken'));


    changeStatusButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const orderId = event.currentTarget.getAttribute('data-order-id');
            const currentStatus = event.currentTarget.getAttribute('data-current-status');
            const itemName = event.currentTarget.getAttribute('data-item-name');
            const quantity = parseInt(event.currentTarget.getAttribute('data-quantity'));
            const checkoutMethod = event.currentTarget.getAttribute('data-checkout-method');
            const basePrice = parseFloat(event.currentTarget.getAttribute('data-base-price'));
            const itemId = event.currentTarget.getAttribute('data-item-id');

            document.getElementById('modal-order-id').value = orderId;
            document.getElementById('modal-current-status').textContent = currentStatus;
            document.getElementById('order-quantity').textContent = quantity;
            document.getElementById('item-id').value = itemId;

            const form = document.querySelector('#changeStatusModal form');
            form.onsubmit = async (e) => {
                e.preventDefault(); // Prevent default form submission
            
                const newStatus = document.getElementById('new-status').value;
                let paymentSuccess = true; // Track if payment was successful
            
                if (newStatus === "Shipped") {
                    if (checkoutMethod === "cash_on_delivery") {
                        paymentSuccess = await handleCashOnDelivery(orderId, itemName, quantity, basePrice);
                    } else if (["gcash", "paymaya", "credit_card"].includes(checkoutMethod)) {
                        paymentSuccess = await handleOnlinePayment(orderId, itemName, quantity, basePrice, checkoutMethod);
                    }
                }
            
                // Only update the order status if payment was successful
                if (paymentSuccess) {
                    await updateOrderStatus(orderId, newStatus);
                } else {
                    console.error('Payment failed, form submission aborted.');
                }
            };
        });
    });


    async function handleCashOnDelivery(orderId, itemName, quantity, basePrice) {
        const totalAmount = basePrice * quantity;
        const paymentDate = new Date().toISOString();
        const description = `Order: ${itemName} has been placed`;
    
        const financePayload = {
            transaction_id: orderId,
            PaymentDate: paymentDate,
            Amount: totalAmount,
            PaymentMethod: "cash-on-delivery",
            Description: description
        };
    
        console.log("Sending Cash on Delivery payload:", financePayload);  // Log before sending request
    
        try {
            const response = await fetch("/payment-record/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(financePayload),
            });
    
            console.log("Response status for cash payment:", response.status);  // Log response status
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Cash on Delivery payment recorded:', data);
            return true;
        } catch (error) {
            console.error('Error with cash on delivery payment:', error);
            return false;
        }
    }
    
    async function handleOnlinePayment(orderId, itemName, quantity, basePrice, paymentMethod) {
        const amount = basePrice * quantity;
        const referenceNumber = orderId;
        const description = `Order: ${itemName} has been placed`;
        const success_url = "http://127.0.0.1:8004/ManageOrder";
    
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
                            amount: amount,
                            description: itemName,
                            name: itemName,
                            quantity: quantity
                        }
                    ],
                    payment_method_types: [paymentMethod],
                    reference_number: referenceNumber
                }
            }
        };
    
        console.log("Sending Online Payment payload:", payload);  // Log before sending request
    
        try {
            const response = await fetch("/create-checkout-session/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(payload),
            });
    
            console.log("Response status for online payment:", response.status);  // Log response status
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Payment session created successfully:', data);
            return true;
        } catch (error) {
            console.error('Error creating payment session:', error);
            return false;
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
