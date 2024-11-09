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

// Function to toggle availability
function toggleAvailability(button) {
    const currentStatus = button.getAttribute('data-available');
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    // Update the button text and data attribute
    button.textContent = newStatus;
    button.setAttribute('data-available', newStatus);

    // Here you can also add an AJAX call to update the product's status in the database if needed
}