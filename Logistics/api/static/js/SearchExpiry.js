document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('search-bar');
    const tableRows = document.querySelectorAll('.product-table tbody tr');

    searchBar.addEventListener('input', function () {
        const searchTerm = searchBar.value.toLowerCase();  // Get the search term and convert to lowercase

        tableRows.forEach(function (row) {
            const itemName = row.cells[1].textContent.toLowerCase();  // Get the item name from the second cell
            const itemId = row.cells[0].textContent.toLowerCase();  // Get the item ID from the first cell

            // Check if the item name or ID includes the search term
            if (itemName.includes(searchTerm) || itemId.includes(searchTerm)) {
                row.style.display = '';  // Show the row
            } else {
                row.style.display = 'none';  // Hide the row
            }
        });
    });
});