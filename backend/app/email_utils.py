"""
Email utilities for sending verification emails.
Uses a simple stub implementation that logs emails instead of sending them.
Configure with real SMTP settings in production.
"""
import logging

logger = logging.getLogger(__name__)


async def send_verification_email(email: str, token: str):
    """
    Send verification email to user.
    Currently logs the email/token for development.
    Configure with real SMTP in production.
    """
    verification_url = f"http://127.0.0.1:8000/auth/verify/{token}"
    
    # In development, just log the verification URL
    logger.info(f"Verification email for {email}")
    logger.info(f"Verification URL: {verification_url}")
    
    # Print for easy access during development
    print(f"\n{'='*50}")
    print(f"VERIFICATION EMAIL SENT TO: {email}")
    print(f"VERIFICATION URL: {verification_url}")
    print(f"{'='*50}\n")
    
    # TODO: In production, integrate with real email service
    # Options: SendGrid, AWS SES, or fix fastapi-mail
    return True