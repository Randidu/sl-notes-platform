from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select, or_, and_
from typing import List, Optional

from app.database import get_session
from app.models import Note, Subject
from app.schemas import NoteResponse, SearchResponse

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("", response_model=SearchResponse)
async def search_notes(
    q: str = Query(..., min_length=2, description="Search query"),
    exam_type: Optional[str] = Query(None, pattern="^(OL|AL)$"),
    subject_id: Optional[int] = None,
    limit: int = Query(50, ge=1, le=100),
    session: Session = Depends(get_session)
):
    """
    Search notes by title, content, or topic.
    Returns notes matching the query string.
    """
    # Build search conditions - handle None topic gracefully
    search_conditions = or_(
        Note.title.ilike(f"%{q}%"),
        Note.content.ilike(f"%{q}%"),
        and_(Note.topic.isnot(None), Note.topic.ilike(f"%{q}%"))
    )
    
    # Base query with search conditions
    query = select(Note).where(
        Note.is_published == True,
        search_conditions
    )
    
    # Filter by subject if provided
    if subject_id:
        query = query.where(Note.subject_id == subject_id)
    
    # Filter by exam type if provided
    if exam_type:
        subject_ids = session.exec(
            select(Subject.id).where(Subject.exam_type == exam_type)
        ).all()
        if subject_ids:
            query = query.where(Note.subject_id.in_(subject_ids))
    
    # Execute query with limit
    query = query.limit(limit).order_by(Note.view_count.desc())
    notes = session.exec(query).all()
    
    return SearchResponse(
        notes=notes,
        total=len(notes),
        query=q
    )


@router.get("/subjects", response_model=List[dict])
async def search_subjects(
    q: str = Query(..., min_length=1, description="Search query"),
    session: Session = Depends(get_session)
):
    """Search subjects by name."""
    subjects = session.exec(
        select(Subject)
        .where(
            Subject.is_active == True,
            Subject.name.ilike(f"%{q}%")
        )
        .limit(20)
    ).all()
    
    return [
        {
            "id": s.id,
            "name": s.name,
            "exam_type": s.exam_type,
            "description": s.description
        }
        for s in subjects
    ]
