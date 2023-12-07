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


/*
function createPost(title, author, contents, date, id) {
    var postDiv = document.createElement("div");
    postDiv.classList.add("Blog");

    var titleElement = document.createElement("h2");
    titleElement.innerText = title;

    var authorElement = document.createElement("p");
    authorElement.innerText = "Author: " + author;

    var contentsElement = document.createElement("p");
    contentsElement.innerText = contents;

    var infoElement = document.createElement("p");
    infoElement.innerText = "Id: " + id + " Date: " + date;

    postDiv.appendChild(titleElement);
    postDiv.appendChild(authorElement);
    postDiv.appendChild(contentsElement);
    postDiv.appendChild(infoElement);

    var messagesDiv = document.getElementById("messages");
    messagesDiv.appendChild(postDiv);
}



function fetchPosts() {
    fetch('/api/blog')
        .then(response => response.json())
        .then(posts => {
            updatePosts(posts);
            console.log(posts);
        })
        .catch(error => console.error('Error fetching blog posts:', error));
}

function updatePosts(posts) {
    var messagesDiv = document.getElementById("messages");
    // Clear existing posts
    messagesDiv.innerHTML = "";
    // Add the updated posts, skipping the last one
    for (var i = 0; i < posts.length - 1; i++) {
        var post = posts[i];
        createPost(post.title, post.author, post.contents, post.date, post.id);
    }
}

// Fetch initial posts
fetchPosts();

function searchPost() {
    var form = document.getElementById("searchForm");
    var formData = new FormData(form);

    var postId = formData.get("id");

    if (!postId || isNaN(postId)) {
        console.error("Invalid post ID");
        return;
    }

    fetch(`/api/blog/${postId}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Post not found");
            }
        })
        .then(post => {
            console.log(post);
            // Clear existing posts
            var messagesDiv = document.getElementById("messages");
            messagesDiv.innerHTML = "";

            // Display the searched post
            createPost(post.title, post.author, post.contents, post.date, post.id);
        })
        .catch(error => {
            console.error('Error searching for the blog post:', error);
            alert('Post not found!');
        });
}

function showPosts(){
    fetchPosts();
}

function deletePost() {
    var form = document.getElementById("deleteForm");
    var formData = new FormData(form);

    var postId = formData.get("id");

    if (!postId || isNaN(postId)) {
        console.error("Invalid post ID");
        return;
    }

    fetch(`/api/blog/${postId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to delete post");
        }
    })
    .then(data => {
        console.log(data.message);
        // Fetch and display the updated list of posts
        fetchPosts();
    })
    .catch(error => {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete post!');
    });
}

function editPost() {
    var form = document.getElementById("editForm");
    var formData = new FormData(form);
    var contents = formData.get("contents");
    var id = formData.get("id");

    // Client-side validation
    if (!contents || !id) {
        alert("Both 'New Contents' and 'ID' are required fields.");
        return;
    }

    // Fetch to edit post
    fetch(`/api/blog/${id}`, {
        method: 'PATCH',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(data => {
                throw new Error(data.message);  // Throw an error with the server's error message
            });
        }
    })
    .then(data => {
            alert(data.message);
            console.log(data);
        // Clear the form after successful submission (optional)
        form.reset();
        // Fetch and display the updated list of posts
        fetchPosts();
    })
    .catch(error => {
        console.error('Error editing blog post:', error);
        alert(error.message);  // Display the error message from the server
    });
}
*/
