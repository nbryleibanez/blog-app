from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate
from flask_jwt_extended import JWTManager
from app.routes import init_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)

    init_routes(app)

    return app
