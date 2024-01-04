// blog.js
function createChat() {
    console.log("test")
    var form = document.getElementById("new_room");
    var formData = new FormData(form);

    // Add the username of the logged-in user to the formData
    formData.append("author", getUsername());  // Using the getUsername function from auth.js

    fetch('/api/create_chat', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        // Clear the form after successful submission (optional)
        form.reset();
        // Fetch and display the updated list of posts
    })
    .catch(error => console.error('Error submitting blog post:', error));
}
