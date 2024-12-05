document.addEventListener('DOMContentLoaded', function () {
    const expandedDetails = document.querySelector('.expanded-waste-details');
    const wasteDetailsDropdown = document.getElementById('waste-details-dropdown');
    const wasteTableBody = document.querySelector('.waste-table tbody');

    expandedDetails.style.display = 'none';

    wasteTableBody.addEventListener('click', function (e) {
        const targetRow = e.target.closest('tr');

        if (targetRow) {
            const wasteId = targetRow.children[0].textContent;
            const itemProduct = targetRow.children[1].textContent;
            const estimatedDatetime = targetRow.children[2].textContent;
            const quantity = targetRow.children[3].textContent;
            const location = targetRow.children[4].textContent;

            document.getElementById('waste-id-summary').textContent = wasteId;
            document.getElementById('waste-item-summary').textContent = itemProduct;
            document.getElementById('waste-datetime-summary').textContent = estimatedDatetime;
            document.getElementById('waste-quantity-summary').textContent = quantity;
            document.getElementById('waste-location-summary').textContent = location;

            expandedDetails.style.display = 'block';
            wasteDetailsDropdown.innerHTML = 'Waste Details &#9652;';
        }
    });

    wasteDetailsDropdown.addEventListener('click', function () {
        if (expandedDetails.style.display === 'none' || expandedDetails.style.display === '') {
            expandedDetails.style.display = 'block';
            wasteDetailsDropdown.innerHTML = 'Waste Details &#9652;';
        } else {
            expandedDetails.style.display = 'none';
            wasteDetailsDropdown.innerHTML = 'Waste Details &#9662;';
        }
    });
});

// Search functionality
const searchBar = document.getElementById('search-bar');
const wasteTableBody = document.querySelector('.waste-table tbody');

searchBar.addEventListener('input', function () {
    const searchTerm = searchBar.value.toLowerCase();
    const rows = wasteTableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const wasteId = row.children[0].textContent.toLowerCase();
        if (wasteId.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});
