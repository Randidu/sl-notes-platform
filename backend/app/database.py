from sqlmodel import create_engine, SQLModel, Session
from app.config import get_settings

settings = get_settings()

# Handle database connection args (SQLite needs check_same_thread=False)
connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

engine = create_engine(
    settings.DATABASE_URL, 
    echo=settings.DEBUG,
    connect_args=connect_args
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session