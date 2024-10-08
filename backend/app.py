from flask import Flask, Response
from flask_cors import CORS
import time
import os
from dotenv import load_dotenv
import records
import json 


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
    rows = db.query("SELECT * FROM appInfo")
    result = rows.first(as_dict=True)
    return Response(json.dumps(result), mimetype='application/json')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5050)))