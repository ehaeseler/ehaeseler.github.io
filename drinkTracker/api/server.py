from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL")

conn = psycopg2.connect(DATABASE_URL)

@app.route("/")
def home():
    return "Flask server running"

@app.route("/addDrink", methods=["POST"])
def add_drink_type():

    data = request.json

    name = data["name"]
    amount = data["amount"]

    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO drink_entries
        (user_id, drink_name, drink_amount)
        VALUES (%s, %s, %s)
        """,
        (name, amount)
    )

    conn.commit()
    cur.close()

    return jsonify({
        "success": True
    })


if __name__ == "__main__":
    app.run(debug=True)