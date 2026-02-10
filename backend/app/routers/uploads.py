from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlmodel import Session
import os
import uuid
from datetime import datetime
from pathlib import Path

from app.database import get_session
from app.models import Note, User
from app.schemas import MessageResponse
from app.auth_utils import get_current_active_user
from app.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/upload", tags=["File Uploads"])

# Allowed file extensions
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp"}


def get_upload_dir() -> Path:
    """Ensure upload directory exists and return path."""
    # Use Path for cross-platform compatibility
    app_dir = Path(__file__).parent.parent
    upload_path = app_dir / settings.UPLOAD_DIR
    upload_path.mkdir(parents=True, exist_ok=True)
    return upload_path


@router.post("", response_model=dict)
async def upload_file(
    file: UploadFile = File(...),
    note_id: int = Query(None, description="Optional note ID to attach file to"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """
    Upload a file (PDF or image) for a note.
    Returns the file URL that can be stored with the note.
    """
    # Validate filename exists
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided"
        )
    
    # Validate file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE // 1024 // 1024}MB"
        )
    
    # Generate unique filename
    unique_id = str(uuid.uuid4())[:8]
    timestamp = datetime.now().strftime("%Y%m%d")
    safe_filename = f"{timestamp}_{unique_id}{file_ext}"
    
    # Save file using Path for cross-platform compatibility
    upload_dir = get_upload_dir()
    file_path = upload_dir / safe_filename
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    file_url = f"/uploads/{safe_filename}"
    
    # If note_id provided, update the note
    if note_id:
        note = session.get(Note, note_id)
        if note and note.author_id == current_user.id:
            note.file_url = file_url
            session.add(note)
            session.commit()
    
    return {
        "message": "File uploaded successfully",
        "file_url": file_url,
        "filename": safe_filename
    }


@router.delete("/{filename}", response_model=MessageResponse)
async def delete_file(
    filename: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete an uploaded file (admin only)."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Sanitize filename to prevent path traversal
    safe_filename = os.path.basename(filename)
    
    upload_dir = get_upload_dir()
    file_path = upload_dir / safe_filename
    
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    file_path.unlink()
    
    return MessageResponse(message="File deleted successfully")
