"""
Script to create an admin user.
Run: python -m app.create_admin
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlmodel import Session, select, create_engine
from app.models import User
from app.config import get_settings
from app.auth_utils import hash_password

settings = get_settings()
engine = create_engine(settings.DATABASE_URL, echo=False)

def create_admin():
    email = "admin@slnotes.lk"
    password = "admin123"
    full_name = "Admin User"
    
    with Session(engine) as session:
        # Check if admin exists
        existing = session.exec(select(User).where(User.email == email)).first()
        if existing:
            if not existing.is_admin:
                existing.is_admin = True
                existing.is_verified = True
                session.add(existing)
                session.commit()
                print(f"✓ Updated {email} to admin")
            else:
                print(f"✓ Admin user {email} already exists")
            return
        
        # Create new admin
        admin = User(
            email=email,
            full_name=full_name,
            password_hash=hash_password(password),
            is_verified=True,
            is_admin=True
        )
        session.add(admin)
        session.commit()
        print(f"✓ Created admin user: {email} / {password}")

if __name__ == "__main__":
    print("\n🔐 Creating admin user...\n")
    create_admin()
    print("\n✅ Done!\n")
