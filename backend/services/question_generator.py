import google.generativeai as genai
from typing import List, Dict

class QuestionGenerator:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generate_questions(self, resume_data: Dict, job_role: str) -> List[str]:
        """Generate initial interview questions based on resume"""
        
        skills = ", ".join(resume_data.get("skills", []))
        
        prompt = f"""
        You are an expert technical interviewer. Generate 8-10 interview questions 
        for a {job_role} position based on the following candidate profile:
        
        Skills: {skills}
        
        Include:
        - 3 technical questions about their skills
        - 2 behavioral questions
        - 2 situational questions
        - 2 questions about their experience
        
        Return as a numbered list.
        """
        
        response = self.model.generate_content(prompt)
        questions = response.text.strip().split('\n')
        
        return [q.strip() for q in questions if q.strip() and any(c.isalnum() for c in q)]
    
    def generate_followup(self, previous_answer: str, skills: List[str], job_role: str) -> str:
        """Generate follow-up question based on candidate's answer"""
        
        prompt = f"""
        The candidate for {job_role} position just answered:
        "{previous_answer}"
        
        Their key skills are: {", ".join(skills[:5])}
        
        Generate ONE relevant follow-up question that:
        - Digs deeper into their answer
        - Tests their technical depth
        - Evaluates problem-solving ability
        
        Return only the question, nothing else.
        """
        
        response = self.model.generate_content(prompt)
        return response.text.strip()
    
    def evaluate_answer(self, question: str, answer: str, expected_skills: List[str]) -> Dict:
        """Evaluate candidate's answer using Gemini"""
        
        prompt = f"""
        Evaluate this interview answer on a scale of 0-10:
        
        Question: {question}
        Answer: {answer}
        Expected skills: {", ".join(expected_skills)}
        
        Provide scores for:
        - Technical accuracy (0-10)
        - Clarity of explanation (0-10)
        - Depth of knowledge (0-10)
        - Relevance to question (0-10)
        
        Format: technical:X, clarity:X, depth:X, relevance:X
        """
        
        response = self.model.generate_content(prompt)
        
        # Parse scores
        scores = {
            "technical": 5.0,
            "clarity": 5.0,
            "depth": 5.0,
            "relevance": 5.0
        }
        
        try:
            text = response.text.lower()
            for key in scores.keys():
                if key in text:
                    import re
                    match = re.search(f"{key}[:\s]+(\d+\.?\d*)", text)
                    if match:
                        scores[key] = float(match.group(1))
        except:
            pass
        
        return scores
