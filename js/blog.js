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
    fetchRooms();
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
    postDiv.appendChild(infoElement);

    var joinButton = document.createElement("button");
    joinButton.innerText = "Join";
    joinButton.dataset.roomId = id;  // Set the room ID as a data attribute
    joinButton.addEventListener("click", function() {
        // Send a WebSocket message to join the room
        //socket.emit('join_room', {room_id: id});
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

    // Add click event listeners to join buttons
    var joinButtons = document.querySelectorAll(".Blog button");
    joinButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            joinRoom(button.dataset.roomId);
        });
    });
}

/*
var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function() {
    console.log('Socket connected');
});

socket.on('update_room', function(data) {
    updateCurrentRoom(data.room_id, data.contents);
});


function joinRoom(roomId) {
    // Update the server that the user has joined the room
    socket.emit('join_room', {room_id: roomId});

    // Fetch previous messages from the server
    fetch('/api/rooms/' + roomId)
        .then(response => response.json())
        .then(data => {
            updateCurrentRoom(roomId, data.contents);
        })
        .catch(error => console.error('Error fetching previous messages:', error));
}

// Function to update the current room with messages
function updateCurrentRoom(roomId, contents) {
    var currentRoomDiv = document.getElementById("current_room");

    // Clear existing messages and form
    currentRoomDiv.innerHTML = "";

    // Add the previous messages
    for (var i = 0; i < contents.length; i++) {
        var messageDiv = document.createElement("div");
        messageDiv.innerText = contents[i].author + ": " + contents[i].message;
        currentRoomDiv.appendChild(messageDiv);
    }

    // Add input field and send button
    var messageInput = document.createElement("input");
    messageInput.type = "text";
    messageInput.placeholder = "Type your message...";
    currentRoomDiv.appendChild(messageInput);

    var sendButton = document.createElement("button");
    sendButton.innerText = "Send";
    sendButton.addEventListener("click", function() {
        event.preventDefault();  // Prevent the form submission
        // Send a WebSocket message with the new message
        socket.emit('new_message', {room_id: roomId, message: messageInput.value});
        console.log("Sent out " + {room_id: roomId, message: messageInput.value});
        messageInput.value = "";  // Clear the input field
    });
    currentRoomDiv.appendChild(sendButton);
}
*/
