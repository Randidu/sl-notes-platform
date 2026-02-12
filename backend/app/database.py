from sqlmodel import create_engine, SQLModel, Session
from sqlalchemy.pool import QueuePool
from app.config import get_settings

settings = get_settings()

# Create engine with PostgreSQL-optimized settings
connect_args = {}
engine_kwargs = {
    "echo": settings.DEBUG,
}

# Add connection pooling for PostgreSQL
if settings.DATABASE_URL.startswith("postgresql"):
    engine_kwargs.update({
        "poolclass": QueuePool,
        "pool_size": 5,
        "max_overflow": 10,
        "pool_pre_ping": True,  # Verify connections before using
        "pool_recycle": 3600,   # Recycle connections after 1 hour
    })
else:
    # SQLite-specific settings for local development
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    **engine_kwargs
)

def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Get database session."""
    with Session(engine) as session:
        yield session