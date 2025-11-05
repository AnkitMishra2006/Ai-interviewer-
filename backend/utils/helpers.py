"""
Helper utility functions
"""
import uuid
from typing import Any, Dict
from fastapi import UploadFile
from config import settings


def generate_id() -> str:
    """Generate unique ID"""
    return str(uuid.uuid4())


def validate_file(file: UploadFile) -> bool:
    """
    Validate uploaded file type and size
    
    Args:
        file: Uploaded file
        
    Returns:
        True if valid, False otherwise
    """
    # TODO: Implement file validation
    # Check file extension
    # Check file size
    pass


def format_response(success: bool, message: str, data: Any = None) -> Dict:
    """
    Format standardized API response
    
    Args:
        success: Success status
        message: Response message
        data: Optional response data
        
    Returns:
        Formatted response dictionary
    """
    response = {
        "success": success,
        "message": message
    }
    if data is not None:
        response["data"] = data
    return response
