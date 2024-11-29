document.addEventListener('DOMContentLoaded', function () {
    const expandedDetails = document.querySelector('.expanded-supplier-details'); // Adjusted class name
    const supplierDetailsDropdown = document.getElementById('supplier-details-dropdown'); // Adjusted ID
    const suppliersTableBody = document.querySelector('.suppliers-table tbody'); // Adjusted class name

    // Initially hide the expanded supplier details
    expandedDetails.style.display = 'none';

    // Add click event listener to the rows in the suppliers table for expanded details
    suppliersTableBody.addEventListener('click', function (e) {
        const targetRow = e.target.closest('tr'); // Ensure you get the row element

        if (targetRow) {
            // Extract the data from the clicked row
            const supplierId = targetRow.children[0].textContent; // Assuming first column is Supplier ID
            const supplierName = targetRow.children[1].textContent; // Second column is Supplier Name
            const supplierAddress = targetRow.children[2].textContent; // Third column is Supplier Address
            const supplierEmail = targetRow.children[3].textContent; // Fourth column is Supplier Email
            const productsServices = targetRow.children[4].textContent; // Fifth column is Products/Services
            const status = targetRow.children[5].textContent; // Sixth column is Status

            // Populate the extended details container
            document.getElementById('supplier-id-summary').textContent = supplierId; // Adjusted ID
            document.getElementById('supplier-name-summary').textContent = supplierName; // Adjusted ID
            document.getElementById('supplier-address-summary').textContent = supplierAddress; // Adjusted ID
            document.getElementById('supplier-email-summary').textContent = supplierEmail; // Adjusted ID
            document.getElementById('supplier-products-summary').textContent = productsServices; // Adjusted ID
            document.getElementById('supplier-status-summary').textContent = status; // Adjusted ID

            // Automatically show the dropdown if hidden when a row is clicked
            expandedDetails.style.display = 'block';
            supplierDetailsDropdown.innerHTML = 'Supplier Details &#9652;'; // Change to "up" arrow
        }
    });

    // Add click event listener to toggle the dropdown button visibility of the details
    supplierDetailsDropdown.addEventListener('click', function () {
        if (expandedDetails.style.display === 'none' || expandedDetails.style.display === '') {
            expandedDetails.style.display = 'block'; // Show the details
            supplierDetailsDropdown.innerHTML = 'Supplier Details &#9652;'; // Change to "up" arrow
        } else {
            expandedDetails.style.display = 'none'; // Hide the details
            supplierDetailsDropdown.innerHTML = 'Supplier Details &#9662;'; // Change to "down" arrow
        }
    });
});

// Search functionality
const searchBar = document.getElementById('search-bar');
const suppliersTableBody = document.querySelector('.suppliers-table tbody'); // Select the table body

searchBar.addEventListener('input', function () {
    const searchTerm = searchBar.value.toLowerCase();
    const rows = suppliersTableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const supplierId = row.children[0].textContent.toLowerCase(); // Get the Supplier ID
        if (supplierId.includes(searchTerm)) {
            row.style.display = ''; // Show row if search term matches
        } else {
            row.style.display = 'none'; // Hide row if it does not match
        }
    });
});
