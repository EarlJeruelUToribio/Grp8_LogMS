function toggleManageOptions(button) {
    // Find the next sibling, which is the 'manage-options' div
    const manageOptions = button.nextElementSibling;

    // Toggle visibility of the 'manage-options' container
    if (manageOptions.style.display === "none" || manageOptions.style.display === "") {
        manageOptions.style.display = "block";
    } else {
        manageOptions.style.display = "none";
    }
}
