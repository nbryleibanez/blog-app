from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.models import User
from app import db
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Blueprint for authentication
auth_bp = Blueprint('auth', __name__)

# Endpoint for user registration
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Validate required fields
        if not all(field in data for field in ['username', 'email', 'password']):
            return jsonify({"message": "Missing required fields in request"}), 400

        # Check if the username or email already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"message": "Username already exists"}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "Email already exists"}), 400

        # Create a new user
        new_user = User(
            username=data['username'],
            email=data['email'],
        )
        new_user.set_password(data['password'])

        db.session.add(new_user)
        db.session.commit()

        logger.info(f"User {new_user.username} registered successfully")

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        logger.error(f"Error during user registration: {e}")
        return jsonify({"error": "Internal server error"}), 500


# Endpoint for user login (JWT token generation)
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        # Validate input data
        if not all(field in data for field in ['username', 'password']):
            return jsonify({"message": "Missing required fields in request"}), 400

        # Check if the user exists and password matches
        user = User.query.filter_by(username=data['username']).first()
        if not user or not user.check_password(data['password']):  # Verify password using check_password method
            return jsonify({"message": "Invalid username or password"}), 401

        # Create JWT tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        logger.info(f"User {user.username} logged in successfully")

        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200

    except Exception as e:
        logger.error(f"Error during user login: {e}")
        return jsonify({"error": "Internal server error"}), 500


# Protected endpoint example (requires JWT access token)
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        # Get the current user from the JWT token
        current_user_id = get_jwt_identity()
        user = User.query.get_or_404(current_user_id)

        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email
        }), 200

    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        return jsonify({"error": "Internal server error"}), 500


# Endpoint for refreshing JWT tokens
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user_id = get_jwt_identity()
        access_token = create_access_token(identity=current_user_id)

        return jsonify({
            "access_token": access_token
        }), 200

    except Exception as e:
        logger.error(f"Error refreshing token: {e}")
        return jsonify({"error": "Internal server error"}), 500


# New endpoint to verify JWT token and return its payload
@auth_bp.route('/verify', methods=['POST'])
@jwt_required()
def verify():
    """Verify the JWT token and return its payload."""
    try:
        current_user_id = get_jwt_identity()  # Get the identity from the token
        
        # You can also include additional details if needed, such as roles or permissions.
        
        logger.info(f"Token verified for user ID: {current_user_id}")

        return jsonify({
            "message": "Token is valid",
            "user_id": current_user_id,
            # Add any additional claims you want to return here.
            # For example, you could add roles or permissions if they are part of your JWT.
        }), 200

    except Exception as e:
        logger.error(f"Error verifying token: {e}")
        return jsonify({"error": "Internal server error"}), 500
