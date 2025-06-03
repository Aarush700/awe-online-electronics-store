from flask import Blueprint, request, jsonify
from app.db import get_db_connection
import logging
import base64
from decimal import Decimal

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

cart_bp = Blueprint('cart', __name__)

def convert_cart_item(item):
    item = dict(item)
    if 'price' in item and isinstance(item['price'], Decimal):
        item['price'] = float(item['price'])
    if 'image' in item:
        if isinstance(item['image'], bytes):
            item['image'] = base64.b64encode(item['image']).decode('utf-8')
        elif isinstance(item['image'], str) and not item['image'].startswith('http'):
            item['image'] = f"http://127.0.0.1:5000/static/images/{item['image']}"
    return item

@cart_bp.route('/api/cart', methods=['GET'])
def get_cart():
    try:
        user_id = request.headers.get('X-User-ID') or request.args.get('userId')
        if not user_id:
            logger.warning("No user ID provided for cart fetch")
            return jsonify({'error': 'User ID required'}), 400

        logger.debug(f"Fetching cart for user: {user_id}")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT ci.cartItemId, ci.userId, ci.productId, ci.quantity, ci.addedAt,
                   p.title, p.price, p.image
            FROM cart_items ci
            JOIN products p ON ci.productId = p.productId
            WHERE ci.userId = %s
        """
        cursor.execute(query, (user_id,))
        items = cursor.fetchall()
        cursor.close()
        conn.close()

        items = [convert_cart_item(item) for item in items]
        logger.debug(f"Retrieved {len(items)} cart items for user {user_id}")
        return jsonify(items), 200
    except Exception as e:
        logger.error(f"Error fetching cart: {str(e)}")
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/api/cart', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        product_id = data.get('productId')
        quantity = data.get('quantity', 1)

        if not user_id or not product_id:
            logger.warning("Missing userId or productId in add-to-cart request")
            return jsonify({'error': 'User ID and Product ID required'}), 400

        logger.debug(f"Adding to cart: user={user_id}, product={product_id}, quantity={quantity}")

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT productId FROM products WHERE productId = %s', (product_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            logger.warning(f"Product {product_id} not found")
            return jsonify({'error': 'Product not found'}), 404

        query = """
            INSERT INTO cart_items (userId, productId, quantity)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE
                quantity = quantity + VALUES(quantity)
        """
        logger.debug(f"Executing query: {query} with params: {user_id}, {product_id}, {quantity}")
        cursor.execute(query, (user_id, product_id, quantity))
        conn.commit()

        cursor.close()
        conn.close()
        logger.info(f"Added/updated cart item for user {user_id}")
        return jsonify({'SUCCESS': 'Item added to cart'}), 200
    except Exception as e:
        logger.error(f"Error adding to cart: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/api/cart-items/<int:productId>', methods=['PUT'])
def update_cart_item(productId):
    try:
        data = request.get_json()
        user_id = data.get('userId')
        quantity = data.get('quantity')

        if not user_id or quantity is None:
            logger.warning("Missing userId or quantity in update-cart request")
            return jsonify({'error': 'User ID and quantity required'}), 400

        if quantity < 1:
            logger.warning("Invalid quantity provided")
            return jsonify({'error': 'Quantity must be at least 1'}), 400

        logger.debug(f"Updating cart item: user={user_id}, product={productId}, quantity={quantity}")
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            'UPDATE cart_items SET quantity = %s WHERE userId = %s AND productId = %s',
            (quantity, user_id, productId)
        )
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            logger.warning(f"Cart item not found for user {user_id}, product {productId}")
            return jsonify({'error': 'Cart item not found'}), 404

        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"Updated cart item for user {user_id}")
        return jsonify({'message': 'Cart item updated'}), 200
    except Exception as e:
        logger.error(f"Error updating cart item: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/api/cart-items/<int:productId>', methods=['DELETE'])
def remove_cart_item(productId):
    try:
        user_id = request.args.get('userId')
        if not user_id:
            logger.warning("No userId provided for remove-cart-item")
            return jsonify({'error': 'User ID required'}), 400

        logger.debug(f"Removing cart item: user={user_id}, product={productId}")
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            'DELETE FROM cart_items WHERE userId = %s AND productId = %s',
            (user_id, productId)
        )
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            logger.warning(f"Cart item not found for user {user_id}, product {productId}")
            return jsonify({'error': 'Cart item not found'}), 404

        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"Removed cart item for user {user_id}")
        return jsonify({'message': 'Cart item removed'}), 200
    except Exception as e:
        logger.error(f"Error removing cart item: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/api/cart', methods=['DELETE'])
def clear_cart():
    try:
        user_id = request.args.get('userId')
        if not user_id:
            logger.warning("No userId provided for clear-cart")
            return jsonify({'error': 'User ID required'}), 400

        logger.debug(f"Clearing cart for user: {user_id}")
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('DELETE FROM cart_items WHERE userId = %s', (user_id,))
        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"Cleared cart for user {user_id}")
        return jsonify({'SUCCESS': 'Cart cleared'}), 200
    except Exception as e:
        logger.error(f"Error clearing cart: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        return jsonify({'error': str(e)}), 500