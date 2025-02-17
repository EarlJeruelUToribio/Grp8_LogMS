document.querySelectorAll('.resolve-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-order-id');
        fetch(`/resolve-order/${orderId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include CSRF token
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    location.reload();
                } else {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while resolving the order.');
            });
    });
});

document.getElementById('resolve-all-btn').addEventListener('click', () => {
    fetch(`/resolve-all-orders/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Include CSRF token
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.reload();
            } else {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while resolving all orders.');
        });
});
