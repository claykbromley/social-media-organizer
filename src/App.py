from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # Use SQLite for simplicity
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
CORS(
    app,
    origins=["http://localhost:3000"],
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

folders = []

@app.route("/folders", methods=["GET", "POST", "OPTIONS"])
def handle_folders():
    global folders
    if request.method == "OPTIONS":  # Handle preflight requests
        response = app.response_class(status=204)
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response

    if request.method == "GET":
        return jsonify(folders), 200

    if request.method == "POST":
        data = request.json
        folder_name = data.get("folderName")
        if not folder_name:
            return jsonify({"error": "folderName is required"}), 400

        new_folder = {"folderName": folder_name, "posts": []}
        folders.append(new_folder)
        return jsonify(new_folder), 201
    
    if request.method == "DELETE":
        folder_to_delete = next((f for f in folders if f["folderName"] == folder_name), None)
        if not folder_to_delete: return jsonify({"error": "Folder not found"}), 404
        folders = [f for f in folders if f["folderName"] != folder_name]
        return jsonify({"message": f"Folder '{folder_name}' deleted successfully"}), 200

@app.route("/folders", methods=["GET"])
def get_folders():
    """Load all folders."""
    return jsonify(folders), 200

@app.route("/folders/<string:folder_name>", methods=["DELETE"])
def delete_folder(folder_name):
    global folders
    folders = [folder for folder in folders if folder["folderName"] != folder_name]
    return jsonify({"message": f"Folder '{folder_name}' deleted."}), 200

@app.route("/folders/<string:folder_name>", methods=["PUT"])
def update_folder(folder_name):
    """Update a folder's posts."""
    data = request.json
    posts = data.get("posts")

    for folder in folders:
        if folder["folderName"] == folder_name:
            if posts is not None:
                folder["posts"] = posts
            return jsonify(folder), 200

    return jsonify({"error": "Folder not found"}), 404

@app.route("/folders/<string:folder_name>/posts", methods=["POST"])
def add_post(folder_name):
    """Add a post to a specific folder."""
    data = request.json
    post = {
        "title": data.get("title"),
        "content": data.get("content"),
        "tags": data.get("tags", [])
    }

    if not post["title"] or not post["content"]:
        return jsonify({"error": "title and content are required"}), 400

    for folder in folders:
        if folder["folderName"] == folder_name:
            folder["posts"].append(post)
            return jsonify(post), 201

    return jsonify({"error": "Folder not found"}), 404

@app.route("/folders/<string:folder_name>/posts/<string:post_title>", methods=["DELETE"])
def delete_post(folder_name, post_title):
    """Delete a specific post by title in a folder."""
    for folder in folders:
        if folder["folderName"] == folder_name:
            folder["posts"] = [post for post in folder["posts"] if post["title"] != post_title]
            return jsonify({"message": f"Post '{post_title}' deleted."}), 200

    return jsonify({"error": "Folder or post not found"}), 404

@app.route("/folders/<string:folder_name>/posts/<string:post_title>", methods=["PUT"])
def update_post(folder_name, post_title):
    """Update a specific post by title in a folder."""
    data = request.json
    new_title = data.get("title")
    new_content = data.get("content")
    new_tags = data.get("tags", [])

    for folder in folders:
        if folder["folderName"] == folder_name:
            for post in folder["posts"]:
                if post["title"] == post_title:
                    if new_title:
                        post["title"] = new_title
                    if new_content:
                        post["content"] = new_content
                    post["tags"] = new_tags
                    return jsonify(post), 200

    return jsonify({"error": "Folder or post not found"}), 404

# Initialize the database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
