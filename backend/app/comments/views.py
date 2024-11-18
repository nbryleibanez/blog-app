from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Comment, BlogPost, User
from app import db
import redis
import logging
import json

logger = logging.getLogger(__name__)

# Initialize Redis connection
try:
    cache = redis.Redis(host='redis', port=6379, decode_responses=True)
    cache.ping()
    logger.info("Connected to Redis successfully.")
except redis.ConnectionError as e:
    logger.error(f"Error connecting to Redis: {e}")
    cache = None

comments_bp = Blueprint('comments', __name__)

@comments_bp.route('', methods=['GET'])
def get_comments():
    """Fetch all comments for a specific post with caching."""
    post_id = request.args.get('post_id', type=int)
    if not post_id:
        return {"error": "Post ID is required"}, 400

    try:
        # Check cache first
        cache_key = f"comments:post:{post_id}"
        cached_comments = cache.get(cache_key)

        if cached_comments:
            logger.info(f"Cache hit for key: {cache_key}")
            return jsonify(json.loads(cached_comments))

        # Fetch from database if not in cache
        comments = Comment.query.filter_by(post_id=post_id).join(User).all()
        response = [{
            "id": comment.id,
            "content": comment.content,
            "author_id": comment.author_id,
            "author_name": comment.author.name,
            "post_id": comment.post_id,
            "created_at": comment.created_at.isoformat(),
            "updated_at": comment.updated_at.isoformat(),
        } for comment in comments]

        # Cache the result
        if cache:
            cache.set(cache_key, json.dumps(response), ex=3600)  # Cache for 1 hour
            logger.info(f"Cache set for key: {cache_key}")

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error fetching comments: {e}")
        return {"error": "Internal server error"}, 500


@comments_bp.route('', methods=['POST'])
@jwt_required()
def create_comment():
    """Create a new comment for a specific blog post."""
    data = request.get_json()
    user_id = get_jwt_identity()

    if not all(field in data for field in ['content', 'post_id']):
        return {"message": "Missing required fields in request"}, 400

    try:
        new_comment = Comment(
            content=data['content'],
            author_id=user_id,
            post_id=data['post_id']
        )

        db.session.add(new_comment)
        db.session.commit()

        # Invalidate the cache for this post's comments
        if cache:
            cache.delete(f"comments:post:{data['post_id']}")
            logger.info(f"Cache invalidated for post ID: {data['post_id']}")

        return {"message": "Comment created", "comment_id": new_comment.id}, 201

    except Exception as e:
        logger.error(f"Error creating comment: {e}")
        return {"error": "Internal server error"}, 500


@comments_bp.route('/<int:comment_id>', methods=['PUT'])
@jwt_required()
def update_comment(comment_id):
    """Update a specific comment by ID."""
    data = request.get_json()
    
    try:
        comment = Comment.query.get_or_404(comment_id)
        
        # Ensure the user is the author of the comment
        if comment.author_id != int(get_jwt_identity()):
            return {"error": "Unauthorized"}, 403
        
        comment.content = data.get('content', comment.content)
        
        db.session.commit()

        # Invalidate the cache for this post's comments
        if cache:
            cache.delete(f"comments:post:{comment.post_id}")
            logger.info(f"Cache invalidated for post ID: {comment.post_id}")

        return {"message": "Comment updated", "comment_id": comment.id}, 200

    except Exception as e:
        logger.error(f"Error updating comment: {e}")
        return {"error": "Internal server error"}, 500


@comments_bp.route('/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    """Delete a specific comment by ID."""
    try:
        comment = Comment.query.get_or_404(comment_id)
        
        current_user_id = get_jwt_identity()
        
        if comment.author_id != int(current_user_id):
            return {"error": "Unauthorized"}, 403

        db.session.delete(comment)
        db.session.commit()

        # Invalidate the cache for this post's comments
        if cache:
            cache.delete(f"comments:post:{comment.post_id}")
            logger.info(f"Cache invalidated for post ID: {comment.post_id}")

        return {"message": "Comment deleted", "comment_id": comment.id}, 200

    except Exception as e:
        logger.error(f"Error deleting comment: {e}")
        return {"error": "Internal server error"}, 500
