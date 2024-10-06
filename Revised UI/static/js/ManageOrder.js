// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for dropdown button
    document.querySelector('.dropdown-btn').addEventListener('click', function () {
        const expandedDetails = document.querySelector('.expanded-order-details');
        if (expandedDetails.style.display === 'none' || expandedDetails.style.display === '') {
            expandedDetails.style.display = 'block';
            this.innerHTML = 'Order &#9652;'; // Change to "up" arrow
        } else {
            expandedDetails.style.display = 'none';
            this.innerHTML = 'Order &#9662;'; // Change to "down" arrow
        }
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
});
