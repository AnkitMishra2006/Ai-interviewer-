import google.generativeai as genai
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from datetime import datetime
from typing import Dict
import os

class ReportGenerator:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
        os.makedirs("reports", exist_ok=True)
    
    def calculate_scores(self, interview_data: Dict) -> Dict:
        """Calculate comprehensive scores"""
        
        responses = interview_data.get("responses", [])
        sentiment_scores = interview_data.get("sentiment_scores", [])
        face_analysis = interview_data.get("face_analysis", [])
        
        if not responses:
            return self.get_default_scores()
        
        # Technical knowledge (from answer quality)
        technical_scores = []
        for response in responses:
            if "answer" in response:
                technical_scores.append(len(response["answer"].split()) / 50 * 10)  # Rough estimate
        technical_score = min(10, sum(technical_scores) / len(technical_scores)) if technical_scores else 5
        
        # Communication (from sentiment clarity)
        clarity_scores = [s.get("clarity", 5) for s in sentiment_scores]
        communication_score = sum(clarity_scores) / len(clarity_scores) if clarity_scores else 5
        
        # Confidence (from sentiment confidence)
        confidence_scores = [s.get("confidence", 5) for s in sentiment_scores]
        confidence_score = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 5
        
        # Engagement (from face detection and gaze)
        engagement_count = sum(1 for f in face_analysis if f.get("proper_gaze", False))
        engagement_score = (engagement_count / len(face_analysis) * 10) if face_analysis else 7
        
        # Overall score
        overall_score = (technical_score * 0.35 + 
                        communication_score * 0.25 + 
                        confidence_score * 0.20 + 
                        engagement_score * 0.20) * 10
        
        return {
            "technical_score": round(technical_score, 1),
            "communication_score": round(communication_score, 1),
            "confidence_score": round(confidence_score, 1),
            "engagement_score": round(engagement_score, 1),
            "overall_score": round(overall_score, 1)
        }
    
    def get_default_scores(self):
        return {
            "technical_score": 5.0,
            "communication_score": 5.0,
            "confidence_score": 5.0,
            "engagement_score": 5.0,
            "overall_score": 50.0
        }
    
    def generate_recommendation(self, scores: Dict) -> str:
        """Generate hiring recommendation using Gemini"""
        
        prompt = f"""
        Based on these interview scores, provide a hiring recommendation:
        
        - Technical Knowledge: {scores['technical_score']}/10
        - Communication: {scores['communication_score']}/10
        - Confidence: {scores['confidence_score']}/10
        - Engagement: {scores['engagement_score']}/10
        - Overall Score: {scores['overall_score']}%
        
        Provide ONE of: "Strong Hire", "Hire", "Maybe", "No Hire"
        Then add 2-3 sentence justification.
        """
        
        response = self.model.generate_content(prompt)
        return response.text.strip()
    
    def generate_report(self, candidate: Dict, interview_data: Dict) -> Dict:
        """Generate comprehensive interview report"""
        
        scores = self.calculate_scores(interview_data)
        recommendation = self.generate_recommendation(scores)
        
        report = {
            "candidate_name": candidate.get("name", "Unknown"),
            "job_role": candidate.get("job_role", ""),
            "interview_date": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "scores": scores,
            "recommendation": recommendation,
            "responses_count": len(interview_data.get("responses", [])),
            "duration": len(interview_data.get("responses", [])) * 2,  # Rough estimate
            "detailed_analysis": {
                "strengths": self.identify_strengths(scores),
                "improvements": self.identify_improvements(scores),
                "face_analytics": {
                    "total_frames": len(interview_data.get("face_analysis", [])),
                    "proper_gaze_percentage": self.calculate_gaze_percentage(interview_data)
                }
            }
        }
        
        return report
    
    def identify_strengths(self, scores: Dict) -> list:
        """Identify candidate strengths"""
        strengths = []
        if scores["technical_score"] >= 7:
            strengths.append("Strong technical knowledge")
        if scores["communication_score"] >= 7:
            strengths.append("Excellent communication skills")
        if scores["confidence_score"] >= 7:
            strengths.append("High confidence level")
        if scores["engagement_score"] >= 7:
            strengths.append("Great engagement and attention")
        
        return strengths if strengths else ["Shows potential"]
    
    def identify_improvements(self, scores: Dict) -> list:
        """Identify areas for improvement"""
        improvements = []
        if scores["technical_score"] < 6:
            improvements.append("Technical knowledge needs improvement")
        if scores["communication_score"] < 6:
            improvements.append("Communication clarity could be better")
        if scores["confidence_score"] < 6:
            improvements.append("Confidence level could improve")
        
        return improvements if improvements else ["Minimal improvements needed"]
    
    def calculate_gaze_percentage(self, interview_data: Dict) -> float:
        """Calculate percentage of proper gaze"""
        face_analysis = interview_data.get("face_analysis", [])
        if not face_analysis:
            return 0.0
        
        proper_count = sum(1 for f in face_analysis if f.get("proper_gaze", False))
        return round((proper_count / len(face_analysis)) * 100, 1)
    
    def generate_pdf(self, session_id: str, report: Dict) -> str:
        """Generate PDF report"""
        
        filename = f"reports/{session_id}_report.pdf"
        doc = SimpleDocTemplate(filename, pagesize=letter)
        
        elements = []
        styles = getSampleStyleSheet()
        
        # Title
        title = Paragraph(f"<b>AI Recruiter Pro - Interview Report</b>", styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 20))
        
        # Candidate Info
        info_text = f"""
        <b>Candidate:</b> {report['candidate_name']}<br/>
        <b>Position:</b> {report['job_role']}<br/>
        <b>Date:</b> {report['interview_date']}<br/>
        <b>Duration:</b> {report['duration']} minutes
        """
        elements.append(Paragraph(info_text, styles['Normal']))
        elements.append(Spacer(1, 20))
        
        # Scores Table
        scores = report['scores']
        data = [
            ['Metric', 'Score'],
            ['Technical Knowledge', f"{scores['technical_score']}/10"],
            ['Communication', f"{scores['communication_score']}/10"],
            ['Confidence', f"{scores['confidence_score']}/10"],
            ['Engagement', f"{scores['engagement_score']}/10"],
            ['Overall Score', f"{scores['overall_score']}%"]
        ]
        
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 20))
        
        # Recommendation
        rec_text = f"<b>Recommendation:</b><br/>{report['recommendation']}"
        elements.append(Paragraph(rec_text, styles['Normal']))
        
        doc.build(elements)
        return filename
