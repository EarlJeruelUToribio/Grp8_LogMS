document.addEventListener('DOMContentLoaded', function () {
    const expandedDetails = document.querySelector('.expanded-order-details');
    const orderDetailsDropdown = document.getElementById('order-details-dropdown'); // Use the ID for the specific dropdown
    const orderTable = document.querySelector('.orders-table tbody'); // Select the table body
    const orderStatusPlaced = document.querySelector('.order-status-container .order-status-box:nth-child(1)');
    const orderStatusShipped = document.querySelector('.order-status-container .order-status-box:nth-child(2)');
    const orderStatusCompleted = document.querySelector('.order-status-container .order-status-box:nth-child(3)');

    // Initially hide the expanded order details
    expandedDetails.style.display = 'none';

    let placedCount = 0;
    let shippedCount = 0;
    let completedCount = 0;

    // Function to update status counts based on the table data
    function updateOrderStatus() {
        const rows = orderTable.querySelectorAll('tr'); // Get all table rows

        // Reset counts
        placedCount = 0;
        shippedCount = 0;
        completedCount = 0;

        rows.forEach(row => {
            const status = row.children[4].textContent; // The status is in the 5th column (index 4)

            if (status === 'Placed') {
                placedCount++;
            } else if (status === 'Shipped') {
                shippedCount++;
            } else if (status === 'Completed') {
                completedCount++;
            }
        });

        // Update the order status boxes with the current counts
        orderStatusPlaced.textContent = `Order Placed: ${placedCount}`;
        orderStatusShipped.textContent = `Order Shipped: ${shippedCount}`;
        orderStatusCompleted.textContent = `Order Completed: ${completedCount}`;
    }

    // Call the function to update status counts on page load
    updateOrderStatus();

    // Add click event listener to the rows in the orders table for expanded details
    orderTable.addEventListener('click', function (e) {
        const targetRow = e.target.closest('tr'); // Ensure you get the row element

        if (targetRow) {
            // Extract the data from the clicked row
            const orderId = targetRow.children[0].textContent;
            const items = targetRow.children[1].textContent;
            const quantity = targetRow.children[2].textContent;
            const supplierName = targetRow.children[3].textContent;
            const status = targetRow.children[4].textContent;

            // Populate the extended details container
            document.getElementById('order-id-summary').textContent = orderId;
            document.getElementById('order-item-summary').textContent = items;
            document.getElementById('order-quantity-summary').textContent = quantity;
            document.getElementById('supplier-name-summary').textContent = supplierName;
            document.getElementById('order-status-summary').textContent = status;

            // Automatically show the dropdown if hidden when a row is clicked
            expandedDetails.style.display = 'block';
            orderDetailsDropdown.innerHTML = 'Order Details &#9652;'; // Change to "up" arrow
        }
    });

    // Add click event listener to toggle the dropdown button visibility of the details
    orderDetailsDropdown.addEventListener('click', function () {
        if (expandedDetails.style.display === 'none' || expandedDetails.style.display === '') {
            expandedDetails.style.display = 'block'; // Show the details
            orderDetailsDropdown.innerHTML = 'Order Details &#9652;'; // Change to "up" arrow
        } else {
            expandedDetails.style.display = 'none'; // Hide the details
            orderDetailsDropdown.innerHTML = 'Order Details &#9662;'; // Change to "down" arrow
        }
    });

});

// Search functionality
const searchBar = document.getElementById('search-bar');
const ordersTableBody = document.querySelector('.orders-table tbody'); // Select the table body

searchBar.addEventListener('input', function () {
    const searchTerm = searchBar.value.toLowerCase();
    const rows = ordersTableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const orderId = row.children[0].textContent.toLowerCase(); // Get the Order ID
        if (orderId.includes(searchTerm)) {
            row.style.display = ''; // Show row if search term matches
        } else {
            row.style.display = 'none'; // Hide row if it does not match
        }
    });
});
