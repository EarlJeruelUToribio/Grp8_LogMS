document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const resourcesTable = document.querySelector('.resources-table tbody');

    searchBar.addEventListener('keyup', function() {
        const searchTerm = searchBar.value.toLowerCase();
        const rows = resourcesTable.getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let rowContainsSearchTerm = false;

            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                if (cell) {
                    const cellText = cell.textContent || cell.innerText;
                    if (cellText.toLowerCase().indexOf(searchTerm) > -1) {
                        rowContainsSearchTerm = true;
                        break;
                    }
                }
            }

            if (rowContainsSearchTerm) {
                rows[i].style.display = ''; // Show the row
            } else {
                rows[i].style.display = 'none'; // Hide the row
            }
        }
    });
});