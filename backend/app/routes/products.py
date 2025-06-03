from flask import Blueprint, request, jsonify
from app.db import get_db_connection
import logging
from decimal import Decimal
import os

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

products_bp = Blueprint('products', __name__)

def convert_product_data(product):
    """Convert bytes and Decimal fields to JSON-serializable formats and adjust image paths."""
    product = dict(product)
    if 'image' in product and isinstance(product['image'], bytes):
        product['image'] = product['image'].decode('utf-8')
    if 'image' in product and isinstance(product['image'], str):
        filename = os.path.basename(product['image'])
        product['image'] = f'/assets/images/{filename}' if filename else product['image']
    if 'price' in product and isinstance(product['price'], Decimal):
        product['price'] = float(product['price'])
    if 'description' in product and product['description'] is None:
        product['description'] = 'No description available.'
    return product

@products_bp.route('/api/products', methods=['GET'])
def get_products():
    try:
        logger.debug("Fetching all products")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM products')
        products = cursor.fetchall()
        cursor.close()
        conn.close()
        products = [convert_product_data(product) for product in products]
        logger.debug(f"Retrieved {len(products)} products: {products}")
        return jsonify(products), 200
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        return jsonify({'error': str(e)}), 500

@products_bp.route('/api/products/<int:productId>', methods=['GET'])
def get_product(productId):
    try:
        logger.debug(f"Fetching product with ID {productId}")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM products WHERE productId = %s', (productId,))
        product = cursor.fetchone()
        cursor.close()
        conn.close()
        if product:
            product = convert_product_data(product)
            logger.debug(f"Found product: {product}")
            return jsonify(product), 200
        logger.warning(f"Product with ID {productId} not found")
        return jsonify({'error': 'Product not found'}), 404
    except Exception as e:
        logger.error(f"Error fetching product {productId}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@products_bp.route('/api/products', methods=['POST'])
def add_product():
    logger.debug("add_product endpoint loaded and called")
    try:
        staff_id = request.headers.get('X-Staff-ID') or request.args.get('staffId')
        if not staff_id:
            logger.warning("No staff ID provided for adding product")
            return jsonify({'error': 'Staff ID required'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT staffId FROM staff WHERE staffId = %s', (staff_id,))
        staff = cursor.fetchone()
        if not staff:
            cursor.close()
            conn.close()
            logger.warning(f"Staff not found for staffId: {staff_id}")
            return jsonify({'error': 'Staff not found'}), 404

        data = request.get_json()
        title = data.get('title')
        price = data.get('price')
        categoryId = data.get('categoryId')
        image = data.get('image')
        description = data.get('description')
        rating = data.get('rating', 0.0)
        discount_percentage = data.get('discount_percentage', 0.00)
        original_price = data.get('original_price', 0.00)

        if not all([title, price]):
            logger.warning("Missing required fields in add product request")
            cursor.close()
            conn.close()
            return jsonify({'error': 'Missing required fields (title, price)'}), 400

        try:
            price = float(price)
            if price < 0:
                raise ValueError("Price cannot be negative")
        except (ValueError, TypeError):
            logger.warning(f"Invalid price value: {price}")
            cursor.close()
            conn.close()
            return jsonify({'error': 'Price must be a valid positive number'}), 400

        try:
            rating = float(rating) if rating is not None else 0.0
            if rating < 0 or rating > 5:
                raise ValueError("Rating must be between 0 and 5")
        except (ValueError, TypeError):
            logger.warning(f"Invalid rating value: {rating}")
            cursor.close()
            conn.close()
            return jsonify({'error': 'Rating must be a number between 0 and 5'}), 400

        try:
            discount_percentage = float(discount_percentage) if discount_percentage is not None else 0.00
            if discount_percentage < 0 or discount_percentage > 100:
                raise ValueError("Discount percentage must be between 0 and 100")
        except (ValueError, TypeError):
            logger.warning(f"Invalid discount percentage value: {discount_percentage}")
            cursor.close()
            conn.close()
            return jsonify({'error': 'Discount percentage must be a number between 0 and 100'}), 400

        try:
            original_price = float(original_price) if original_price is not None else 0.00
            if original_price < 0:
                raise ValueError("Original price cannot be negative")
        except (ValueError, TypeError):
            logger.warning(f"Invalid original price value: {original_price}")
            cursor.close()
            conn.close()
            return jsonify({'error': 'Original price must be a valid positive number'}), 400

        cursor.execute(
            'INSERT INTO products (title, price, categoryId, image, description, rating, discount_percentage, original_price) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
            (title, price, categoryId, image, description, rating, discount_percentage, original_price)
        )
        conn.commit()
        product_id = cursor.lastrowid

        cursor.close()
        conn.close()
        logger.info(f"Product created with productId: {product_id}")
        return jsonify({'productId': product_id, 'message': 'Product added successfully'}), 201
    except Exception as e:
        logger.error(f"Error adding product: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/api/search', methods=['GET'])
def search_products():
    try:
        search_query = request.args.get('q', '').strip()
        logger.debug(f"Searching products with query: {search_query}")
        if not search_query:
            return jsonify({'error': 'Search query is required'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT * FROM products 
            WHERE (title LIKE %s OR (description IS NOT NULL AND description LIKE %s))
        """
        like_pattern = f'%{search_query}%'
        logger.debug(f"Executing query: {query} with params: {like_pattern}")
        cursor.execute(query, (like_pattern, like_pattern))
        products = cursor.fetchall()
        cursor.close()
        conn.close()

        if not products:
            logger.debug("No products found for the search query")
            return jsonify([]), 200

        products = [convert_product_data(product) for product in products]
        logger.debug(f"Found {len(products)} products: {products}")
        return jsonify(products), 200
    except Exception as e:
        logger.error(f"Error searching products: {str(e)}")
        return jsonify({'error': str(e)}), 500