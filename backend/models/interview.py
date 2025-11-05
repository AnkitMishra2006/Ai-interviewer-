"""
Interview and session related data models
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class InterviewStatus(str, Enum):
    """Interview status enumeration"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class CheatingIncident(BaseModel):
    """Model for cheating detection incidents"""
    type: str  # "multiple_faces", "no_face", "face_mismatch", "looking_away"
    severity: str  # "low", "medium", "high"
    timestamp: datetime
    description: str
    screenshot_url: Optional[str] = None


class QuestionResponse(BaseModel):
    """Model for candidate's answer to a question"""
    question_id: str
    question: str
    answer: str
    audio_url: Optional[str] = None
    transcript: str
    sentiment: Optional[Dict[str, Any]] = None
    scores: Optional[Dict[str, float]] = None
    timestamp: datetime


class InterviewCreate(BaseModel):
    """Model for creating a new interview"""
    candidate_id: str
    job_role: str


class InterviewSession(BaseModel):
    """Complete interview session model"""
    session_id: Optional[str] = None
    candidate_id: str
    job_role: str
    status: InterviewStatus = InterviewStatus.PENDING
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration: Optional[int] = None  # in seconds
    
    # Interview content
    questions: List[str] = []
    responses: List[QuestionResponse] = []
    conversation_history: List[Dict[str, str]] = []
    
    # Monitoring
    face_monitoring_logs: List[Dict[str, Any]] = []
    cheating_incidents: List[CheatingIncident] = []
    
    # Evaluation
    report: Optional[Dict[str, Any]] = None
    
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class InterviewResponse(BaseModel):
    """Response model for interview data"""
    session_id: str
    candidate_name: str
    job_role: str
    status: str
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    overall_score: Optional[float] = None
    recommendation: Optional[str] = None
    has_cheating_incidents: bool = False
