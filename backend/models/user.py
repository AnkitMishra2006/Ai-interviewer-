from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Literal
from datetime import datetime


# Authentication Models
class UserCreate(BaseModel):
    """Model for user registration"""
    email: EmailStr
    name: str
    role: Literal["candidate", "recruiter"]


class UserLogin(BaseModel):
    """Model for user login - receives Firebase token"""
    firebase_token: str


class UserResponse(BaseModel):
    """Model for user response"""
    id: str
    email: str
    name: str
    role: str
    firebase_uid: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserInDB(BaseModel):
    """Model for user stored in MongoDB"""
    email: EmailStr
    name: str
    role: Literal["candidate", "recruiter"]
    firebase_uid: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


# Legacy Models
class CandidateProfile(BaseModel):
    name: str
    email: str
    phone: str
    skills: List[str]
    experience: List[Dict]
    education: List[Dict]
    job_role: str

class InterviewSession(BaseModel):
    candidate_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str  # active, completed, cancelled
    questions: List[str] = []
    responses: List[Dict] = []

class QuestionResponse(BaseModel):
    question: str
    answer: str
    sentiment: Dict
    timestamp: datetime

class EvaluationReport(BaseModel):
    candidate_id: str
    session_id: str
    technical_score: float
    communication_score: float
    confidence_score: float
    engagement_score: float
    overall_score: float
    recommendation: str
    detailed_analysis: Dict
