// dashboard.js

function createInventoryChart(itemNames, currentStocks) {
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    const inventoryChart = new Chart(ctx, {
        type: 'bar', // You can change this to 'line', 'pie', etc.
        data: {
            labels: itemNames, // X-axis labels
            datasets: [{
                label: 'Current Stock',
                data: currentStocks, // Y-axis data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}