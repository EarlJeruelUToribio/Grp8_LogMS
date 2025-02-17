document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('kitchen-search-bar');
    const resourcesTableBody = document.getElementById('kitchen-resources-body');

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = resourcesTableBody.getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const itemName = row.cells[0].textContent.toLowerCase(); // Item Name
            const itemCategory = row.cells[1].textContent.toLowerCase(); // Item Category

            // Check if the search term matches the item name or category
            if (itemName.includes(searchTerm) || itemCategory.includes(searchTerm)) {
                row.style.display = ''; // Show the row
            } else {
                row.style.display = 'none'; // Hide the row
            }
        }
    });
});