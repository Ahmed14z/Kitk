from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import jwt
from datetime import datetime, timedelta
from functools import wraps
import requests


OPENAI_API_KEY = 'Enter-Open Ai-Api'

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "headers": "Authorization"}})
db_path = os.path.join(os.path.dirname(__file__), 'test.db')

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://Ahmed14z:Kitk1234@Ahmed14z.mysql.pythonanywhere-services.com/Ahmed14z$default'
db = SQLAlchemy(app)
app.config['SECRET_KEY'] = 'YourSecretKey'  # Change this to a secure secret key

secret_key = 'Kitk1234'  # Change this to your actual secret key

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)

club_users = db.Table(
    'club_users',
    db.Column('club_id', db.Integer, db.ForeignKey('clubs.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)


class Club(db.Model):
    __tablename__ = 'clubs'

    id = db.Column(db.Integer, primary_key=True)
    club_name = db.Column(db.String(100), nullable=False)
    club_topic = db.Column(db.String(100), nullable=False)
    club_university = db.Column(db.String(100), nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    admin = db.relationship('User', backref='clubs_admin', foreign_keys=[admin_id])
    members = db.relationship('User', secondary=club_users, backref='clubs')

class Channel(db.Model):
    __tablename__ = 'channels'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)


class Roadmap(db.Model):
    __tablename__ = 'roadmaps'

    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey('channels.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    channel = db.relationship('Channel', backref=db.backref('roadmaps', lazy=True))

class Tutorial(db.Model):
    __tablename__ = 'tutorials'

    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey('channels.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    channel = db.relationship('Channel', backref=db.backref('tutorials', lazy=True))

@app.route('/create_channel', methods=['POST'])
# @login_required  
def create_channel():
    data = request.json
    title = data.get('title')
    description = data.get('description')

    if not title or not description:
        return jsonify({'error': 'Missing required data'}), 400

    try:
        new_channel = Channel(title=title, description=description)
        db.session.add(new_channel)
        db.session.commit()
        return jsonify({'message': 'Channel created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/get_channels', methods=['GET'])
def get_channels():
    try:
        channels = Channel.query.all()
        channel_list = [{'id': channel.id, 'title': channel.title, 'description': channel.description} for channel in channels]
        return jsonify({'channels': channel_list})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']
    account_type = data['type']

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({'exists': True})
    else:
        new_user = User(username=username, email=email, password=password, type=account_type)
        db.session.add(new_user)
        db.session.commit()

        # Generate a JWT token for the newly registered user
        token_payload = {
            'sub': new_user.id,
            'email': new_user.email,
            'username': new_user.username,
            'type': new_user.type,
            'exp': datetime.utcnow() + timedelta(hours=1)  # Token expiration time
        }
        token = jwt.encode(token_payload, secret_key, algorithm='HS256')

        return jsonify({'exists': False, 'token': token})

@app.route('/get_channel_data/<int:channel_id>', methods=['GET'])
def get_channel_data(channel_id):
    try:
        channel = Channel.query.get(channel_id)
        if channel:
            tutorials = [{'id': tutorial.id, 'title': tutorial.title, 'description': tutorial.description} for tutorial in channel.tutorials]
            roadmaps = [{'id': roadmap.id, 'title': roadmap.title, 'description': roadmap.description} for roadmap in channel.roadmaps]
            return jsonify({'tutorials': tutorials, 'roadmaps': roadmaps})
        else:
            return jsonify({'error': 'Channel not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/publish_tutorial', methods=['POST'])
def publish_tutorial():
    data = request.json
    title = data.get('title')
    description = data.get('desc')
    channel_id = data.get('channel')

    # Create a new tutorial in the database
    new_tutorial = Tutorial(title=title, description=description, content='', channel_id=channel_id)
    db.session.add(new_tutorial)
    db.session.commit()

    return jsonify({'message': 'Tutorial published successfully'})


@app.route('/publish_roadmap', methods=['POST'])
def publish_roadmap():
    data = request.json
    title = data.get('title')
    description = data.get('desc')
    channel_id = data.get('channel')

    # Create a new roadmap in the database
    new_roadmap = Roadmap(title=title, description=description, content='', channel_id=channel_id)
    db.session.add(new_roadmap)
    db.session.commit()

    return jsonify({'message': 'Roadmap published successfully'})



# ... rest of your code ...


# @app.route('/register', methods=['POST'])
# def register():
#     data = request.json
#     email = data['email']
#     password = data['password']
#     account_type = data['type']

#     existing_user = User.query.filter_by(email=email).first()

#     if existing_user:
#         return jsonify({'exists': True})
#     else:
#         new_user = User(email=email, password=password, type=account_type)
#         db.session.add(new_user)
#         db.session.commit()
#         return jsonify({'exists': False})




@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email, password=password).first()

    if user:
        # Generate a JWT token
        token_payload = {
            'sub': user.id,
            'email': user.email,
            'username': user.username,
            'type': user.type,
            'exp': datetime.utcnow() + timedelta(hours=1)  # Token expiration time
        }
        token = jwt.encode(token_payload, secret_key, algorithm='HS256')

        return jsonify({'token': token})
    else:
        return jsonify({'error': 'Invalid credentials'})



def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
            # You can access token data using decoded_token dictionary
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

    return decorated_function


@app.route('/validate', methods=['POST'])
def validate_token():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401

    try:
        decoded_token = jwt.decode(token.split()[1], secret_key, algorithms=['HS256'])
        user_type = decoded_token.get('type', '')
        
        if user_type == 'student':
            return jsonify({'valid': True, 'type': user_type})
        elif user_type == 'admin':
            return jsonify({'valid': True, 'type': user_type})
        else:
            return jsonify({'valid': False, 'type': user_type}), 403  # Forbidden

    except jwt.ExpiredSignatureError:
        return jsonify({'valid': False, 'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'valid': False, 'error': 'Invalid token'}), 401


@app.route('/protected', methods=['GET'])
@login_required
def protected_route():
    return jsonify({'message': 'This is a protected route'})




@login_required
@app.route('/userinfo', methods=['GET'])
def get_user_info():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401

    try:
        decoded_token = jwt.decode(token.split()[1], secret_key, algorithms=['HS256'])
        user_id = decoded_token.get('sub')
        
        user = User.query.get(user_id)
        if user:
            return jsonify({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'type': user.type
            })
        else:
            return jsonify({'error': 'User not found'}), 404

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401


@app.route('/create_club', methods=['POST'])
# @login_required  # Assuming you want only authenticated users to create clubs
def create_club():
    data = request.json
    club_name = data.get('club_name')
    club_topic = data.get('club_topic')
    club_university = data.get('club_university')
    admin_id = data.get('admin_id')

    if not club_name or not club_topic or not club_university or admin_id is None:
        return jsonify({'error': 'Missing required data'}), 400

    try:
        new_club = Club(club_name=club_name, club_topic=club_topic, club_university=club_university, admin_id=admin_id)
        db.session.add(new_club)
        db.session.commit()
        return jsonify({'message': 'Club created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/get_club/<int:admin_id>', methods=['GET'])
# @login_required
def get_club(admin_id):
    try:
        club = Club.query.filter_by(admin_id=admin_id).first()
        if club:
            return jsonify({
                'club_name': club.club_name,
                'club_topic': club.club_topic,
                'club_university': club.club_university
            })
        else:
            return jsonify({'error': 'Club not found for the given admin ID'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/get_club_members/<int:club_id>', methods=['GET'])
@login_required  # Assuming you want only authenticated users to access club members
def get_club_members(club_id):
    try:
        club = Club.query.get(club_id)
        if club:
            members = [{'username': member.username, 'email': member.email} for member in club.members]
            return jsonify({'members': members})
        else:
            return jsonify({'error': 'Club not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/edit_club/<int:admin_id>', methods=['PUT'])
@login_required  # Assuming you want only authenticated users to edit club information
def edit_club(admin_id):
    data = request.json
    new_club_name = data.get('club_name')
    new_club_topic = data.get('club_topic')
    new_club_university = data.get('club_university')

    if not new_club_name or not new_club_topic or not new_club_university:
        return jsonify({'error': 'Missing required data'}), 400

    try:
        club = Club.query.filter_by(admin_id=admin_id).first()
        if club:
            club.club_name = new_club_name
            club.club_topic = new_club_topic
            club.club_university = new_club_university
            db.session.commit()
            return jsonify({'message': 'Club information updated successfully'}), 200
        else:
            return jsonify({'error': 'Club not found for the given admin ID'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/add_user_to_club', methods=['POST'])
@login_required  # Assuming you want only authenticated users to add users to clubs
def add_user_to_club():
    data = request.json
    club_id = data.get('club_id')
    user_email = data.get('email')  # Change to 'user_email' to match the frontend payload
    
    if club_id is None or user_email is None:
        return jsonify({'error': 'Missing required data'}), 400

    try:
        club = Club.query.get(club_id)
        user = User.query.filter_by(email=user_email).first()  # Query the user by email
        if club and user:
            club.members.append(user)
            db.session.commit()
            return jsonify({'message': 'User added to the club successfully'}), 201
        else:
            return jsonify({'error': 'Club or user not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/generate', methods=['POST'])
def generate_response():
    data = request.get_json()
    command = data.get('command')

    # Make a request to the ChatGPT API
    chatgpt_api_url = 'https://api.openai.com/v1/chat/completions'
    headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {OPENAI_API_KEY}'}
    payload = {
                'model': "gpt-3.5-turbo",
                'messages': [{'role': "system", 'content': command}]
            }
    response = requests.post(chatgpt_api_url, headers=headers, json=payload)
    chatgpt_response = response.json()

    return jsonify(chatgpt_response)

# ...


# @app.route('/login', methods=['POST'])
# def login():
#     data = request.json
#     email = data['email']
#     password = data['password']

#     user = User.query.filter_by(email=email, password=password).first()

#     if user:
#         return jsonify({'type': user.type})
#     else:
#         return jsonify({'type': 'invalid'})

if __name__ == '__main__':
    app.run(port=8001)  # Change 8000 to the port you want to use
    
