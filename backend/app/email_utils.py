from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr

# Configuration using Pydantic v2 styles
conf = ConnectionConfig(
    MAIL_USERNAME = "your-gmail@gmail.com",
    MAIL_PASSWORD = "your-app-password", 
    MAIL_FROM = "your-gmail@gmail.com",
    MAIL_PORT = 465,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = False,
    MAIL_SSL_TLS = True,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

async def send_verification_email(email: str, token: str):
    verification_url = f"http://127.0.0.1:8000/verify/{token}"
    
    html = f"""
    <h3>Welcome to SL Notes!</h3>
    <p>Success! Your account is almost ready. Click the link below to verify:</p>
    <a href="{verification_url}">{verification_url}</a>
    """

    message = MessageSchema(
        subject="Verify your SL Notes Account",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)