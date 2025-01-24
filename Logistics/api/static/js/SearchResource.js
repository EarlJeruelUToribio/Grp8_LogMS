// SearchResources.js

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-bar');
    const tableBody = document.querySelector('table tbody');

    searchInput.addEventListener('keyup', function() {
        const filter = searchInput.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let rowContainsSearchTerm = false;

            // Loop through each cell in the row
            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                if (cell) {
                    // Check if the cell text contains the search term
                    if (cell.textContent.toLowerCase().indexOf(filter) > -1) {
                        rowContainsSearchTerm = true;
                        break; // No need to check other cells if one matches
                    }
                }
            }

            // Show or hide the row based on the search term
            if (rowContainsSearchTerm) {
                rows[i].style.display = ""; // Show the row
            } else {
                rows[i].style.display = "none"; // Hide the row
            }
        }
    });
});