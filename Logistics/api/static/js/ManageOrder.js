document.addEventListener('DOMContentLoaded', function() {

    // Change Order Status Modal Logic
    const changeStatusButtons = document.querySelectorAll('.change-status-btn');
    const modalOrderIdInput = document.getElementById('modal-order-id');
    const modalCurrentStatus = document.getElementById('modal-current-status');
    const modalNewStatus = document.getElementById('new-status');

    changeStatusButtons.forEach(button => {
        button.addEventListener('click', function () {
            const orderId = button.getAttribute('data-order-id');
            const currentStatus = button.getAttribute('data-current-status');

            // Populate modal fields
            modalOrderIdInput.value = orderId;
            modalCurrentStatus.textContent = currentStatus;

            // Set default selection to current status
            [...modalNewStatus.options].forEach(option => {
                option.selected = option.value === currentStatus;
            });
        });
    });

    // Supplier and Material Selection Logic
    const supplierSelect = document.getElementById('supplier-name');
    const materialSelect = document.getElementById('material');
    const basePriceElement = document.getElementById('base-price');
    const totalCostElement = document.getElementById('total-cost');
    const quantityInput = document.getElementById('quantity');

    supplierSelect.addEventListener('change', function() {
        const supplierId = this.value;
        fetch(`/get_materials_by_supplier?supplier_id=${supplierId}`)
            .then(response => response.json())
            .then(data => {
                materialSelect.innerHTML = '<option value="" disabled selected>Select Material</option>';
                data.forEach(material => {
                    const option = document.createElement('option');
                    option.value = material.Inventory_ID;
                    option.textContent = material.ItemName;
                    option.setAttribute('data-price', material.PurchasePrice); // Store price in data attribute
                    materialSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching materials:', error));
    });

    materialSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const purchasePrice = parseFloat(selectedOption.getAttribute('data-price')) || 0;
        basePriceElement.textContent = purchasePrice.toFixed(2); // Update base price display
        calculateTotalCost(purchasePrice);
    });

    quantityInput.addEventListener('input', function() {
        const purchasePrice = parseFloat(basePriceElement.textContent) || 0;
        calculateTotalCost(purchasePrice);
    });

    function calculateTotalCost(basePrice) {
        const quantity = parseInt(quantityInput.value) || 0;
        const totalCost = (basePrice * quantity).toFixed(2);
        totalCostElement.textContent = totalCost;
    }

// View Order Modal Logic
const viewOrderButtons = document.querySelectorAll('.view-order-btn');

viewOrderButtons.forEach(button => {
    button.addEventListener('click', function() {
        const orderId = button.getAttribute('data-order-id');
        const items = button.getAttribute('data-items');
        const quantity = button.getAttribute('data-quantity');
        const supplier = button.getAttribute('data-supplier');
        const status = button.getAttribute('data-status');
        const basePrice = button.getAttribute('data-base-price'); // Add base price
        const totalCost = button.getAttribute('data-total-cost'); // Add total cost

        // Populate the View Order Modal with order details
        document.getElementById('view-order-id').textContent = orderId;
        document.getElementById('view-order-items').textContent = items;
        document.getElementById('view-order-quantity').textContent = quantity;
        document.getElementById('view-order-supplier').textContent = supplier;
        document.getElementById('view-order-status').textContent = status;
        document.getElementById('view-order-base-price').textContent = basePrice; // Display base price
        document.getElementById('view-order-total-cost').textContent = totalCost; // Display total cost
    });
});


    // SweetAlert for Submit Order
    document.querySelector('#place-order-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission to show the alert first

        // Show SweetAlert success message
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Order has been successfully placed!',
            confirmButtonText: 'OK',
            customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                confirmButton: 'custom-swal-confirm'
            }
            
        }).then((result) => {
            if (result.isConfirmed) {
                // After the alert, submit the form manually
                this.submit();
            }
        });
    });

});