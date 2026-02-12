import os
import resend
from typing import Optional

# Configure Resend API
resend.api_key = os.getenv("RESEND_API_KEY")

def send_verification_email(to_email: str, verification_token: str) -> bool:
    """Send verification email using Resend API."""
    try:
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        verification_link = f"{frontend_url}/verify-email?token={verification_token}"
        
        params = {
            "from": f"{os.getenv('MAIL_FROM_NAME', 'SL Note Site')} <{os.getenv('MAIL_FROM', 'onboarding@resend.dev')}>",
            "to": [to_email],
            "subject": "Verify Your Email - SL Note Site",
            "html": f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to SL Note Site! 🎓</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="background-color: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                            Thank you for signing up! We're excited to have you join our community of students preparing for O/L and A/L exams.
                        </p>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                            To get started, please verify your email address by clicking the button below:
                        </p>
                        
                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="{verification_link}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                                Verify Email Address
                            </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                            If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        <p style="color: #3b82f6; font-size: 14px; word-break: break-all; margin-top: 8px;">
                            {verification_link}
                        </p>
                        
                        <p style="color: #9ca3af; font-size: 13px; margin-top: 32px; line-height: 1.6;">
                            If you didn't create an account with SL Note Site, you can safely ignore this email.
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 24px; padding: 20px;">
                        <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                            © 2026 SL Note Site. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """
        }
        
        email = resend.Emails.send(params)
        print(f"Verification email sent successfully to {to_email}. Email ID: {email.get('id')}")
        return True
        
    except Exception as e:
        print(f"Error sending verification email: {str(e)}")
        return False


def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """Send password reset email using Resend API."""
    try:
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        reset_link = f"{frontend_url}/reset-password?token={reset_token}"
        
        params = {
            "from": f"{os.getenv('MAIL_FROM_NAME', 'SL Note Site')} <{os.getenv('MAIL_FROM', 'onboarding@resend.dev')}>",
            "to": [to_email],
            "subject": "Reset Your Password - SL Note Site",
            "html": f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Password Reset Request 🔐</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="background-color: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                            We received a request to reset your password for your SL Note Site account.
                        </p>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                            Click the button below to reset your password:
                        </p>
                        
                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="{reset_link}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);">
                                Reset Password
                            </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                            If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        <p style="color: #ef4444; font-size: 14px; word-break: break-all; margin-top: 8px;">
                            {reset_link}
                        </p>
                        
                        <p style="color: #dc2626; font-size: 14px; margin-top: 24px; padding: 16px; background-color: #fee2e2; border-radius: 8px; line-height: 1.6;">
                            ⚠️ This link will expire in 1 hour for security reasons.
                        </p>
                        
                        <p style="color: #9ca3af; font-size: 13px; margin-top: 32px; line-height: 1.6;">
                            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 24px; padding: 20px;">
                        <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                            © 2026 SL Note Site. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """
        }
        
        email = resend.Emails.send(params)
        print(f"Password reset email sent successfully to {to_email}. Email ID: {email.get('id')}")
        return True
        
    except Exception as e:
        print(f"Error sending password reset email: {str(e)}")
        return False