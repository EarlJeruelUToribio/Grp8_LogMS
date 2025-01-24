// dashboard.js

// Line Graph Configuration
const lineData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
        label: 'Orders Per Day',
        data: [50, 70, 60, 80, 90, 120, 150],
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        fill: true,
    }]
};

// Bar Graph Configuration
const barData = {
    labels: ['Pizza', 'Burger', 'Pasta', 'Salad', 'Fries'],
    datasets: [{
        label: 'Sales (Units)',
        data: [120, 80, 60, 40, 100],
        backgroundColor: ['red', 'green', 'blue', 'yellow', 'purple'],
        borderColor: ['red', 'green', 'blue', 'yellow', 'purple'],
        borderWidth: 1,
    }]
};

// Create Line Graph
const lineGraph = document.getElementById('lineGraph').getContext('2d');
new Chart(lineGraph, {
    type: 'line',
    data: lineData,
    options: {
        responsive: true,
        plugins: {
            legend: { display: true },
            title: { display: true, text: 'Order Trends (Line Graph)' },
        },
    },
});

// Create Bar Graph
const barGraph = document.getElementById('barGraph').getContext('2d');
new Chart(barGraph, {
    type: 'bar',
    data: barData,
    options: {
        responsive: true,
        plugins: {
            legend: { display: true },
            title: { display: true, text: 'Product Sales (Bar Graph)' },
        },
        scales: {
            y: { beginAtZero: true },
        },
    },
});
