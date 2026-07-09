from fastapi import FastAPI
from dotenv import load_dotenv
import psycopg2
import os
import hashlib

from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your Vite dev server origin
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    cur.execute('''SELECT user_id FROM user_table WHERE username=%s AND passw=%s''', (username, passw))
    id = cur.fetchone()
    cur.close()
    if id is None:
        return ({"success": False})


    return ({"success": True, "id": id[0]})

if __name__ == "__main__":
    app.run(debug=True)