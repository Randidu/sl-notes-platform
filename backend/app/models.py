from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class User(SQLModel, table=True):
    """User model for authentication."""
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_verified: bool = Field(default=False)
    is_admin: bool = Field(default=False)
    verification_token: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Subject(SQLModel, table=True):
    """Subject model for O/L and A/L subjects."""
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    exam_type: str  # "OL" or "AL"
    description: Optional[str] = None
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Note(SQLModel, table=True):
    """Note model for study materials."""
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    content: str
    subject_id: int = Field(foreign_key="subject.id")
    topic: Optional[str] = None
    author_id: int = Field(foreign_key="user.id")
    file_url: Optional[str] = None
    is_published: bool = Field(default=True)
    view_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)