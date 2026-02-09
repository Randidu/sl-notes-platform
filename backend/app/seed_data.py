"""
Database seeding script to populate sample data for development.
Run this script from the backend directory: python -m app.seed_data
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlmodel import Session, select, create_engine
from datetime import datetime

# Import models directly
from app.models import Subject, Note, User
from app.config import get_settings
from app.auth_utils import hash_password

settings = get_settings()

# Create engine
engine = create_engine(settings.DATABASE_URL, echo=False)

def seed_subjects(session: Session):
    """Seed sample subjects."""
    subjects_data = [
        # O/L Subjects
        {"name": "Mathematics", "exam_type": "OL", "description": "Ordinary level mathematics covering algebra, geometry, and arithmetic"},
        {"name": "Science", "exam_type": "OL", "description": "O/L Science covering physics, chemistry, and biology"},
        {"name": "English", "exam_type": "OL", "description": "O/L English Language and Literature"},
        {"name": "Sinhala", "exam_type": "OL", "description": "O/L Sinhala Language and Literature"},
        {"name": "History", "exam_type": "OL", "description": "O/L History of Sri Lanka and World History"},
        {"name": "Geography", "exam_type": "OL", "description": "O/L Geography - Physical and Human Geography"},
        # A/L Subjects
        {"name": "Combined Mathematics", "exam_type": "AL", "description": "A/L Combined Mathematics - Pure and Applied"},
        {"name": "Physics", "exam_type": "AL", "description": "A/L Physics covering mechanics, waves, electricity, and modern physics"},
        {"name": "Chemistry", "exam_type": "AL", "description": "A/L Chemistry covering organic, inorganic, and physical chemistry"},
        {"name": "Biology", "exam_type": "AL", "description": "A/L Biology covering cell biology, genetics, and ecology"},
        {"name": "Economics", "exam_type": "AL", "description": "A/L Economics - Micro and Macroeconomics"},
        {"name": "Accounting", "exam_type": "AL", "description": "A/L Accounting and Financial Management"},
    ]
    
    count = 0
    for data in subjects_data:
        existing = session.exec(select(Subject).where(Subject.name == data["name"])).first()
        if not existing:
            subject = Subject(**data, is_active=True)
            session.add(subject)
            count += 1
            print(f"  + {data['name']}")
    
    session.commit()
    print(f"✓ Created {count} subjects")
    return count

def seed_demo_user(session: Session) -> User:
    """Create a demo user for sample notes."""
    existing = session.exec(select(User).where(User.email == "demo@slnotes.lk")).first()
    if existing:
        print("✓ Demo user already exists")
        return existing
    
    user = User(
        email="demo@slnotes.lk",
        full_name="Demo User",
        password_hash=hash_password("demo123"),
        is_verified=True,
        is_admin=False
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    print("✓ Created demo user: demo@slnotes.lk / demo123")
    return user

def seed_notes(session: Session, user: User):
    """Seed sample notes."""
    subjects = session.exec(select(Subject)).all()
    if not subjects:
        print("✗ No subjects found, cannot seed notes")
        return 0
    
    subject_map = {s.name: s for s in subjects}
    
    notes_data = [
        {"title": "Quadratic Equations - Complete Guide", "content": "A quadratic equation is a polynomial equation of degree 2.\n\nStandard Form: ax² + bx + c = 0\n\nQuadratic Formula: x = (-b ± √(b² - 4ac)) / 2a", "subject": "Mathematics", "topic": "Algebra"},
        {"title": "Newton's Laws of Motion", "content": "First Law: An object at rest stays at rest unless acted upon by an external force.\n\nSecond Law: F = ma\n\nThird Law: For every action there is an equal and opposite reaction.", "subject": "Science", "topic": "Physics"},
        {"title": "Essay Writing Tips", "content": "Essay Structure:\n1. Introduction - Hook, background, thesis\n2. Body Paragraphs - Topic sentence, evidence, analysis\n3. Conclusion - Restate thesis, summarize", "subject": "English", "topic": "Writing"},
        {"title": "Differentiation Rules", "content": "Power Rule: d/dx(xⁿ) = nxⁿ⁻¹\nProduct Rule: d/dx(fg) = f'g + fg'\nChain Rule: d/dx(f(g(x))) = f'(g(x)) · g'(x)", "subject": "Combined Mathematics", "topic": "Calculus"},
        {"title": "Kinematics Equations", "content": "v = u + at\ns = ut + ½at²\nv² = u² + 2as\n\nWhere: s=displacement, u=initial velocity, v=final velocity, a=acceleration, t=time", "subject": "Physics", "topic": "Mechanics"},
        {"title": "Organic Chemistry Basics", "content": "Alkanes: CₙH₂ₙ₊₂ (saturated)\nAlkenes: CₙH₂ₙ (unsaturated, C=C)\nAlcohols: Contains -OH group\nCarboxylic Acids: Contains -COOH group", "subject": "Chemistry", "topic": "Organic"},
    ]
    
    count = 0
    for data in notes_data:
        subject = subject_map.get(data["subject"])
        if not subject:
            continue
            
        existing = session.exec(select(Note).where(Note.title == data["title"])).first()
        if not existing:
            note = Note(
                title=data["title"],
                content=data["content"],
                subject_id=subject.id,
                author_id=user.id,
                topic=data["topic"],
                is_published=True,
                view_count=0
            )
            session.add(note)
            count += 1
            print(f"  + {data['title'][:35]}...")
    
    session.commit()
    print(f"✓ Created {count} notes")
    return count

def main():
    print("\n🌱 Seeding database...\n")
    
    try:
        with Session(engine) as session:
            seed_subjects(session)
            user = seed_demo_user(session)
            seed_notes(session, user)
        
        print("\n✅ Database seeding complete!")
        print("\nDemo credentials: demo@slnotes.lk / demo123\n")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
