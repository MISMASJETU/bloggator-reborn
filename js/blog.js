// blog.js
function createChat() {
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

function createRoomPreview(title, author, visibility, users, id) {
    var postDiv = document.createElement("div");
    postDiv.classList.add("Blog");

    var titleElement = document.createElement("h2");
    titleElement.innerText = title + " by " + author;

    // var contentsElement = document.createElement("p");
    // contentsElement.innerText = users;

    var infoElement = document.createElement("p");
    var locked = "";
    if (visibility == "visible") {
        locked = "No"
    } else {
        locked = "Yes"
    }
    infoElement.innerText = "Id: " + id + " Locked: " + locked;

    postDiv.appendChild(titleElement);
    // postDiv.appendChild(contentsElement);
    postDiv.appendChild(infoElement);

    var joinButton = document.createElement("button");
    joinButton.innerText = "Join";
    joinButton.addEventListener("click", function() {
        // Add your logic to handle the join button click event
        alert("Joining room with ID: " + id); // Replace this with actual joinin
    });

    postDiv.appendChild(joinButton);

    var messagesDiv = document.getElementById("rooms");
    messagesDiv.appendChild(postDiv);
}


function fetchRooms() {
    fetch('/api/rooms')
        .then(response => response.json())
        .then(posts => {
            updateRoomPreviews(posts);
            console.log(posts);
        })
        .catch(error => console.error('Error fetching room previews:', error));
}

fetchRooms();

function updateRoomPreviews(rooms) {
    var messagesDiv = document.getElementById("rooms");
    // Clear existing room previews
    messagesDiv.innerHTML = "";
    // Add the updated room previews
    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        createRoomPreview(room.title, room.author, room.visibility, room.users, room.id);
    }
}