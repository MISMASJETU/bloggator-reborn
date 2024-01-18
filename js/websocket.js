//  const URL = "wss://mmsocket.onrender.com";
const URL = "ws://127.0.0.1:8080";
let websocket;
const messagesDiv = document.getElementById("messages");
let connected = false;
let banned = false;

tryConnection();
function tryConnection(){
    websocket = new WebSocket(URL);
    if(websocket.CLOSED && !websocket.CONNECTING && !websocket.CLOSING && !websocket.OPEN){
        setTimeout(tryConnection, 5000);
        return;
    }


    websocket.onopen = function(event) {
        if(!banned){
            alert("Connected");
        }
        connected = true;
    }
    websocket.onmessage = function(event) {
        if(`${event.data}` == 'SERVER_MESSAGE: Banned.'){
            alert('Disconnected');
            banned = true;
        }
        else if(`${event.data}` == 'SERVER_MESSAGE: Unbanned.'){
            alert('Connected');
            banned = false;
        }
        messagesDiv.innerHTML = `<p>${event.data}</p>` + messagesDiv.innerHTML;
    };
    websocket.onclose = function(event) {
        if(!banned && connected) {
            alert("Disconnected");
        }
        connected = false;
        setTimeout(tryConnection, 1000);
    };
    websocket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
    });
}

document.getElementById("send").addEventListener("click", function() {
    event.preventDefault();  // Prevent the form submission
    if(connected){
        const message = getUsername() + ": " + document.getElementById("message").value;
        console.log(message);
        websocket.send(message);
    }
});

function getUsername() {
    // You may need to adjust this based on how the username is stored in your session
    // This assumes that the username is stored in the 'username' field of the session
    return sessionStorage.getItem('username') || '';
}