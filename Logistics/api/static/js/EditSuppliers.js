// Get the form
const form = document.querySelector('form');

// Add event listener to the form
form.addEventListener('submit', (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Get the form data
    const formData = new FormData(form);

    // Send the form data to the server
    fetch('{% url 'edit_supplier' supplier.Supplier_ID %}', {
        method: 'POST',
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
});