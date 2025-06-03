from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os
import logging

def create_app():
    # Configure logging
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)

    app = Flask(__name__)

    # Enable CORS for API endpoints and static images
    CORS(app, resources={
        r"/api/*": {"origins": "http://localhost:3000"},
        r"/assets/images/*": {"origins": "http://localhost:3000"}
    })

    # Define the image directory (updated to frontend/assets)
    IMAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'assets', 'images'))
    logger.debug(f"Image directory set to: {IMAGE_DIR}")

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.cart import cart_bp
    from app.routes.orders import orders_bp
    from app.routes.staff import staff_bp

    app.register_blueprint(auth_bp, name='auth_api')
    app.register_blueprint(products_bp, name='products_api')
    app.register_blueprint(cart_bp, name='cart_api')
    app.register_blueprint(orders_bp, name='orders_api')
    app.register_blueprint(staff_bp, name='staff_api')

    # Serve static images
    @app.route('/assets/images/<path:filename>')
    def serve_image(filename):
        logger.debug(f"Request to serve image: {filename}")

        # Check if the file exists
        file_path = os.path.join(IMAGE_DIR, filename)
        if not os.path.isfile(file_path):
            logger.warning(f"Image file does not exist: {file_path}, serving default.png")
            default_path = os.path.join(IMAGE_DIR, 'default.png')
            if os.path.isfile(default_path):
                return send_from_directory(IMAGE_DIR, 'default.png')
            return jsonify({'error': 'Image file not found'}), 404

        try:
            return send_from_directory(IMAGE_DIR, filename)
        except Exception as e:
            logger.error(f"Failed to serve image {filename}: {str(e)}")
            return jsonify({'error': f'Failed to serve image: {str(e)}'}), 500

    # Handle undefined routes
    @app.errorhandler(404)
    def not_found(error):
        logger.warning(f"Route not found: {request.url}")
        return jsonify({'error': 'Route not found'}), 404

    return app