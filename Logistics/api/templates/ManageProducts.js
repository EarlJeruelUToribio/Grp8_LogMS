document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("search-bar");
    const productTable = document.querySelector(".product-table tbody");
    const allRows = Array.from(productTable.rows);

    // Function to filter products
    const filterProducts = () => {
        const searchTerm = searchBar.value.toLowerCase();

        allRows.forEach(row => {
            const productName = row.cells[1].textContent.toLowerCase();
            const productCategory = row.cells[2].textContent.toLowerCase();

            // Show the row if the search term matches either the name or category
            if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    };

    // Add event listener to the search bar to filter as the user types
    searchBar.addEventListener("input", filterProducts);
});
