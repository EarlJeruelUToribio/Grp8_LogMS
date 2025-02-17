// OrderCount.js

document.addEventListener("DOMContentLoaded", function() {
    fetchOrderCounts();
});

function fetchOrderCounts() {
    fetch('/api/order-counts/')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.order-status-box:nth-child(1)').textContent = `Order Placed: ${data.placed}`;
            document.querySelector('.order-status-box:nth-child(2)').textContent = `Order Shipped: ${data.shipped}`;
            document.querySelector('.order-status-box:nth-child(3)').textContent = `Order Completed: ${data.completed}`;
            document.querySelector('.order-status-box:nth-child(4)').textContent = `Order Cancelled: ${data.cancelled}`;
        })
        .catch(error => console.error('Error fetching order counts:', error));
}