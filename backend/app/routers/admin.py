"""
Admin management router for admin-only operations.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_session
from app.models import User, Note, Subject
from app.schemas import MessageResponse
from app.auth_utils import get_admin_user

router = APIRouter(prefix="/admin", tags=["Admin"])


# Schemas
class AdminStats(BaseModel):
    total_users: int
    total_notes: int
    total_subjects: int
    verified_users: int
    published_notes: int
    total_views: int


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    is_verified: bool
    is_admin: bool
    created_at: str

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    is_verified: Optional[bool] = None
    is_admin: Optional[bool] = None


# Admin dashboard stats
@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(
    session: Session = Depends(get_session),
    admin: User = Depends(get_admin_user)
):
    """Get admin dashboard statistics."""
    total_users = session.exec(select(func.count(User.id))).one()
    total_notes = session.exec(select(func.count(Note.id))).one()
    total_subjects = session.exec(select(func.count(Subject.id))).one()
    verified_users = session.exec(
        select(func.count(User.id)).where(User.is_verified == True)
    ).one()
    published_notes = session.exec(
        select(func.count(Note.id)).where(Note.is_published == True)
    ).one()
    total_views = session.exec(select(func.sum(Note.view_count))).one() or 0

    return AdminStats(
        total_users=total_users,
        total_notes=total_notes,
        total_subjects=total_subjects,
        verified_users=verified_users,
        published_notes=published_notes,
        total_views=total_views
    )


# User management
@router.get("/users", response_model=List[UserResponse])
async def list_users(
    session: Session = Depends(get_session),
    admin: User = Depends(get_admin_user)
):
    """List all users (admin only)."""
    users = session.exec(select(User).order_by(User.created_at.desc())).all()
    return [
        UserResponse(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            is_verified=u.is_verified,
            is_admin=u.is_admin,
            created_at=u.created_at.isoformat() if u.created_at else ""
        )
        for u in users
    ]


@router.put("/users/{user_id}", response_model=MessageResponse)
async def update_user(
    user_id: int,
    data: UserUpdate,
    session: Session = Depends(get_session),
    admin: User = Depends(get_admin_user)
):
    """Update user status (admin only)."""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.is_verified is not None:
        user.is_verified = data.is_verified
    if data.is_admin is not None:
        user.is_admin = data.is_admin

    session.add(user)
    session.commit()
    return MessageResponse(message="User updated successfully")


@router.delete("/users/{user_id}", response_model=MessageResponse)
async def delete_user(
    user_id: int,
    session: Session = Depends(get_session),
    admin: User = Depends(get_admin_user)
):
    """Delete a user (admin only)."""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    session.delete(user)
    session.commit()
    return MessageResponse(message="User deleted successfully")


# Notes management (for admin)
@router.get("/notes")
async def list_all_notes(
    session: Session = Depends(get_session),
    admin: User = Depends(get_admin_user)
):
    """List all notes including unpublished (admin only)."""
    notes = session.exec(
        select(Note).order_by(Note.created_at.desc())
    ).all()
    return notes


@router.put("/notes/{note_id}/publish", response_model=MessageResponse)
async def toggle_publish_note(
    note_id: int,
    session: Session = Depends(get_session),
    admin: User = Depends(get_admin_user)
):
    """Toggle note publish status (admin only)."""
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    note.is_published = not note.is_published
    session.add(note)
    session.commit()
    return MessageResponse(
        message=f"Note {'published' if note.is_published else 'unpublished'}"
    )
