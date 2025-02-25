          // Fetch Cost of Goods Sold (COGS)
    document.addEventListener('DOMContentLoaded', function () {
    // Fetch Cost of Goods Sold (COGS)
    fetch("https://capstone-financemanagement.onrender.com/total-cogs/")
        .then(response => response.json())
        .then(data => {
            const cogsElement = document.getElementById('totalCOGS');
            if (data.total_cogs !== undefined) {
                cogsElement.innerText = `₱${Number(data.total_cogs).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            } else {
                cogsElement.innerText = "₱0.00";
            }
        })
        .catch(error => console.error('Error fetching total COGS:', error));
    // Fetch data for Line Graph
    fetch('/api/orders-per-day/')
        .then(response => response.json() )
        .then(data => {
            const lineCtx = document.getElementById('lineGraph').getContext('2d');
            new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Orders Per Day',
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
                        title: { display: true, text: 'Order Trends (Line Graph)' },
                    },
                },
            });
        });

    // Fetch Total Inventory Purchases (Same format as COGS)
    fetch("https://capstone-financemanagement.onrender.com/total-purchase/")
        .then(response => response.json())
        .then(data => {
            const purchasesElement = document.getElementById('totalInventory');
            if (data.total_inventory_purchase !== undefined) {
                purchasesElement.innerText = `₱${Number(data.total_inventory_purchase).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            } else {
                purchasesElement.innerText = "₱0.00";
            }
        })
        .catch(error => console.error('Error fetching total inventory purchases:', error));
        
        // Format currency
        function formatCurrency(amount) {
            return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);
        }

    // Fetch data for Highest Selling Product (Pie Chart)
    fetch('/api/highest-selling-product/')
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
                indexAxis: 'y', // Makes it a horizontal bar chart
                responsive: true,
                plugins: {
                    legend: { display: false }, // Hide legend since we have only one dataset
                    title: { display: true, text: 'Highest Selling Products' },
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }, // Ensures numbers are whole
                        title: { display: true, text: 'Number of Sales' }
                    },
                    y: {
                        title: { display: true, text: 'Products' }
                    }
                }
            },
        });
    });
});