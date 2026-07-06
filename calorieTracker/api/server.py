from fastapi import FastAPI
from dotenv import load_dotenv
import psycopg2
import os
import hashlib

load_dotenv()

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL")

conn = psycopg2.connect(DATABASE_URL)

@app.get("/")
def home():
    return {"message": "FastAPI server running"}

def get_conn():
    global conn
    try:
        conn.cursor().execute("SELECT 1")
    except:
        conn = psycopg2.connect(DATABASE_URL)
    return conn

@app.get("/login")
def check_login(username: str, password: str):
    cur = get_conn().cursor()

    passw = hashlib.sha512(password.encode()).hexdigest()

    cur.execute('''SELECT group_name FROM group_table WHERE username=%s AND pass=%s''', (username, passw))
    name = cur.fetchone()
    if name is None:
        return ({"success": False})

    cur.close()

    return ({"success": True})