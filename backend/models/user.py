from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

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
