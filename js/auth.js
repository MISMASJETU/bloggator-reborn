// auth.js

function getUsername() {
    // You may need to adjust this based on how the username is stored in your session
    // This assumes that the username is stored in the 'username' field of the session
    return sessionStorage.getItem('username') || '';
}

function login() {
    var form = document.getElementById("login");
    var formData = new FormData(form);

    fetch('/api/login', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        if (data.success) {
            // Store the username in the session upon successful login
            sessionStorage.setItem('username', formData.get('username'));
            // Redirect or perform actions after successful login
            window.location.href = "/";  // Redirect to the home page
        } else {
            alert(data.message);  // Show an alert for unsuccessful login
        }
    })
    .catch(error => console.error('Error during login:', error));
}

function register() {
    var form = document.getElementById("register");
    var formData = new FormData(form);

    fetch('/api/register', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        if (data.success) {
            alert("Registration successful. You can now log in.");  // Show a success message
            // Optionally, redirect the user to the login page
            // window.location.href = "/login";
        } else {
            alert(data.message);  // Show an alert for unsuccessful registration
        }
    })
    .catch(error => console.error('Error during registration:', error));
}