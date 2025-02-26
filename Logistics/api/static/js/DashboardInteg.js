// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-based month
    const currentYear = currentDate.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthName = monthNames[currentMonth - 1];

    // Update UI with current month and year
document.getElementById('cogsMonth').innerText = `COGS for ${currentMonthName} ${currentYear}`;
document.getElementById('inventoryMonth').innerText = `Total Inventory Purchases for ${currentMonthName} ${currentYear}`;
document.getElementById('ordersMonth').innerText = `Orders Per Day - ${currentMonthName} ${currentYear}`;
document.getElementById('highestSellingMonth').innerText = `Highest Selling Products - ${currentMonthName} ${currentYear}`;

    // Helper function to format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);
    }

    // Fetch and display COGS for the current month
    fetch(`https://capstone-financemanagement.onrender.com/total-cogs/?month=${currentMonth}&year=${currentYear}`)
        .then(response => response.json())
        .then(data => {
            const cogsElement = document.getElementById('totalCOGS');
            cogsElement.innerText = formatCurrency(data.total_cogs ?? 0);
        })
        .catch(error => console.error('Error fetching total COGS:', error));

    // Fetch and display Total Inventory Purchases for the current month
    fetch(`https://capstone-financemanagement.onrender.com/total-purchase/?month=${currentMonth}&year=${currentYear}`)
        .then(response => response.json())
        .then(data => {
            const purchasesElement = document.getElementById('totalInventory');
            purchasesElement.innerText = formatCurrency(data.total_inventory_purchase ?? 0);
        })
        .catch(error => console.error('Error fetching total inventory purchases:', error));

    // Fetch and display Orders Per Day (Line Graph) for the current month
    fetch(`/api/orders-per-day/?month=${currentMonth}&year=${currentYear}`)
        .then(response => response.json())
        .then(data => {
            const lineCtx = document.getElementById('lineGraph').getContext('2d');
            new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: `Orders Per Day - ${currentMonthName}`,
                        data: data.values,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 0, 255, 0.1)',
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true },
                        title: { display: true, text: `Order Trends - ${currentMonthName} ${currentYear}` },
                    },
                },
            });
        })
        .catch(error => console.error('Error fetching orders per day:', error));

    // Fetch and display Highest Selling Products (Horizontal Bar Chart) for the current month
    fetch(`/api/highest-selling-product/?month=${currentMonth}&year=${currentYear}`)
        .then(response => response.json())
        .then(data => {
            const barCtx = document.getElementById('highestSellingProductChart').getContext('2d');
            new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Number of Sales',
                        data: data.data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: `Highest Selling Products - ${currentMonthName} ${currentYear}` },
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 },
                            title: { display: true, text: 'Number of Sales' }
                        },
                        y: { title: { display: true, text: 'Products' } }
                    }
                },
            });
        })
        .catch(error => console.error('Error fetching highest selling products:', error));
});
