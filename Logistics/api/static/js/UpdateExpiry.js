document.addEventListener("DOMContentLoaded", () => {
    const updateExpiryButton = document.getElementById("update-expiry-button");

    updateExpiryButton.addEventListener("click", () => {
        fetch("/update-expiry/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken(),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Expiry Updated",
                        text: data.message,
                    });
                    // Reload the page to reflect changes
                    window.location.reload();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: data.error,
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Something went wrong!",
                });
                console.error("Error:", error);
            });
    });

    function getCSRFToken() {
        return document.querySelector("[name=csrfmiddlewaretoken]").value;
    }
});
