from flask import Flask
import mysql.connector
import time
import os

app = Flask(__name__)


# Maximum number of retries to connect to the database
max_retries = 5
retry_count = 0
db = None

db_config = {
    'host': os.getenv("DATABASE_HOST", "db"),
    'user': os.getenv("DATABASE_USER", "user"),
    'password': os.getenv("DATABASE_PASSWORD", "CS3365_Team12"),
    'database': "mbs"
}

while retry_count < max_retries:
    try:
        db = mysql.connector.connect(**db_config)
        print("Successfully connected to the database.")
        break
    except mysql.connector.Error as err:
        retry_count += 1
        wait_time = 2 ** retry_count
        print(f"Database connection failed: {err}. Retrying in {wait_time} seconds...")
        time.sleep(wait_time)
else:
    raise Exception("Could not connect to the database after multiple attempts.")

cursor = db.cursor(dictionary=True)
cursor.execute

@app.route('/')
def home():
    cursor.execute("SELECT * FROM appInfo")
    result = cursor.fetchone()
    return f"Version: {result['app_version']} | App Name: {result['app_name']}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5050)), debug=True)