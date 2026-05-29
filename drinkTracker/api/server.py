from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
import os
import hashlib


load_dotenv()

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL")

conn = psycopg2.connect(DATABASE_URL)

@app.route("/")
def home():
    return "Flask server running"

@app.route("/add_drink_type", methods=["POST"])
def add_drink_type():

    data = request.json

    name = data["name"]
    amount = data["amount"]

    cur = conn.cursor()

    cur.execute(
        '''INSERT INTO drink_entries (drink_name, drink_amount)
        VALUES (%s, %s)''',(name, amount)
    )
    cur.close()

    return jsonify({"success": True})

@app.route("/get_groups", methods=["GET"])
def get_groups():

    cur = conn.cursor()

    cur.execute(
        '''SELECT group_name FROM group_table'''
    )
    groups = cur.fetchall()
    conn.commit()
    cur.close()

    return jsonify(groups)

@app.route("/add_group", methods=["POST"])
def add_group():

    data = request.json

    name = data["name"]
    password = data["password"]

    cur = conn.cursor()

    passw = hashlib.sha512(password.encode()).hexdigest()

    cur.execute(
        ''' INSERT INTO group_table (group_name, group_password)
        VALUES (%s, %s) ''',(name, passw)
    )

    conn.commit()
    cur.close()

    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(debug=True)