from flask import Blueprint, request, jsonify
from app.db import get_db_connection
import bcrypt
import logging
from datetime import datetime

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

staff_bp = Blueprint('staff', __name__)

@staff_bp.route('/api/staff/login', methods=['POST'])
def staff_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT staffId, name, email, password, role FROM staff WHERE email = %s', (email,))
        staff = cursor.fetchone()
        cursor.close()
        conn.close()

        if staff:
            password_bytes = password.encode('utf-8')
            stored_password = staff['password'] if isinstance(staff['password'], bytes) else staff['password'].encode('utf-8')
            if bcrypt.checkpw(password_bytes, stored_password):
                return jsonify({
                    'staffId': staff['staffId'], 
                    'name': staff['name'],
                    'email': staff['email'],
                    'role': staff.get('role', 'staff'),
                    'token': 'dummy-token'
                }), 200
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        logger.error(f"Staff login error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@staff_bp.route('/api/staff', methods=['GET'])
def get_all_staff():
    try:
        staff_id = request.headers.get('X-Staff-ID')
        if not staff_id:
            return jsonify({'error': 'Unauthorized'}), 401

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT staffId, name, email, role, created_at 
            FROM staff 
            ORDER BY created_at DESC
        ''')
        staff_list = cursor.fetchall()
        cursor.close()
        conn.close()

        for staff in staff_list:
            if staff.get('created_at'):
                staff['created_at'] = staff['created_at'].isoformat()

        return jsonify(staff_list), 200
    except Exception as e:
        logger.error(f"Error fetching staff list: {str(e)}")
        return jsonify({'error': str(e)}), 500

@staff_bp.route('/api/staff', methods=['POST'])
def create_staff():
    try:
        staff_id = request.headers.get('X-Staff-ID')
        if not staff_id:
            return jsonify({'error': 'Unauthorized'}), 401

        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'staff')

        if not all([name, email, password]):
            return jsonify({'error': 'Missing required fields'}), 400

        password_bytes = password.encode('utf-8')
        hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT staffId FROM staff WHERE email = %s', (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Email already exists'}), 400

        cursor.execute(
            'INSERT INTO staff (name, email, password, role) VALUES (%s, %s, %s, %s)',
            (name, email, hashed_password, role)
        )
        conn.commit()
        new_staff_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return jsonify({
            'staffId': new_staff_id,
            'name': name,
            'email': email,
            'role': role,
            'message': 'Staff created successfully'
        }), 201
    except Exception as e:
        logger.error(f"Error creating staff: {str(e)}")
        return jsonify({'error': str(e)}), 500

@staff_bp.route('/api/staff/<int:staffId>', methods=['PUT'])
def update_staff(staffId):
    try:
        requesting_staff_id = request.headers.get('X-Staff-ID')
        if not requesting_staff_id:
            return jsonify({'error': 'Unauthorized'}), 401

        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        role = data.get('role')

        if not all([name, email, role]):
            return jsonify({'error': 'Missing required fields'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT staffId FROM staff WHERE email = %s AND staffId != %s', (email, staffId))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Email already exists'}), 400

        cursor.execute(
            'UPDATE staff SET name = %s, email = %s, role = %s WHERE staffId = %s',
            (name, email, role, staffId)
        )
        
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Staff member not found'}), 404

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Staff updated successfully'}), 200
    except Exception as e:
        logger.error(f"Error updating staff: {str(e)}")
        return jsonify({'error': str(e)}), 500

@staff_bp.route('/api/staff/<int:staffId>', methods=['DELETE'])
def delete_staff(staffId):
    try:
        requesting_staff_id = request.headers.get('X-Staff-ID')
        if not requesting_staff_id:
            return jsonify({'error': 'Unauthorized'}), 401

        if int(requesting_staff_id) == staffId:
            return jsonify({'error': 'Cannot delete your own account'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM staff WHERE staffId = %s', (staffId,))
        
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Staff member not found'}), 404

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Staff deleted successfully'}), 200
    except Exception as e:
        logger.error(f"Error deleting staff: {str(e)}")
        return jsonify({'error': str(e)}), 500

@staff_bp.route('/api/staff/<int:staffId>', methods=['GET'])
def get_staff_profile(staffId):
    try:
        requesting_staff_id = request.headers.get('X-Staff-ID')
        if not requesting_staff_id:
            return jsonify({'error': 'Unauthorized'}), 401

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            'SELECT staffId, name, email, role, created_at FROM staff WHERE staffId = %s',
            (staffId,)
        )
        staff = cursor.fetchone()
        cursor.close()
        conn.close()

        if staff:
            if staff.get('created_at'):
                staff['created_at'] = staff['created_at'].isoformat()
            return jsonify(staff), 200
        return jsonify({'error': 'Staff member not found'}), 404
    except Exception as e:
        logger.error(f"Error fetching staff profile: {str(e)}")
        return jsonify({'error': str(e)}), 500

@staff_bp.route('/api/staff/stats', methods=['GET'])
def get_staff_stats():
    try:
        staff_id = request.headers.get('X-Staff-ID')
        if not staff_id:
            return jsonify({'error': 'Unauthorized'}), 401

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute('SELECT COUNT(*) as total_staff FROM staff')
        total_staff = cursor.fetchone()['total_staff']
        
        cursor.execute('SELECT COUNT(*) as admin_count FROM staff WHERE role = "admin"')
        admin_count = cursor.fetchone()['admin_count']
        
        cursor.execute('''
            SELECT COUNT(*) as recent_staff 
            FROM staff 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ''')
        recent_staff = cursor.fetchone()['recent_staff']
        
        cursor.close()
        conn.close()

        return jsonify({
            'total_staff': total_staff,
            'admin_count': admin_count,
            'staff_count': total_staff - admin_count,
            'recent_staff': recent_staff
        }), 200
    except Exception as e:
        logger.error(f"Error fetching staff stats: {str(e)}")
        return jsonify({'error': str(e)}), 500