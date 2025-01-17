// scripts.js

// Dummy data
const productData = {
    totalProducts: 50,
    productsSold: 1200,
    revenue: 75000,
    lowStock: 5,
    performance: [
        { product: "Product A", sales: 500, revenue: 25000 },
        { product: "Product B", sales: 300, revenue: 15000 },
        { product: "Product C", sales: 200, revenue: 10000 },
    ],
    inventory: [
        { product: "Product A", stock: 20 },
        { product: "Product B", stock: 5 },
        { product: "Product C", stock: 0 },
    ],
    trends: [5000, 8000, 10000, 12000, 15000],
};

// Populate Overview
document.getElementById("totalProducts").textContent = productData.totalProducts;
document.getElementById("productsSold").textContent = productData.productsSold;
document.getElementById("revenue").textContent = `$${productData.revenue}`;
document.getElementById("lowStock").textContent = productData.lowStock;

// Populate Performance Table
const performanceTable = document.getElementById("performanceTable");
productData.performance.forEach((item) => {
    const row = `<tr>
        <td>${item.product}</td>
        <td>${item.sales}</td>
        <td>$${item.revenue}</td>
    </tr>`;
    performanceTable.innerHTML += row;
});

// Populate Inventory Table
const inventoryTable = document.getElementById("inventoryTable");
productData.inventory.forEach((item) => {
    const row = `<tr>
        <td>${item.product}</td>
        <td>${item.stock}</td>
    </tr>`;
    inventoryTable.innerHTML += row;
});

// Sales Trends Chart
const salesTrendsCtx = document.getElementById("salesTrendsChart").getContext("2d");
new Chart(salesTrendsCtx, {
    type: "line",
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [{
            label: "Revenue",
            data: productData.trends,
            borderColor: "blue",
            fill: false,
        }],
    },
});

// Customer Behavior Chart (Placeholder)
const customerBehaviorCtx = document.getElementById("customerBehaviorChart").getContext("2d");
new Chart(customerBehaviorCtx, {
    type: "pie",
    data: {
        labels: ["Returning Customers", "New Customers"],
        datasets: [{
            data: [60, 40],
            backgroundColor: ["green", "orange"],
        }],
    },
});
