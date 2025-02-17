document.addEventListener('DOMContentLoaded', function() {
    const viewOrderButtons = document.querySelectorAll('.view-order-btn');

    viewOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = button.getAttribute('data-order-id');
            const items = button.getAttribute('data-items');
            const quantity = parseInt(button.getAttribute('data-quantity'));
            const supplier = button.getAttribute('data-supplier');
            const status = button.getAttribute('data-status');
            const itemId = button.getAttribute('data-item-id'); // Assuming you have this data attribute
            const basePrice = parseFloat(button.getAttribute('data-base-price')) || 0; // Assuming you have this data attribute

            // Populate the View Order Modal with order details
            document.getElementById('view-order-id').textContent = orderId;
            document.getElementById('view-order-items').textContent = items;
            document.getElementById('view-order-quantity').textContent = quantity;
            document.getElementById('view-order-supplier').textContent = supplier;
            document.getElementById('view-order-status').textContent = status;

            // Calculate total cost
            const totalCost = (basePrice * quantity).toFixed(2);
            document.getElementById('view-base-price').textContent = basePrice.toFixed(2);
            document.getElementById('view-total-cost').textContent = totalCost;
        });
    });
});