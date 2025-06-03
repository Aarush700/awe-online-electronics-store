from flask import Blueprint, request, jsonify
from app.db import get_db_connection
import bcrypt
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/users', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        logger.warning("Missing required fields in signup request")
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        password_bytes = password.encode('utf-8')
        hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (name, email, password) VALUES (%s, %s, %s)',
            (name, email, hashed_password)
        )
        conn.commit()
        user_id = cursor.lastrowid
        cursor.close()
        conn.close()
        logger.info(f"User created with userId: {user_id}")
        return jsonify({'userId': user_id, 'message': 'User created'}), 201
    except Exception as e:
        logger.error(f"Error during signup: {str(e)}")
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        logger.warning("Missing required fields in login request")
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT userId, password FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            password_bytes = password.encode('utf-8')
            stored_password = user['password'] if isinstance(user['password'], bytes) else user['password'].encode('utf-8')
            if bcrypt.checkpw(password_bytes, stored_password):
                logger.info(f"User logged in: userId {user['userId']}")
                return jsonify({'userId': user['userId'], 'token': 'dummy-token'}), 200
        logger.warning(f"Invalid login attempt for email: {email}")
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/users/<int:userId>', methods=['GET'])
def get_user_profile(userId):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            'SELECT userId, name, email FROM users WHERE userId = %s',
            (userId,)
        )
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            logger.debug(f"User profile retrieved: {user}")
            return jsonify(user), 200
        logger.warning(f"User not found for userId: {userId}")
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        logger.error(f"Error fetching user profile for userId {userId}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/users/<int:userId>', methods=['PUT'])
def update_user_profile(userId):
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')

        if not all([name, email]):
            logger.warning("Missing required fields in update user profile request")
            return jsonify({'error': 'Missing required fields'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE users SET name = %s, email = %s WHERE userId = %s',
            (name, email, userId)
        )
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            logger.warning(f"User not found for userId: {userId}")
            return jsonify({'error': 'User not found'}), 404

        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"User profile updated for userId: {userId}")
        return jsonify({'message': 'Profile updated'}), 200
    except Exception as e:
        logger.error(f"Error updating user profile for userId {userId}: {str(e)}")
        return jsonify({'error': str(e)}), 500