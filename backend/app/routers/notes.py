from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from app.database import get_session
from app.models import Note, Subject, User
from app.schemas import NoteCreate, NoteUpdate, NoteResponse, NoteListResponse, MessageResponse
from app.auth_utils import get_current_active_user, get_current_user

router = APIRouter(prefix="/notes", tags=["Notes"])


# IMPORTANT: Static routes MUST be defined BEFORE dynamic routes
# Otherwise "/user/me" would be matched by "/{note_id}" with note_id="user"

@router.get("/user/me", response_model=List[NoteResponse])
async def get_my_notes(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get all notes created by the current user."""
    notes = session.exec(
        select(Note)
        .where(Note.author_id == current_user.id)
        .order_by(Note.created_at.desc())
    ).all()
    
    return notes


@router.get("", response_model=NoteListResponse)
async def list_notes(
    subject_id: Optional[int] = None,
    exam_type: Optional[str] = Query(None, pattern="^(OL|AL)$"),
    topic: Optional[str] = None,
    published_only: bool = Query(True),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session)
):
    """List notes with optional filtering and pagination."""
    query = select(Note)
    
    if subject_id:
        query = query.where(Note.subject_id == subject_id)
    
    if exam_type:
        # Join with Subject to filter by exam type
        subject_ids = session.exec(
            select(Subject.id).where(Subject.exam_type == exam_type)
        ).all()
        if subject_ids:
            query = query.where(Note.subject_id.in_(subject_ids))
    
    if topic:
        query = query.where(Note.topic.ilike(f"%{topic}%"))
    
    if published_only:
        query = query.where(Note.is_published == True)
    
    # Count total
    total = len(session.exec(query).all())
    
    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page).order_by(Note.created_at.desc())
    notes = session.exec(query).all()
    
    return NoteListResponse(
        notes=notes,
        total=total,
        page=page,
        per_page=per_page
    )


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(note_id: int, session: Session = Depends(get_session)):
    """Get a single note and increment view count."""
    note = session.get(Note, note_id)
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Increment view count
    note.view_count += 1
    session.add(note)
    session.commit()
    session.refresh(note)
    
    return note


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    note_data: NoteCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new note (authenticated users only)."""
    # Verify subject exists
    subject = session.get(Subject, note_data.subject_id)
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    
    new_note = Note(
        **note_data.model_dump(),
        author_id=current_user.id
    )
    
    session.add(new_note)
    session.commit()
    session.refresh(new_note)
    
    return new_note


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int,
    note_data: NoteUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Update a note (author or admin only)."""
    note = session.get(Note, note_id)
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Check ownership
    if note.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own notes"
        )
    
    update_data = note_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(note, key, value)
    
    note.updated_at = datetime.utcnow()
    session.add(note)
    session.commit()
    session.refresh(note)
    
    return note


@router.delete("/{note_id}", response_model=MessageResponse)
async def delete_note(
    note_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a note (author or admin only)."""
    note = session.get(Note, note_id)
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Check ownership
    if note.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own notes"
        )
    
    session.delete(note)
    session.commit()
    
    return MessageResponse(message="Note deleted successfully")
