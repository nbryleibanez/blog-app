import redis
import json
from flask import request, jsonify
from flask_restful import Resource
from .models import BlogPost
from app import db

cache = redis.Redis(host='redis', port=6379)

# Define resource class as before
class BlogPostResource(Resource):
    def get(self, post_id=None):
        if post_id:
            cached_post = cache.get(f"post:{post_id}")
            if cached_post:
                return json.loads(cached_post)

            post = BlogPost.query.get_or_404(post_id)
            response = {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "author": post.author,
                "created_at": post.created_at.isoformat(),
                "updated_at": post.updated_at.isoformat(),
            }
            cache.set(f"post:{post_id}", json.dumps(response), ex=3600)

            return jsonify(response)

        else:
            cached_posts = cache.get("all_posts")
            if cached_posts:
                return json.loads(cached_posts)

            posts = BlogPost.query.all()
            response = [{
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "author": post.author,
                "created_at": post.created_at.isoformat(),
                "updated_at": post.updated_at.isoformat(),
            } for post in posts]
            cache.set("all_posts", json.dumps(response), ex=3600)

            return jsonify(response)

    def post(self):
        data = request.get_json()

        if not all(field in data for field in ['title', 'content', 'author']):
            return {"message": "Missing required fields in request"}, 400

        new_post = BlogPost(
            title=data['title'],
            content=data['content'],
            author=data['author']
        )

        db.session.add(new_post)
        db.session.commit()
        cache.delete("all_posts")

        return {
            "message": "Blog post created", 
            "post_id": new_post.id
        }, 201

    def put(self, post_id):
        post = BlogPost.query.get_or_404(post_id)
        data = request.get_json()
        post.title = data.get('title', post.title)
        post.content = data.get('content', post.content)
        post.author = data.get('author', post.author)
        db.session.commit()
        cache.delete(f"post:{post_id}")
        cache.delete("all_posts")

        return jsonify({"message": "Blog post updated", "post_id": post.id})

    def delete(self, post_id):
        post = BlogPost.query.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()
        cache.delete(f"post:{post_id}")
        cache.delete("all_posts")

        return jsonify({"message": "Blog post deleted", "post_id": post.id})
