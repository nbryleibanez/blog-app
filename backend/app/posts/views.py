from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import BlogPost, User
from app import db
import redis
import logging
import json
from sqlalchemy import or_

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    cache = redis.Redis(host='redis', port=6379, decode_responses=True)
    cache.ping()
    logger.info("Connected to Redis successfully.")
except redis.ConnectionError as e:
    logger.error(f"Error connecting to Redis: {e}")
    cache = None

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('', methods=['GET'])
def get_posts():
    """Fetch blog posts with optional search, pagination, and caching."""
    if not cache:
        logger.warning("Cache not available. Falling back to database only.")

    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 4, type=int)
        search_query = request.args.get('search', '', type=str)

        cache_key = f"all_posts:{page}:{per_page}:search:{search_query}"
        cached_posts = cache.get(cache_key)

        if cached_posts:
            logger.info(f"Cache hit for key: {cache_key}")
            return jsonify(json.loads(cached_posts))

        query = BlogPost.query
        if search_query:
            query = query.join(User).filter(
                or_(
                    BlogPost.title.ilike(f"%{search_query}%"),
                    BlogPost.content.ilike(f"%{search_query}%"),
                    User.name.ilike(f"%{search_query}%"),
                    User.username.ilike(f"%{search_query}%"),
                )
            )

        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        response = {
            "posts": [{
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "author": {
                    "id": post.author.id,
                    "name": post.author.name,
                    "username": post.author.username,
                },
                "created_at": post.created_at.isoformat(),
                "updated_at": post.updated_at.isoformat(),
            } for post in pagination.items],
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev,
        }

        if cache:
            cache.set(cache_key, json.dumps(response), ex=3600)
            logger.info(f"Cache set for key: {cache_key}")

        return jsonify(response)

    except Exception as e:
        logger.error(f"Error fetching blog posts: {e}")
        return {"error": "Internal server error"}, 500


@posts_bp.route('', methods=['POST'])
@jwt_required()
def create_post():
    """Create a new blog post and clear related caches."""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()

        if not all(field in data for field in ['title', 'content']):
            return {"message": "Missing required fields in request"}, 400

        new_post = BlogPost(
            title=data['title'],
            content=data['content'],
            author_id=user_id,
        )

        db.session.add(new_post)
        db.session.commit()

        if cache:
            for key in cache.scan_iter("all_posts*"):
                cache.delete(key)
            logger.info("Cache cleared for all posts")

        return {"message": "Blog post created", "post_id": new_post.id}, 201

    except Exception as e:
        logger.error(f"Error creating blog post: {e}")
        return {"error": "Internal server error"}, 500


@posts_bp.route('/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """Fetch a single blog post by ID, with caching."""
    if not cache:
        logger.warning("Cache not available. Falling back to database only.")

    try:
        cache_key = f"post:{post_id}"
        cached_post = cache.get(cache_key)

        if cached_post:
            logger.info(f"Cache hit for post: {post_id}")
            return jsonify(json.loads(cached_post))

        post = BlogPost.query.get_or_404(post_id)
        response = {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "author": {
                "id": post.author.id,
                "name": post.author.name,
                "username": post.author.username,
            },
            "created_at": post.created_at.isoformat(),
            "updated_at": post.updated_at.isoformat(),
        }

        if cache:
            cache.set(cache_key, json.dumps(response), ex=3600)
            logger.info(f"Post {post_id} cached successfully.")

        return jsonify(response)

    except Exception as e:
        logger.error(f"Error fetching blog post: {e}")
        return {"error": "Internal server error"}, 500


@posts_bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    """Update a blog post by ID and clear related caches."""
    try:
        post = BlogPost.query.get_or_404(post_id)
        data = request.get_json()

        post.title = data.get('title', post.title)
        post.content = data.get('content', post.content)

        db.session.commit()

        if cache:
            cache.delete(f"post:{post_id}")
            for key in cache.scan_iter("all_posts*"):
                cache.delete(key)
            logger.info("Cache cleared for all posts")

        return {"message": "Blog post updated", "post_id": post.id}, 200

    except Exception as e:
        logger.error(f"Error updating blog post: {e}")
        return {"error": "Internal server error"}, 500


@posts_bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    """Delete a blog post by ID and clear related caches."""
    try:
        post = BlogPost.query.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()

        if cache:
            cache.delete(f"post:{post_id}")
            for key in cache.scan_iter("all_posts*"):
                cache.delete(key)
            logger.info("Cache cleared for all posts")

        return {"message": "Blog post deleted", "post_id": post.id}, 200

    except Exception as e:
        logger.error(f"Error deleting blog post: {e}")
        return {"error": "Internal server error"}, 500
