from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List, Optional

from app.database import get_session
from app.models import Subject
from app.schemas import SubjectCreate, SubjectUpdate, SubjectResponse, MessageResponse
from app.auth_utils import get_admin_user

router = APIRouter(prefix="/subjects", tags=["Subjects"])


@router.get("", response_model=List[SubjectResponse])
async def list_subjects(
    exam_type: Optional[str] = Query(None, pattern="^(OL|AL)$"),
    active_only: bool = Query(True),
    session: Session = Depends(get_session)
):
    """List all subjects, optionally filtered by exam type."""
    query = select(Subject)
    
    if exam_type:
        query = query.where(Subject.exam_type == exam_type)
    
    if active_only:
        query = query.where(Subject.is_active == True)
    
    query = query.order_by(Subject.name)
    subjects = session.exec(query).all()
    
    return subjects


@router.get("/{subject_id}", response_model=SubjectResponse)
async def get_subject(subject_id: int, session: Session = Depends(get_session)):
    """Get a single subject by ID."""
    subject = session.get(Subject, subject_id)
    
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    
    return subject


@router.post("", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def create_subject(
    subject_data: SubjectCreate,
    session: Session = Depends(get_session),
    admin_user = Depends(get_admin_user)
):
    """Create a new subject (admin only)."""
    # Check for duplicate name in same exam type
    existing = session.exec(
        select(Subject).where(
            Subject.name == subject_data.name,
            Subject.exam_type == subject_data.exam_type
        )
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Subject '{subject_data.name}' already exists for {subject_data.exam_type}"
        )
    
    new_subject = Subject(**subject_data.model_dump())
    session.add(new_subject)
    session.commit()
    session.refresh(new_subject)
    
    return new_subject


@router.put("/{subject_id}", response_model=SubjectResponse)
async def update_subject(
    subject_id: int,
    subject_data: SubjectUpdate,
    session: Session = Depends(get_session),
    admin_user = Depends(get_admin_user)
):
    """Update a subject (admin only)."""
    subject = session.get(Subject, subject_id)
    
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    
    update_data = subject_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(subject, key, value)
    
    session.add(subject)
    session.commit()
    session.refresh(subject)
    
    return subject


@router.delete("/{subject_id}", response_model=MessageResponse)
async def delete_subject(
    subject_id: int,
    session: Session = Depends(get_session),
    admin_user = Depends(get_admin_user)
):
    """Delete a subject (admin only)."""
    subject = session.get(Subject, subject_id)
    
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    
    session.delete(subject)
    session.commit()
    
    return MessageResponse(message=f"Subject '{subject.name}' deleted successfully")
