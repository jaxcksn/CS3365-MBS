from functools import wraps
from flask import Flask, Response, json, jsonify, request
from flask_cors import CORS
import time
import os
from dotenv import load_dotenv
import records
import bcrypt
import jwt
import datetime
import uuid

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv("FRONTEND_URL", "https://mbs.jaxcksn.dev")}})

# Don't Touch Me - Could Mess Up DB Connection
max_retries = 5
retry_count = 0
db = None

db_config = {
    'host': os.getenv("DATABASE_HOST", "localhost"),
    'user': os.getenv("DATABASE_USER", ""),
    'password': os.getenv("DATABASE_PASSWORD", ""),
    'database': "mbs"
}

while retry_count < max_retries:
    try:
        db = records.Database(f'mysql+pymysql://{db_config["user"]}:{db_config["password"]}@{db_config["host"]}:3306/{db_config["database"]}')
        print("Successfully connected to the database.")
        break
    except Exception as err:
        retry_count += 1
        wait_time = 2 ** retry_count
        print(f"Database connection failed: {err}. Retrying in {wait_time} seconds...")
        time.sleep(wait_time)
else:
    raise Exception("Could not connect to the database after multiple attempts.")


# Actual Application Code

@app.route('/')
def home():
    rows = db.query("SELECT * FROM `App`")
    result = rows.first(as_dict=True)
    return jsonify(result)

# SECTION : User Authentication & Management
def generate_access_token(user_id):
    expires =  time.time() + datetime.timedelta(hours=2).total_seconds()
    payload = {
        'user_id': user_id,
        'exp': expires
    }
    return (jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm='HS256'), expires)

def generate_refresh_token(user_id):
    expires =  time.time() + datetime.timedelta(days=7).total_seconds()
    payload = {
        'user_id': user_id,
        'exp': expires
    }

    try:
        token = jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm='HS256')
        expiretime = datetime.datetime.fromtimestamp(expires).strftime('%Y-%m-%d %H:%M:%S')
        with db.transaction() as tx:
            tx.query("INSERT INTO `Refresh` (`user`, `token`, `expires`) VALUES (:user, :token, :expires)", user=user_id, token=token, expires=expiretime)
        return (token, expires)
    except Exception as err:
        print(err)
        raise Exception("Could not insert refresh token into the database")
    
def revoke_token(refresh_token):
    try:
       with db.transaction() as tx:
           tx.query("DELETE FROM `Refresh` WHERE `token`=:token", token=refresh_token)
    except Exception as err:
        print(err)
        raise Exception("Could not revoke refresh token")

def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Missing Authorization header'}), 401
        token = token.removeprefix('Bearer ')
        try:
            payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=['HS256'])
            user_id = payload.get('user_id')
            return f(user_id, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 403
        
    return wrap

@app.route('/user/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('email')
    password = data.get('password')
    address = data.get('address')
    phone = data.get('phone_number')
    state = data.get('state')
    zip = data.get('zip')

    if not username or not password or not address or not phone or not state or not zip:
        return jsonify({'error': 'Missing required fields'}), 400
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    try:
        with db.transaction() as tx:
            tx.query("INSERT INTO `User` (`id`, `email`, `password`, `address`, `phone`, `state`, `zipcode`, `role`) VALUES (:id, :email, :password, :address, :phone, :state, :zip, :role)", id=uuid.uuid4() ,email=username, password=hashed_password, address=address, phone=phone, state=state, zip=zip, role="user")
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as err:
        print(err)
        return jsonify({'error': 'User already exists'}), 400

@app.route('/user/login', methods=['POST'])
def login_user():
    data = json.loads(request.data)
    username = data.get('username')
    password = data.get('password')

    query = db.query("SELECT id, password FROM `User` WHERE email=:username",  username=username)
    result = query.first(as_dict=True)
    if not result:
        return jsonify({'error': 'User not found'}), 404
    else:
        if bcrypt.checkpw(password.encode('utf-8'), result['password'].encode('utf-8')):
            try:
                access = generate_access_token(result['id'])
                refresh = generate_refresh_token(result['id'])
            except Exception as err:
                print(err)
                return jsonify({'error': 'Could not generate tokens'}), 500
            response = jsonify({'access_token': access[0], 
                            'expires': datetime.datetime.fromtimestamp(access[1]).isoformat()})
            response.set_cookie('refresh_token', refresh[0], expires=refresh[1], httponly=True, secure=True, max_age=7*24*60*60)
            response.status_code = 200
            return response
        else:
            return jsonify({'error': 'Invalid password'}), 401

@app.route('/user/refresh', methods=['POST'])
def refresh_user():
    refresh_token = request.cookies.get('refresh_token')
    if not refresh_token:
        return jsonify({'error': 'Missing refresh token'}), 400
    
    try:
        query = db.query("SELECT `user`, `expires`, `revoked` FROM `Refresh` WHERE token=:token", token=refresh_token)
        result = query.first(as_dict=True)
        if not result:
            return jsonify({'error': 'Invalid refresh token'}), 401
        if result['revoked']:
            return jsonify({'error': 'Refresh token has been revoked'}), 403
        if datetime.datetime.now() > result['expires']:
            return jsonify({'error': 'Refresh token has expired'}), 401
        
        revoke_token(refresh_token)
        access = generate_access_token(result['user'])
        refresh = generate_refresh_token(result['user'])
        
        response = jsonify({'access_token': access[0], 'expires': access[1]})
        response.set_cookie('refresh_token', refresh[0], expires=refresh[1], httponly=True, secure=True, max_age=7*24*60*60)
        response.status_code = 200
        return response
    except Exception as err: 
        print(err)
        return jsonify({'error': 'Could not validate refresh token'}), 500
    
@app.route('/user/logout', methods=['POST'])
@login_required
def logout_user(user_id):
    if not user_id:
        return jsonify({'error': 'Could not find user'}), 500
    
    data = request.get_json()
    refresh_token = data.get('refresh')

    try:
        if not refresh_token:
            with db.transaction() as tx:
                tx.query("DELETE FROM `Refresh` WHERE `user`=:user", user=user_id)
            response = Response(status=200)
            response.delete_cookie('refresh_token')
            return response
        else:
            revoke_token(refresh_token)
            response = Response(status=200)
            response.delete_cookie('refresh_token')
            return response
    except Exception as err:
        print(err)
        return jsonify({'error': 'Could not log the user out.'}), 500

@app.route('/user/me', methods=['GET'])
@login_required
def protected(user_id):
    return Response('You are successfully logged in', status=200)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5050)))