# main.py

from flask import Flask, render_template, jsonify, send_from_directory, redirect, url_for, session, request
from flask_bcrypt import Bcrypt
import json
import os
import hashlib
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'the random string'
bcrypt = Bcrypt(app)
socketio = SocketIO(app, logger=False, engineio_logger=False)


# File paths
json_file_path = 'blog_posts.json'
id_file_path = 'id.txt'
users_file_path = 'users.json'

# Load existing users from the JSON file
users = {}
if os.path.exists(users_file_path):
    with open(users_file_path, 'r') as user_file:
        users = json.load(user_file)

def load_id():
    if os.path.exists(id_file_path):
        with open(id_file_path, 'r') as file:
            try:
                return int(file.read().strip())
            except ValueError:
                print(f"Error: Content of {id_file_path} is not a valid integer.")
    return 0

def save_id(number):
    with open(id_file_path, 'w') as file:
        file.write(str(number))

def initialize_id():
    if not os.path.exists(id_file_path):
        save_id(0)
        print(f"{id_file_path} created and initialized with 0.")

initialize_id()

# Check if the JSON file exists, and create it if not
if not os.path.exists(json_file_path):
    with open(json_file_path, 'w') as file:
        json.dump([], file)

# Load initial blog posts from the JSON file
with open(json_file_path, 'r') as file:
    blog_posts = json.load(file)

@socketio.on('new_message')
def handle_new_message(data):
    for i in range(0,100):
        print("Recieved")
    room_id = data['room_id']
    message = data['message']

    # Find the room by ID
    room = next((r for r in blog_posts if r["id"] == room_id), None)

    if room:
        room["contents"].append({"author": session['username'], "message": message})

        # Broadcast the new message to all clients in the room
        socketio.emit('update_room', {'room_id': room_id, 'contents': room["contents"]}, room=room_id)

# Route to serve the HTML file
@app.route('/')
def index():
    print("Visitor on index.html")
    if 'username' in session:
        return render_template('index.html', username=session['username'])
    return render_template('login.html')

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

# API endpoint for user login
@app.route('/api/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if username in users and bcrypt.check_password_hash(users[username], password):
        session['username'] = username
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid username or password"})

# API endpoint for user logout
@app.route('/api/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

# API endpoint to check if a user is logged in
@app.route('/api/check_login', methods=['GET'])
def check_login():
    return jsonify({'logged_in': 'username' in session})

from flask_bcrypt import generate_password_hash

def add_user(username, password):
    # Check if the username already exists
    if username in users:
        return {"success": False, "message": "Username already exists"}

    # Hash the password before storing it
    hashed_password = generate_password_hash(password).decode('utf-8')

    # Add the new user to the dictionary
    users[username] = hashed_password

    # Save the updated users to the JSON file
    with open(users_file_path, 'w') as user_file:
        json.dump(users, user_file, indent=4)

    return {"success": True, "message": "User added successfully"}

# API endpoint for user registration
@app.route('/api/register', methods=['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')

    result = add_user(username, password)

    if result["success"]:
        return jsonify({"success": True, "message": "Registration successful"})
    else:
        return jsonify({"success": False, "message": result["message"]})

@app.route('/api/create_chat', methods=['POST'])
def submit_post():
    if 'username' not in session:
        return jsonify({"message": "You must be logged in to create a chat"}), 401

    # Load the current ID from id.txt
    current_id = load_id() + 1

    new_chat = {
        "id": current_id,
        "hash": chat_hash(request.form.get("title"), current_id),
        "title": request.form.get("title"),
        "author": request.form.get("author"),
        "visibility": request.form.get("visibility"),
        "users": [],
        "contents": []
    }

    save_id(current_id)
    blog_posts.append(new_chat)

    # Save the updated blog posts to the JSON file
    with open('blog_posts.json', 'w') as file:
        json.dump(blog_posts, file, indent=4)

    return jsonify({"message": "Chat created successfully"})

# API endpoint to get rooms
@app.route('/api/rooms', methods=['GET'])
def get_posts():
    return jsonify(blog_posts)

@app.route('/api/rooms/<int:room_id>', methods=['GET'])
def get_post(room_id):
    post = next((p for p in blog_posts if p['id'] == room_id), None)
    if post:
        return jsonify(post)
    else:
        return jsonify({"message": "Post not found"}), 404


def chat_hash(name, id):
    combined_str = f"{name}{id}"
    hashed_value = hashlib.sha256(combined_str.encode()).hexdigest()
    return int(hashed_value, 16)


if __name__ == '__main__':
    app.secret_key = 'your_secret_key'
    app.run(debug=True)