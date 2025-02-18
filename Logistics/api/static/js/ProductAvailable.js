document.addEventListener("DOMContentLoaded", function () {
    const toggleButtons = document.querySelectorAll(".product-availability-toggle");

    toggleButtons.forEach(button => {
        button.addEventListener("change", function (event) {
            const productId = this.getAttribute("data-product-id");
            const isChecked = this.checked;
            const currentCheckbox = this;

            // Prevent immediate checkbox toggle until confirmation
            event.preventDefault();

            // SweetAlert confirmation dialog
            Swal.fire({
                title: "Are you sure?",
                text: `Do you want to mark this product as ${isChecked ? "available" : "unavailable"}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, confirm!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Proceed with updating the availability
                    fetch(`/toggle-product-availability/${productId}/`, {
                        method: "POST",
                        headers: {
                            "X-CSRFToken": getCookie("csrftoken"),  // Ensure CSRF token is included
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ is_available: isChecked })  // Send updated status to the backend
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire({
                                icon: "success",
                                title: "Availability Updated",
                                text: `Product is now ${isChecked ? "available" : "unavailable"}.`,
                            });

                            // Update the UI to reflect the new availability
                            if (!isChecked) {
                                // If the product is unavailable, you can hide it or modify its display
                                // Example: Add a class to visually show it's unavailable
                                const productRow = currentCheckbox.closest(".product-row"); // Assuming each product is in a row
                                productRow.style.display = 'none'; // Hides the product row (you can choose another approach)
                            } else {
                                // If the product is available, ensure it's visible
                                const productRow = currentCheckbox.closest(".product-row");
                                productRow.style.display = ''; // Resets the display property (make it visible again)
                            }
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Failed to update product availability.",
                            });
                            currentCheckbox.checked = !isChecked; // Revert checkbox if update fails
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "An unexpected error occurred.",
                        });
                        currentCheckbox.checked = !isChecked; // Revert checkbox on error
                    });
                } else {
                    // Revert checkbox if user cancels the action
                    currentCheckbox.checked = !isChecked;
                }
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
