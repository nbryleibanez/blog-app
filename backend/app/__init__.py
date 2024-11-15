from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Set up Flask-RESTful API
    api = Api(app)

    from .routes import initialize_routes  
    initialize_routes(api)  # Initialize routes with the api instance

    return app
