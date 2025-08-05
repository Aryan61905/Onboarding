from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import DictCursor
import hashlib
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)


DATABASE_URL = 'postgresql://onboarding_hnxw_user:CdXxrvb1gG6FMhRUCv0Sc2kZtKT1uw52@dpg-d297lqe3jp1c73felki0-a.oregon-postgres.render.com/onboarding_hnxw'

def get_db():
    conn = psycopg2.connect(
        DATABASE_URL,
        sslmode='require' 
    )
    return conn

def init_db():
    with get_db() as conn:
        with conn.cursor() as cursor:
            # Create users table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create user_profiles table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_profiles (
                    user_id INTEGER PRIMARY KEY REFERENCES users(id),
                    about_me TEXT,
                    street TEXT,
                    city TEXT,
                    state TEXT,
                    zip_code TEXT,
                    birth_date DATE
                )
            ''')
            conn.commit()

init_db()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/api/users')
def get_users():
    try:
        with get_db() as conn:
            with conn.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute('''
                    SELECT 
                        u.id, u.email, u.created_at,
                        p.about_me, p.street, p.city, p.state, p.zip_code, p.birth_date
                    FROM users u
                    LEFT JOIN user_profiles p ON u.id = p.user_id
                    ORDER BY u.created_at DESC
                ''')
                users = cursor.fetchall()
                return jsonify([dict(user) for user in users])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'success': False, 'error': 'Email and password are required'}), 400
    
    try:
        with get_db() as conn:
            with conn.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute(
                    'SELECT id, email FROM users WHERE email = %s AND password = %s', 
                    (email, hash_password(password)))
                user = cursor.fetchone()
                
                if not user:
                    return jsonify({'success': False, 'error': 'Invalid credentials'}), 400
                
                return jsonify({
                    'success': True,
                    'message': 'Login successful',
                    'user': {
                        'id': user['id'],
                        'email': user['email']
                    }
                }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    try:
        hashed_password = hash_password(password)
        with get_db() as conn:
            with conn.cursor() as cursor:
                # Check if email exists
                cursor.execute('SELECT id FROM users WHERE email = %s', (email,))
                if cursor.fetchone():
                    return jsonify({'error': 'Email already registered'}), 400
                
                # Insert new user
                cursor.execute(
                    'INSERT INTO users (email, password) VALUES (%s, %s) RETURNING id',
                    (email, hashed_password))
                user_id = cursor.fetchone()[0]
                conn.commit()
                
                return jsonify({
                    'message': 'Registration successful',
                    'user_id': user_id
                }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
       
@app.route('/api/save-profile', methods=['POST'])
def save_profile():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'success': False, 'error': 'User ID is required'}), 400
    
    try:
        with get_db() as conn:
            with conn.cursor() as cursor:
                # Format birth date if available
                birth_date = None
                if data.get('birth_year'):
                    birth_date = f"{data.get('birth_year')}-{data.get('birth_month')}-{data.get('birth_day')}"
                
                # Upsert profile data
                cursor.execute('''
                    INSERT INTO user_profiles 
                    (user_id, about_me, street, city, state, zip_code, birth_date)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (user_id) 
                    DO UPDATE SET
                        about_me = EXCLUDED.about_me,
                        street = EXCLUDED.street,
                        city = EXCLUDED.city,
                        state = EXCLUDED.state,
                        zip_code = EXCLUDED.zip_code,
                        birth_date = EXCLUDED.birth_date
                ''', (
                    user_id,
                    data.get('about_me'),
                    data.get('street'),
                    data.get('city'),
                    data.get('state'),
                    data.get('zip_code'),
                    birth_date
                ))
                conn.commit()
                return jsonify({'success': True, 'message': 'Profile saved successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)