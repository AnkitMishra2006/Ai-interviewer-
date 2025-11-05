"""
Authentication routes - User registration, login, and verification
"""
from fastapi import APIRouter, HTTPException, Depends, status
from models.user import UserCreate, UserLogin, UserResponse, UserInDB
from models.response import SuccessResponse, ErrorResponse
from utils.database import get_users_collection
from services.firebase_service import FirebaseService
from middleware.auth_middleware import verify_firebase_token, get_current_user_uid
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])
firebase_service = FirebaseService()


@router.post("/register", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """
    Register a new user (candidate or recruiter)
    Creates user profile in MongoDB
    """
    try:
        users_collection = get_users_collection()
        
        # Check if user already exists
        existing_user = await users_collection.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Create user document
        user_doc = {
            "email": user_data.email,
            "name": user_data.name,
            "role": user_data.role,
            "firebase_uid": None,  # Will be set on first login
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await users_collection.insert_one(user_doc)
        
        return SuccessResponse(
            message="User registered successfully",
            data={
                "user_id": str(result.inserted_id),
                "email": user_data.email,
                "role": user_data.role
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register user: {str(e)}"
        )


@router.post("/login", response_model=SuccessResponse)
async def login_user(credentials: UserLogin):
    """
    Login user with Firebase token
    Verifies token and returns/creates user data
    """
    try:
        # Verify Firebase token
        decoded_token = firebase_service.verify_token(credentials.firebase_token)
        firebase_uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        
        if not firebase_uid or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user information"
            )
        
        users_collection = get_users_collection()
        
        # Find user by email or firebase_uid
        user = await users_collection.find_one({
            "$or": [
                {"email": email},
                {"firebase_uid": firebase_uid}
            ]
        })
        
        # If user doesn't exist, create one (for Google Sign-In)
        if not user:
            # Get display name from token
            display_name = decoded_token.get("name", email.split("@")[0])
            
            user_doc = {
                "email": email,
                "name": display_name,
                "role": "candidate",  # Default role, user can update later
                "firebase_uid": firebase_uid,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await users_collection.insert_one(user_doc)
            user = await users_collection.find_one({"_id": result.inserted_id})
        else:
            # Update firebase_uid if not set
            if not user.get("firebase_uid"):
                await users_collection.update_one(
                    {"_id": user["_id"]},
                    {"$set": {"firebase_uid": firebase_uid, "updated_at": datetime.utcnow()}}
                )
                user["firebase_uid"] = firebase_uid
        
        # Convert ObjectId to string for JSON serialization
        user["_id"] = str(user["_id"])
        
        return SuccessResponse(
            message="Login successful",
            data={
                "user": {
                    "id": user["_id"],
                    "email": user["email"],
                    "name": user["name"],
                    "role": user["role"],
                    "firebase_uid": user["firebase_uid"]
                },
                "token": credentials.firebase_token  # Return the same token
            }
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@router.get("/me", response_model=SuccessResponse)
async def get_current_user(firebase_uid: str = Depends(get_current_user_uid)):
    """
    Get current authenticated user information
    """
    try:
        users_collection = get_users_collection()
        
        user = await users_collection.find_one({"firebase_uid": firebase_uid})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Convert ObjectId to string
        user["_id"] = str(user["_id"])
        
        return SuccessResponse(
            message="User retrieved successfully",
            data={
                "id": user["_id"],
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
                "firebase_uid": user["firebase_uid"],
                "created_at": user["created_at"].isoformat() if user.get("created_at") else None
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user: {str(e)}"
        )


@router.post("/logout", response_model=SuccessResponse)
async def logout_user():
    """
    Logout user (client-side token removal mainly)
    """
    return SuccessResponse(
        message="Logout successful",
        data={"logged_out": True}
    )
