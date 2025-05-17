from flask import Blueprint, request, jsonify
from app.db import get_db_connection
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/users', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Encode password to bytes
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
        return jsonify({'userId': user_id, 'message': 'User created'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT userId, password FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            # Ensure both password inputs are bytes
            password_bytes = password.encode('utf-8')
            stored_password = user['password'] if isinstance(user['password'], bytes) else user['password'].encode('utf-8')
            if bcrypt.checkpw(password_bytes, stored_password):
                return jsonify({'userId': user['userId'], 'token': 'dummy-token'}), 200
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/staff/login', methods=['POST'])
def staff_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT staffId, password FROM staff WHERE email = %s', (email,))
        staff = cursor.fetchone()
        cursor.close()
        conn.close()

        if staff:
            # Ensure both password inputs are bytes
            password_bytes = password.encode('utf-8')
            stored_password = staff['password'] if isinstance(staff['password'], bytes) else staff['password'].encode('utf-8')
            if bcrypt.checkpw(password_bytes, stored_password):
                return jsonify({'staffId': staff['staffId'], 'token': 'dummy-token'}), 200
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500