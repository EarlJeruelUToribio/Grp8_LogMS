// Declare global variables
let csrfToken;
let markAsExpiredUrl;
let extendExpirationUrl;

function toggleManageOptions(button) {
    const options = button.nextElementSibling;
    options.style.display = options.style.display === 'none' ? 'block' : 'none';
}

function markAsExpired(itemId) {
    fetch(markAsExpiredUrl.replace('0', itemId), {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Update the UI to reflect the change
            const row = document.querySelector(`tr[data-item-id="${itemId}"]`);
            if (row) {
                const expirationCell = row.querySelector('td:nth-child(3)');
                expirationCell.textContent = 'Expired'; // Change the expiration status
                // Optionally, you can also disable the buttons or change their appearance
            }
        } else {
            alert('Failed to mark as expired.');
        }
    });
}

function extendExpiration(itemId) {
    fetch(extendExpirationUrl.replace('0', itemId), {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Get the new expiration date from the response
        } else {
            alert('Failed to extend expiration date.');
        }
    })
    .then(data => {
        if (data && data.new_expiration_date) {
            const row = document.querySelector(`tr[data-item-id="${itemId}"]`);
            if (row) {
                const expirationCell = row.querySelector('td:nth-child(3)');
                expirationCell.textContent = data.new_expiration_date; // Update the expiration date
            }
        }
    });
}

// Function to initialize the script with the necessary variables
function initializeScript(csrf, markExpiredUrl, extendUrl) {
    csrfToken = csrf;
    markAsExpiredUrl = markExpiredUrl;
    extendExpirationUrl = extendUrl;
}