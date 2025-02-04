// Toggle dropdown menu
var dropdown = document.getElementsByClassName("dropdown-btn");
for (var i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
}

// Toggle sidebar visibility
function toggleSidebar() {
    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed'); // Toggle sidebar class

    const mainContent = document.querySelector('.main-content');
    
    // Adjust main content margin
    if (sidebar.classList.contains('collapsed')) {
        mainContent.style.marginLeft = '60px'; // Adjust for collapsed sidebar
    } else {
        mainContent.style.marginLeft = '250px'; // Adjust for expanded sidebar
    }
}

// Keep the clicked button active and highlight it
var buttons = document.querySelectorAll(".sidebar a, .dropdown-btn");

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        // Remove 'active' class from all buttons
        buttons.forEach(function(btn) {
            btn.classList.remove("active");
        });
        
        // Add 'active' class to the clicked button
        this.classList.add("active");
    });
});
