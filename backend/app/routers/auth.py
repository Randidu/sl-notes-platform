from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from datetime import timedelta

from app.database import get_session
from app.models import User
from app.schemas import UserCreate, UserResponse, Token, MessageResponse
from app.auth_utils import (
    hash_password, 
    verify_password, 
    create_access_token, 
    get_current_user,
    get_current_active_user
)
from app.config import get_settings
from app.email_utils import send_verification_email

settings = get_settings()
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, session: Session = Depends(get_session)):
    """Register a new user account."""
    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == user_data.email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # Send verification email (optional - can fail silently in dev)
    try:
        await send_verification_email(new_user.email, new_user.verification_token)
    except Exception as e:
        print(f"Email sending failed: {e}")
    
    return MessageResponse(
        message="User registered successfully! Please check your email to verify your account.",
        detail=f"Verification token: {new_user.verification_token}"  # Remove in production
    )


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    """Login and receive access token."""
    # Find user by email
    user = session.exec(
        select(User).where(User.email == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email}
    )
    
    return Token(access_token=access_token, token_type="bearer")


@router.get("/verify/{token}", response_model=MessageResponse)
async def verify_email(token: str, session: Session = Depends(get_session)):
    """Verify user email with token."""
    user = session.exec(
        select(User).where(User.verification_token == token)
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid verification link"
        )
    
    if user.is_verified:
        return MessageResponse(message="Account already verified!")
    
    user.is_verified = True
    user.verification_token = ""
    session.add(user)
    session.commit()
    
    return MessageResponse(message="Account verified successfully! You can now log in.")


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_me(
    full_name: str = None,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Update current user profile."""
    if full_name:
        current_user.full_name = full_name
        session.add(current_user)
        session.commit()
        session.refresh(current_user)
    
    return current_user
