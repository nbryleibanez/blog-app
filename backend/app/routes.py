from .models import BlogPost

def initialize_routes(api):
    from .resources import BlogPostResource
    api.add_resource(BlogPostResource, '/posts', '/posts/<int:post_id>')

