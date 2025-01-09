document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('search-bar');
    const tableRows = document.querySelectorAll('.orders-table tbody tr');

    searchBar.addEventListener('input', function () {
        const searchTerm = searchBar.value.toLowerCase();  // Get the search term and convert to lowercase

        tableRows.forEach(function (row) {
            const orderId = row.cells[0].textContent.toLowerCase();  // Get the order ID from the first cell
            const itemName = row.cells[1].textContent.toLowerCase();  // Get the item name from the second cell

            // Check if the order ID or item name includes the search term
            if (orderId.includes(searchTerm) || itemName.includes(searchTerm)) {
                row.style.display = '';  // Show the row
            } else {
                row.style.display = 'none';  // Hide the row
            }
        });
    });
});