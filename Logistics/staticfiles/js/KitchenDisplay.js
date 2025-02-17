document.addEventListener('DOMContentLoaded', function () {
    function updateStatusCounts() {
        const kitchenContainers = document.querySelectorAll('.kitchen-display-container');
        let toCookCount = 0;
        let readyCount = 0;
        let completedCount = 0;

        kitchenContainers.forEach(container => {
            const headerText = container.querySelector('h4').textContent;
            console.log(`Checking container: ${headerText}`); // Debugging output

            // Determine the status based on the header text
            if (headerText.includes('To Cook')) {
                toCookCount++;
            } else if (headerText.includes('Ready')) {
                readyCount++;
            } else if (headerText.includes('Completed')) {
                completedCount++;
            }
        });

        // Update the status containers
        document.getElementById('to-cook-status').textContent = `To Cook: ${toCookCount}`;
        document.getElementById('ready-status').textContent = `Ready: ${readyCount}`;
        document.getElementById('completed-status').textContent = `Completed: ${completedCount}`;

        // Log the counts for debugging
        console.log(`To Cook: ${toCookCount}, Ready: ${readyCount}, Completed: ${completedCount}`);
    }

    // Call the function to initialize counts
    updateStatusCounts();
});
s