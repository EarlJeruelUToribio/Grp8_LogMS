document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const productTable = document.querySelector('.product-table tbody');

    searchBar.addEventListener('input', function() {
        const searchTerm = searchBar.value.toLowerCase();
        const rows = productTable.querySelectorAll('tr');

        rows.forEach(row => {
            const productName = row.cells[1].textContent.toLowerCase(); // Assuming the product name is in the second column
            const productCategory = row.cells[2].textContent.toLowerCase(); // Assuming the product category is in the third column
            const productDescription = row.cells[3].textContent.toLowerCase(); // Assuming the product description is in the fourth column

            // Check if the search term matches the product name, category, or description
            if (productName.includes(searchTerm) || productCategory.includes(searchTerm) || productDescription.includes(searchTerm)) {
                row.style.display = ''; // Show the row
            } else {
                row.style.display = 'none'; // Hide the row
            }
        });
    });
});