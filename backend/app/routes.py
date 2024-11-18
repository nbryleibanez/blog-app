from flask import Blueprint
from app.auth.views import auth_bp
from app.posts.views import posts_bp
from app.comments.views import comments_bp
from app.users.views import users_bp

def init_routes(app):
    """Registers all blueprints with the Flask app."""
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(posts_bp, url_prefix='/posts')
    app.register_blueprint(comments_bp, url_prefix='/comments')
    app.register_blueprint(users_bp, url_prefix='/users')
