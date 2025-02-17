document.addEventListener("DOMContentLoaded", () => {
    const changeStatusButtons = document.querySelectorAll(".change-status-btn");

    changeStatusButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            // Retrieve and store data attributes from the clicked button
            const orderId = event.currentTarget.getAttribute("data-order-id");
            const itemId = event.currentTarget.getAttribute("data-item-id");
            const daysBeforeExpiry = event.currentTarget.getAttribute("data-days-before-expiry");

            // Populate modal fields
            document.getElementById("modal-order-id").value = orderId;
            document.getElementById("item-id").value = itemId;

            // Add an event listener to the form submission
            const form = document.querySelector("#changeStatusModal form");
            form.onsubmit = async (e) => {
                e.preventDefault(); // Prevent the default form submission

                // Get the new status from the dropdown
                const newStatus = document.getElementById("new-status").value;

                // Check if the new status is "Completed"
                if (newStatus === "Completed") {
                    console.log(`Status changed to Completed. Updating expiration for item ID: ${itemId}`);

                    // Send a request to update the expiration date
                    try {
                        const response = await fetch(`/extend-expiration/${itemId}/`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRFToken": getCSRFToken(),
                            },
                            body: JSON.stringify({ days_before_expiry: daysBeforeExpiry }),
                        });

                        const data = await response.json();

                        if (data.message) {
                            Swal.fire({
                                icon: "success",
                                title: "Expiration Updated",
                                text: data.message,
                            });
                        } else if (data.error) {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: data.error,
                            });
                        }
                    } catch (error) {
                        console.error("Error updating expiration:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "An error occurred while updating expiration.",
                        });
                    }
                }

                // Now submit the form to change the order status
                form.submit();
            };
        });
    });

    // Function to get CSRF token
    function getCSRFToken() {
        return document.querySelector("[name=csrfmiddlewaretoken]").value;
    }
});
