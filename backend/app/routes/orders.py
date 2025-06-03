from flask import Blueprint, request, jsonify
from app.db import get_db_connection
from app.utils.helper import convert_product_data
import logging
import json
from decimal import Decimal
import base64

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

orders_bp = Blueprint('orders', __name__)

def convert_order_item(item):
    item = dict(item)
    if 'price' in item and isinstance(item['price'], Decimal):
        item['price'] = float(item['price'])
    if 'image' in item:
        if isinstance(item['image'], bytes):
            item['image'] = base64.b64encode(item['image']).decode('utf-8')
        elif isinstance(item['image'], str) and not item['image'].startswith('http'):
            item['image'] = f"http://127.0.0.1:5000/assets/images/{item['image']}"
    if 'total' in item and isinstance(item['total'], Decimal):
        item['total'] = float(item['total'])
    return item

@orders_bp.route('/api/checkout', methods=['POST'])
def place_order():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        items = data.get('items')
        total = data.get('total')
        shipping = data.get('shipping')
        payment = data.get('payment')

        if not all([user_id, items, total, shipping, payment]):
            logger.warning("Missing required fields in checkout request")
            return jsonify({'error': 'Missing required fields'}), 400

        shipping_json = json.dumps(shipping)
        payment_json = json.dumps(payment)

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            'INSERT INTO orders (userId, total, shipping, payment) VALUES (%s, %s, %s, %s)',
            (user_id, total, shipping_json, payment_json)
        )
        order_id = cursor.lastrowid

        for item in items:
            cursor.execute(
                'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (%s, %s, %s, %s)',
                (order_id, item['productId'], item['quantity'], item['price'])
            )

        cursor.execute('DELETE FROM cart_items WHERE userId = %s', (user_id,))

        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"Order placed for user {user_id}, orderId: {order_id}")
        return jsonify({'orderId': order_id, 'message': 'Order placed successfully'}), 201
    except Exception as e:
        logger.error(f"Error placing order: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/api/orders', methods=['GET'])
def get_order_history():
    try:
        user_id = request.headers.get('X-User-ID') or request.args.get('userId')
        if not user_id:
            logger.warning("No user ID provided for order history")
            return jsonify({'error': 'User ID required'}), 400

        logger.debug(f"Fetching order history for user: {user_id}")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT orderId, userId, total, shipping, payment, status, timestamp
            FROM orders
            WHERE userId = %s
            ORDER BY timestamp DESC
        """
        cursor.execute(query, (user_id,))
        orders = cursor.fetchall()

        for order in orders:
            order = convert_order_item(order)
            cursor.execute(
                """
                SELECT oi.orderItemId, oi.orderId, oi.productId, oi.quantity, oi.price,
                       p.title, p.image
                FROM order_items oi
                JOIN products p ON oi.productId = p.productId
                WHERE oi.orderId = %s
                """,
                (order['orderId'],)
            )
            order['items'] = [convert_order_item(item) for item in cursor.fetchall()]

        cursor.close()
        conn.close()

        logger.debug(f"Retrieved {len(orders)} orders for user {user_id}")
        return jsonify(orders), 200
    except Exception as e:
        logger.error(f"Error fetching order history: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/api/orders/<int:orderId>', methods=['GET'])
def get_order_details(orderId):
    try:
        user_id = request.headers.get('X-User-ID') or request.args.get('userId')
        staff_id = request.headers.get('X-Staff-ID') or request.args.get('staffId')

        if not (user_id or staff_id):
            logger.warning("No user or staff ID provided for order details")
            return jsonify({'error': 'User or Staff ID required'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        if staff_id:
            # Verify staff exists
            cursor.execute('SELECT staffId FROM staff WHERE staffId = %s', (staff_id,))
            staff = cursor.fetchone()
            if not staff:
                cursor.close()
                conn.close()
                logger.warning(f"Staff not found for staffId: {staff_id}")
                return jsonify({'error': 'Staff not found'}), 404

            # Staff query: include customer details
            cursor.execute(
                """
                SELECT o.orderId, o.userId, u.name AS customer, u.email AS customerEmail, 
                       o.total, o.shipping, o.payment, o.status, o.timestamp
                FROM orders o
                JOIN users u ON o.userId = u.userId
                WHERE o.orderId = %s
                """,
                (orderId,)
            )
            order = cursor.fetchone()
        else:
            # User query: restrict to user's own order
            cursor.execute(
                """
                SELECT orderId, userId, total, shipping, payment, status, timestamp
                FROM orders
                WHERE orderId = %s AND userId = %s
                """,
                (orderId, user_id)
            )
            order = cursor.fetchone()

        if not order:
            cursor.close()
            conn.close()
            logger.warning(f"Order not found for orderId: {orderId}")
            return jsonify({'error': 'Order not found'}), 404

        # Fetch order items
        cursor.execute(
            """
            SELECT oi.orderItemId, oi.orderId, oi.productId, oi.quantity, oi.price,
                   p.title, p.image
            FROM order_items oi
            JOIN products p ON oi.productId = p.productId
            WHERE oi.orderId = %s
            """,
            (orderId,)
        )
        items = cursor.fetchall()
        order['items'] = [convert_order_item(item) for item in items]

        cursor.close()
        conn.close()

        order = convert_order_item(order)
        logger.debug(f"Retrieved order details for orderId {orderId}")
        return jsonify(order), 200
    except Exception as e:
        logger.error(f"Error fetching order details: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/api/orders/all', methods=['GET'])
def get_all_orders():
    try:
        staff_id = request.headers.get('X-Staff-ID') or request.args.get('staffId')
        if not staff_id:
            logger.warning("No staff ID provided for fetching orders")
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

        query = '''
            SELECT o.orderId, o.userId, u.name AS customer, o.total, o.shipping, o.payment, o.status, o.timestamp
            FROM orders o
            JOIN users u ON o.userId = u.userId
            ORDER BY o.timestamp DESC
        '''
        cursor.execute(query)
        orders = cursor.fetchall()
        cursor.close()
        conn.close()

        orders = [convert_order_item(order) for order in orders]
        logger.debug(f"Retrieved {len(orders)} orders")
        return jsonify(orders), 200
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/api/orders/<int:orderId>', methods=['PUT'])
def update_order_status(orderId):
    try:
        staff_id = request.headers.get('X-Staff-ID') or request.args.get('staffId')
        if not staff_id:
            logger.warning("No staff ID provided for updating order status")
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
        status = data.get('status')
        if not status:
            logger.warning("Missing status in update order request")
            cursor.close()
            conn.close()
            return jsonify({'error': 'Status is required'}), 400

        valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        if status.lower() not in valid_statuses:
            logger.warning(f"Invalid status provided: {status}")
            cursor.close()
            conn.close()
            return jsonify({'error': f"Invalid status. Must be one of {valid_statuses}"}), 400

        cursor.execute(
            'UPDATE orders SET status = %s WHERE orderId = %s',
            (status.lower(), orderId)
        )
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            logger.warning(f"Order not found for orderId: {orderId}")
            return jsonify({'error': 'Order not found'}), 404

        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"Order status updated for orderId: {orderId} to {status}")
        return jsonify({'message': 'Order status updated successfully'}), 200
    except Exception as e:
        logger.error(f"Error updating order status: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        return jsonify({'error': str(e)}), 500