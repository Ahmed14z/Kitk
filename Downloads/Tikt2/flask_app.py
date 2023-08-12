from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import jwt
from datetime import datetime, timedelta
from functools import wraps

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


@app.route('/add_user_to_club', methods=['POST'])
@login_required  # Assuming you want only authenticated users to add users to clubs
def add_user_to_club():
    data = request.json
    club_id = data.get('club_id')
    user_id = data.get('user_id')

    if club_id is None or user_id is None:
        return jsonify({'error': 'Missing required data'}), 400

    try:
        club = Club.query.get(club_id)
        user = User.query.get(user_id)
        if club and user:
            club.members.append(user)
            db.session.commit()
            return jsonify({'message': 'User added to the club successfully'}), 201
        else:
            return jsonify({'error': 'Club or user not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
    app.run()
