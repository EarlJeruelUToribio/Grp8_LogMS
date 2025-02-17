// Declare global variables
let csrfToken;
let markAsExpiredUrl;
let extendExpirationUrl;

function toggleManageOptions(button) {
    const options = button.nextElementSibling;
    options.style.display = options.style.display === 'none' ? 'block' : 'none';
}

function markAsExpired(itemId) {
    fetch(markAsExpiredUrl.replace('0', itemId), {  // Replace placeholder with actual item ID
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,  // Use the CSRF token from the script
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            location.reload(); // Reload the page to see the changes
        } else {
            alert('Failed to mark as expired.');
        }
    });
}

function extendExpiration(itemId) {
    const days = prompt("Enter number of days to extend:");
    if (days) {
        fetch(extendExpirationUrl.replace('0', itemId), {  // Replace placeholder with actual item ID
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,  // Use the CSRF token from the script
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ days: parseInt(days) })
        })
        .then(response => {
            if (response.ok) {
                location.reload(); // Reload the page to see the changes
            } else {
                alert('Failed to extend expiration date.');
            }
        });
    }
}

// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie string begins with the name we want
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Function to initialize the script with the necessary variables
function initializeScript(csrf, markExpiredUrl, extendUrl) {
    csrfToken = csrf;
    markAsExpiredUrl = markExpiredUrl;
    extendExpirationUrl = extendUrl;
}