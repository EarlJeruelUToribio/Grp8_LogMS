document.addEventListener("DOMContentLoaded", function () {
    const toggleButtons = document.querySelectorAll(".product-availability-toggle");

    toggleButtons.forEach(button => {
        button.addEventListener("change", function () {
            const productId = this.getAttribute("data-product-id");
            const isChecked = this.checked;

            fetch(`/toggle-product-availability/${productId}/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),  // Ensure CSRF token is included
                    "Content-Type": "application/json",
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: "success",
                            title: "Availability Updated",
                            text: `Product is now ${isChecked ? "available" : "unavailable"}.`,
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Failed to update product availability.",
                        });
                        this.checked = !isChecked; // Revert checkbox state
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "An unexpected error occurred.",
                    });
                    this.checked = !isChecked; // Revert checkbox state
                });
        });
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === `${name}=`) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
