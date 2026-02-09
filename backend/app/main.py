from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.database import create_db_and_tables
from app.config import get_settings
from app.routers import auth, subjects, notes, search, uploads, admin

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - runs on startup and shutdown."""
    # Startup
    create_db_and_tables()
    
    # Ensure upload directory exists
    upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    yield
    
    # Shutdown (cleanup if needed)
    pass


app = FastAPI(
    title=settings.APP_NAME,
    description="API for SL Notes - Exam preparation platform for O/L and A/L students in Sri Lanka",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(subjects.router)
app.include_router(notes.router)
app.include_router(search.router)
app.include_router(uploads.router)
app.include_router(admin.router)


@app.get("/", tags=["Health"])
def read_root():
    """Health check endpoint."""
    return {
        "message": "Welcome to SL Notes API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}