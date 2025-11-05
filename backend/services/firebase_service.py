"""
Firebase Admin SDK service for authentication and user management
"""
import firebase_admin
from firebase_admin import credentials, auth
from config import settings
import os


class FirebaseService:
    """Firebase Admin SDK wrapper"""
    
    def __init__(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Check if already initialized
            firebase_admin.get_app()
        except ValueError:
            # Initialize Firebase Admin SDK
            if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred)
            else:
                print(f"Warning: Firebase credentials file not found at {settings.FIREBASE_CREDENTIALS_PATH}")
    
    def verify_token(self, token: str):
        """
        Verify Firebase ID token
        
        Args:
            token: Firebase ID token from client
            
        Returns:
            Decoded token with user info
        """
        try:
            decoded_token = auth.verify_id_token(token)
            return decoded_token
        except Exception as e:
            raise ValueError(f"Invalid token: {str(e)}")
    
    def create_user(self, email: str, password: str, display_name: str = None):
        """
        Create a new Firebase user
        
        Args:
            email: User email
            password: User password
            display_name: Optional display name
            
        Returns:
            User record
        """
        try:
            user = auth.create_user(
                email=email,
                password=password,
                display_name=display_name
            )
            return user
        except Exception as e:
            raise ValueError(f"Failed to create user: {str(e)}")
    
    def get_user_by_email(self, email: str):
        """
        Get user by email address
        
        Args:
            email: User email
            
        Returns:
            User record or None
        """
        try:
            user = auth.get_user_by_email(email)
            return user
        except auth.UserNotFoundError:
            return None
        except Exception as e:
            raise ValueError(f"Failed to get user: {str(e)}")
    
    def get_user_by_uid(self, uid: str):
        """
        Get user by Firebase UID
        
        Args:
            uid: Firebase user ID
            
        Returns:
            User record or None
        """
        try:
            user = auth.get_user(uid)
            return user
        except auth.UserNotFoundError:
            return None
        except Exception as e:
            raise ValueError(f"Failed to get user: {str(e)}")
    
    def delete_user(self, uid: str):
        """
        Delete a Firebase user
        
        Args:
            uid: Firebase user ID
        """
        try:
            auth.delete_user(uid)
        except Exception as e:
            raise ValueError(f"Failed to delete user: {str(e)}")


# Singleton instance
firebase_service = FirebaseService()
