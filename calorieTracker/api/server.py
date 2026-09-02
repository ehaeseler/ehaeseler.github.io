from fastapi import FastAPI
from dotenv import load_dotenv
import psycopg2
import os
from pwdlib import PasswordHash
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError
from datetime import date




load_dotenv()
password_hash = PasswordHash.recommended()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
ALLOWED_FIELDS = ["full_name", "username", "passw"]

DUMMY_HASH = password_hash.hash("dummypassword")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


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

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str 

class User(BaseModel):
    user_id: int
    username: str 
    full_name: str 

class UserInDB(User):
    hashed_password: str

class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=1)
    username: str = Field(min_length=4, max_length=10)
    password: str = Field(min_length=7, max_length=15)

class ChangeProfile(BaseModel):
    username: str | None = Field(default = None, min_length=4, max_length=10)
    full_name: str | None = Field(default = None, min_length=1)
    passw: str | None = Field(default = None, min_length=7, max_length=15)
    password_check: str | None = Field(default = None, min_length=1)

class FoodData(BaseModel):
    calories: int = Field(gt=0)

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(username: str):
    cur = get_conn().cursor()

    cur.execute('''SELECT user_id, username, full_name, passw FROM user_table WHERE username = %s''', (username, ))
    row = cur.fetchone()
    if (row is None):
        return None
    return UserInDB(user_id=row[0], username=row[1], full_name=row[2], hashed_password=row[3])

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        verify_password(password, DUMMY_HASH)
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
    ):
    return current_user

@app.post("/token")
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@app.get("/users/me")
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
    ) -> User:
    return current_user

@app.post("/register")
def register_user(register_data: RegisterRequest) -> Token:
    cur = get_conn().cursor()
    username = register_data.username
    password = password_hash.hash(register_data.password)
    full_name = register_data.full_name
    try:
        cur.execute('''INSERT INTO user_table(username, passw, full_name) VALUES(%s, %s, %s)''', (username, password, full_name))
        get_conn().commit()
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
        data={"sub": username}, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
    except:
        raise HTTPException(
            status_code=400,
            detail="Username already exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/calories")
def add_calories(current_user: Annotated[User, Depends(get_current_active_user)], food_data: FoodData):
    cur = get_conn().cursor()

    uid = current_user.user_id
    current_date = date.today()
    calories = food_data.calories
    try:
        cur.execute('''INSERT INTO daily_calories(user_id, date, calories) VALUES (%s, %s, %s)
                ON CONFLICT (user_id, date) DO UPDATE SET calories = daily_calories.calories + EXCLUDED.calories''', (uid, current_date, calories))
        get_conn().commit()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Incorrect DB entry",
        )
    
def check_field(field):
    if (field not in ALLOWED_FIELDS):
        raise HTTPException(
            status_code=400,
            detail="Incorrect field",
        )
    return True
    
@app.patch("/profile")
def change_profile(current_user: Annotated[User, Depends(get_current_active_user)], profile_update: ChangeProfile):
    cur = get_conn().cursor()
    uid = current_user.user_id
    profile_data = profile_update.model_dump(exclude_none = True)
    fields = list(profile_data)
    data = list(profile_data.values())
    newData = None
    nextData = None
    try:
        field = fields[0]
        check_field(field)
        newData = data[0]
        if (len(data) > 1): 
            nextData = data[1]
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=422,
            detail="Input cannot be null",
        )

    if (field == "passw"):
       if (nextData != newData):
            raise HTTPException(
                status_code=400,
                detail="Password and Password Check do not match"
            )
       newData = password_hash.hash(newData)
       
    

    try:
        cur.execute(f'''UPDATE user_table SET {field} = %s WHERE user_id = %s''', (newData, uid))
        get_conn().commit()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Incorrect DB entry",
        )
    
    if (field == "username"):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        new_token = create_access_token(data={"sub": newData}, expires_delta=access_token_expires)

    return {"success": True, "access_token": new_token if field == "username" else None}

@app.get("/graph")
def make_graph(current_user: Annotated[User, Depends(get_current_active_user)]):
    cur = get_conn().cursor()
    uid = current_user.user_id
    current_date = date.today()
    last_week = current_date - timedelta(days = 7)

    try:
        cur.execute('''SELECT calories, date FROM daily_calories WHERE user_id=%s AND date <= %s AND date >= %s ORDER BY date ASC''', (uid, current_date, last_week))
        get_conn().commit()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Could not fetch calories",
        )
 





# Make new jsx file for calorie graph using datetime strftime("%A, %m/%d")
    