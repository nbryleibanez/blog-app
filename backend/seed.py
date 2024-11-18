from app import create_app, db
from app.models import User, BlogPost, Comment

# Create an instance of the Flask application
app = create_app()

# Define a function to seed the database
def seed_database():
    with app.app_context():
        # Drop all existing tables and recreate them
        db.drop_all()
        db.create_all()

        # Seed Users
        user1 = User(username='johndoe', name='John Doe', email='john@example.com')
        user1.set_password('password123')  # Set password for user1
        user2 = User(username='janedoe', name='Jane Doe', email='jane@example.com')
        user2.set_password('password456')  # Set password for user2

        db.session.add_all([user1, user2])
        db.session.commit()  # Commit users to get their IDs

        # Seed Blog Posts with valid author_id
        post1 = BlogPost(title='First Post', content='This is the content of the first post.', author_id=user1.id)
        post2 = BlogPost(title='Second Post', content='This is some content for the second post.', author_id=user2.id)

        db.session.add_all([post1, post2])
        db.session.commit()  # Commit posts to get their IDs

        # Seed Comments with valid post_id and author_id
        comment1 = Comment(content='Great post!', author_id=user2.id, post_id=post1.id)
        comment2 = Comment(content='Thanks for sharing!', author_id=user1.id, post_id=post2.id)

        db.session.add_all([comment1, comment2])
        db.session.commit()  # Commit all changes to the database

        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
