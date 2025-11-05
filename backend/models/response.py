"""
API response models for standardized responses
"""
from pydantic import BaseModel
from typing import Any, Optional


class APIResponse(BaseModel):
    """Base API response model"""
    success: bool
    message: str
    data: Optional[Any] = None


class SuccessResponse(BaseModel):
    """Success response model"""
    success: bool = True
    message: str
    data: Any


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    message: str
    error: Optional[str] = None
    details: Optional[Any] = None
