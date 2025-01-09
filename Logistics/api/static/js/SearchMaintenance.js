document.getElementById('kitchen-search-bar').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#resources-table-body tr');

    rows.forEach(row => {
        const itemName = row.cells[0].textContent.toLowerCase();
        const category = row.cells[1].textContent.toLowerCase();

        if (itemName.includes(searchTerm) || category.includes(searchTerm)) {
            row.style.display = ''; // Show the row
        } else {
            row.style.display = 'none'; // Hide the row
        }
    });
});