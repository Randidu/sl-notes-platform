from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from backend.app.database import create_db_and_tables, get_session
from backend.app.models import User
from backend.app.auth_utils import hash_password

app = FastAPI(title="SL Notes API")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Welcome to SL Notes API"}

# Add this below your root route in main.py
@app.post("/register")
def register_user(user_data: User, session: Session = Depends(get_session)):
    # 1. Check if user exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash and Save
    # Architect's Note: user_data.hashed_password here is the PLAIN text from the user
    user_data.hashed_password = hash_password(user_data.hashed_password)
    
    session.add(user_data)
    session.commit()
    session.refresh(user_data)
    return {"message": "User created successfully", "user_id": user_data.id}

@app.get("/verify/{token}")
def verify_account(token: str, session: Session = Depends(get_session)):
    # Find the user with this secret token
    statement = select(User).where(User.verification_token == token)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Invalid verification link")
    
    # Unlock the account
    user.is_verified = True
    user.verification_token = "" # Clear it so it can't be used again
    session.add(user)
    session.commit()
    
    return {"message": "Account verified! You can now log in."}