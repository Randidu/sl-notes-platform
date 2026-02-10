from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ============ Auth Schemas ============

class UserCreate(BaseModel):
    """Schema for user registration."""
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user response (excludes password)."""
    id: int
    full_name: str
    email: str
    is_verified: bool
    is_admin: bool
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for decoded token data."""
    user_id: Optional[int] = None
    email: Optional[str] = None


# ============ Subject Schemas ============

class SubjectBase(BaseModel):
    """Base schema for subjects."""
    name: str = Field(..., min_length=1, max_length=100)
    exam_type: str = Field(..., pattern="^(OL|AL)$")  # Only "OL" or "AL"
    description: Optional[str] = Field(None, max_length=500)


class SubjectCreate(SubjectBase):
    """Schema for creating a subject."""
    pass


class SubjectUpdate(BaseModel):
    """Schema for updating a subject."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    exam_type: Optional[str] = Field(None, pattern="^(OL|AL)$")
    description: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None


class SubjectResponse(SubjectBase):
    """Schema for subject response."""
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Note Schemas ============

class NoteBase(BaseModel):
    """Base schema for notes."""
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    topic: Optional[str] = Field(None, max_length=100)


class NoteCreate(NoteBase):
    """Schema for creating a note."""
    subject_id: int
    file_url: Optional[str] = None
    is_published: bool = True


class NoteUpdate(BaseModel):
    """Schema for updating a note."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    topic: Optional[str] = Field(None, max_length=100)
    file_url: Optional[str] = None
    is_published: Optional[bool] = None


class NoteResponse(NoteBase):
    """Schema for note response."""
    id: int
    subject_id: int
    author_id: int
    file_url: Optional[str]
    is_published: bool
    view_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class NoteListResponse(BaseModel):
    """Schema for paginated note list."""
    notes: List[NoteResponse]
    total: int
    page: int
    per_page: int


# ============ Search Schemas ============

class SearchResponse(BaseModel):
    """Schema for search results."""
    notes: List[NoteResponse]
    total: int
    query: str


# ============ Message Schemas ============

class MessageResponse(BaseModel):
    """Schema for simple message responses."""
    message: str
    detail: Optional[str] = None
