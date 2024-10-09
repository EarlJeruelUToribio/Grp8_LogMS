document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("search-bar");
    const productTable = document.querySelector(".product-table tbody");

    if (!searchBar || !productTable) {
        console.error("Search bar or product table not found!");
        return;
    }

    const allRows = Array.from(productTable.rows);

    searchBar.addEventListener("input", () => {
        const searchTerm = searchBar.value.toLowerCase();

        allRows.forEach(row => {
            const productName = row.cells[1].textContent.toLowerCase();
            const productCategory = row.cells[2].textContent.toLowerCase();

            // Check if the search term matches either the product name or the category
            if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                row.style.display = "";  // Show matching row
            } else {
                row.style.display = "none";  // Hide non-matching row
            }
        });
    });
});
