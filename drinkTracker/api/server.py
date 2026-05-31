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
        '''SELECT group_id, group_name FROM group_table''' 
    )
    groups_json = cur.fetchall()
    groups = []
    for row in groups_json:
        groups.append({"id":row[0], "name":row[1]})
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
        '''INSERT INTO group_table (group_name, group_password)
        VALUES (%s, %s)''',(name, passw)
    )

    conn.commit()
    cur.close()

    return jsonify({"success": True})

@app.route("/check_pass", methods=["GET"])
def check_pass():
    group_id = request.args.get("group_id")
    group_pass = request.args.get("group_pass")

    cur = conn.cursor()

    passw = hashlib.sha512(group_pass.encode()).hexdigest()

    cur.execute(
        '''SELECT group_name FROM group_table WHERE group_id=%s AND group_password=%s''', (group_id, passw)
    )
    name = cur.fetchone()
    if name is None:
        return jsonify({"success": False})

    cur.close()

    return jsonify({"success": True})


@app.route("/get_group_members", methods=["GET"])
def get_group_members(groupID):
    cur = conn.cursor()
    cur.execute('''SELECT user_id FROM group_users WHERE group_id=%s''', (groupID))
    ids = cur.fetchall()
    members = []
    for id in ids:
        cur.execute('''SELECT user_name, user_id FROM user_table WHERE user_id=%s''', (id))
        row = cur.fetchall()
        members.append({"id":row[0], "name":row[1]})
    cur.close()
    return jsonify(members)


if __name__ == "__main__":
    app.run(debug=True)