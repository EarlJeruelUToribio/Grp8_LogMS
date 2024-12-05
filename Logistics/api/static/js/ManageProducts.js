function removeIngredient(button) {
    button.closest('.row').remove();
}

document.getElementById('add-ingredient-button').addEventListener('click', function() {
    const ingredientsSection = document.getElementById('ingredients-section');
    const newIngredientRow = document.createElement('div');
    newIngredientRow.classList.add('row', 'mb-2', 'align-items-center');
    
    // Create the options for the select element using the materials array
    let options = materials.map(material => `<option value="${material.id}">${material.name}</option>`).join('');

    newIngredientRow.innerHTML = `
        <div class="col-md-5">
            <select class="form-select ingredient-select" required>
                <option value="" disabled selected>Select Ingredient</option>
                ${options}
            </select>
        </div>
        <div class="col-md-5">
            <input type="number" class="form-control" placeholder="Quantity" required>
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-danger remove-ingredient" onclick="removeIngredient(this)">Remove</button>
        </div>
    `;
    ingredientsSection.appendChild(newIngredientRow);
});

document.getElementById('add-product-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this); // Create FormData object

    // Collect ingredients data
    const ingredientSelects = document.querySelectorAll('.ingredient-select');
    const ingredientQuantities = document.querySelectorAll('input[placeholder="Quantity"]');

    const materials = [];
    for (let i = 0; i < ingredientSelects.length; i++) {
        const ingredientId = ingredientSelects[i].value;
        const quantity = ingredientQuantities[i].value;
        if (ingredientId && quantity) {
            materials.push({ id: ingredientId, quantity: quantity });
        }
    }

    // Append materials to FormData
    materials.forEach((material) => {
        formData.append(`material_name[]`, material.id);
        formData.append(`material_quantity[]`, material.quantity);
    });

    // Get CSRF token from the hidden input
    const csrfToken = document.getElementById('csrf-token').value;

    // Send data to the server
    fetch('{% url "AddProduct" %}', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken // Include the CSRF token in the headers
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product added successfully!');
            location.reload(); // Reload the page to see the new product
        } else {
            alert('Error adding product: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});