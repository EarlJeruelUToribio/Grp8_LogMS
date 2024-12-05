 document.addEventListener('DOMContentLoaded', function() {
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
    });