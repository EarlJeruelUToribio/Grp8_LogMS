// Image Slider JavaScript
let currentImageIndex = 0;
const images = document.querySelectorAll('.image-slider img');
const totalImages = images.length;

if (totalImages > 0) {
    setInterval(() => {
        images[currentImageIndex].classList.add('hidden');
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        images[currentImageIndex].classList.remove('hidden');
    }, 3000); // Change image every 3 seconds
}

function toggleVisibility(field_id) {
    var field = document.getElementById(field_id);
    if (field) {
        field.type = (field.type === "password") ? "text" : "password";
    } else {
        console.error('Field not found:', field_id);
    }
}

function showPasswordSection() {
    var securityQuestions = document.getElementById('security-questions');
    var passwordSection = document.getElementById('password-section');
    if (securityQuestions && passwordSection) {
        securityQuestions.style.display = 'none';
        passwordSection.style.display = 'block';
    } else {
        console.error('Sections not found');
    }
}

function togglePassword() {
    var passwordField = document.getElementById("form2Example22");
    if (passwordField) {
        var type = passwordField.getAttribute("type") === "password" ? "text" : "password";
        passwordField.setAttribute("type", type);
    } else {
        console.error('Password field not found');
    }
}

function validateForm() {
    const emailField = document.getElementById('form2Example11');
    const passwordField = document.getElementById('form2Example22');

    // Check if email is valid
    if (!emailField.value) {
        alert('Please enter your email.');
        emailField.focus();
        return false;
    }

    // Check if password is provided
    if (!passwordField.value) {
        alert('Please enter your password.');
        passwordField.focus();
        return false;
    }

    // If both fields are filled, return true to submit the form
    return true;
}