from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app import db
from werkzeug.exceptions import BadRequest
import redis
import logging
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Redis connection
try:
    cache = redis.Redis(host='redis', port=6379, decode_responses=True)
    cache.ping()
    logger.info("Connected to Redis successfully.")
except redis.ConnectionError as e:
    logger.error(f"Error connecting to Redis: {e}")
    cache = None

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user():
    """Get current user's profile with caching."""
    user_id = get_jwt_identity()
    logger.info(f"Fetching user profile: {user_id}")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Check cache first
        cache_key = f"user:{user_id}"
        cached_user = cache.get(cache_key)

        if cached_user:
            logger.info(f"Cache hit for key: {cache_key}")
            return jsonify(json.loads(cached_user)), 200

        # Fetch from database if not in cache
        user = User.query.get_or_404(user_id)

        response = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": user.name,
        }

        # Cache the result
        if cache:
            cache.set(cache_key, json.dumps(response), ex=3600)  # Cache for 1 hour
            logger.info(f"Cache set for key: {cache_key}")

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        return jsonify({"error": "Failed to fetch user profile", "details": str(e)}), 500


@users_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_user():
    """Update current user's profile."""
    user_id = get_jwt_identity()
    logger.info(f"Updating user profile: {user_id}")

    try:
        user = User.query.get_or_404(user_id)

        # Validate input data
        data = request.get_json()
        if not data:
            raise BadRequest("Request body must be JSON")

        if 'name' in data and (not isinstance(data['name'], str) or not data['name'].strip()):
            raise BadRequest("Name must be a non-empty string")

        # Update allowed fields
        user.name = data.get('name', user.name).strip()
        db.session.commit()

        response = {
            "message": "User profile updated successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": user.name,
            }
        }

        # Invalidate the cache for this user's profile
        if cache:
            cache.delete(f"user:{user_id}")
            logger.info(f"Cache invalidated for key: user:{user_id}")

        return jsonify(response), 200

    except BadRequest as e:
        return jsonify({"error": "Invalid input", "details": str(e)}), 400

    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to update user profile: {e}")
        return jsonify({"error": "Failed to update user profile", "details": str(e)}), 500
