import PyPDF2
import spacy
import re
import google.generativeai as genai

class ResumeParser:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            import os
            os.system("python -m spacy download en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")
        
        self.model = genai.GenerativeModel('gemini-pro')
    
    def extract_text_from_pdf(self, pdf_path):
        """Extract text from PDF file"""
        text = ""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text()
        except Exception as e:
            print(f"Error extracting PDF: {e}")
        return text
    
    def extract_email(self, text):
        """Extract email using regex"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else ""
    
    def extract_phone(self, text):
        """Extract phone number"""
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text)
        return phones[0] if phones else ""
    
    def extract_skills_with_gemini(self, text):
        """Use Gemini to extract skills"""
        prompt = f"""
        Extract all technical skills, programming languages, frameworks, and tools 
        mentioned in this resume. Return as a comma-separated list.
        
        Resume text:
        {text[:3000]}
        """
        
        response = self.model.generate_content(prompt)
        skills = response.text.strip().split(',')
        return [skill.strip() for skill in skills if skill.strip()]
    
    def extract_experience_with_gemini(self, text):
        """Use Gemini to extract work experience"""
        prompt = f"""
        Extract work experience from this resume. For each job, provide:
        - Company name
        - Job title
        - Duration
        - Key responsibilities (2-3 points)
        
        Format as JSON array.
        
        Resume text:
        {text[:3000]}
        """
        
        response = self.model.generate_content(prompt)
        try:
            import json
            experience = json.loads(response.text)
        except:
            experience = [{"raw": response.text}]
        
        return experience
    
    def parse(self, pdf_path):
        """Main parsing function"""
        text = self.extract_text_from_pdf(pdf_path)
        doc = self.nlp(text)
        
        # Extract name (usually first PERSON entity)
        name = ""
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                name = ent.text
                break
        
        # Extract other information
        email = self.extract_email(text)
        phone = self.extract_phone(text)
        skills = self.extract_skills_with_gemini(text)
        experience = self.extract_experience_with_gemini(text)
        
        return {
            "name": name or "Unknown Candidate",
            "email": email,
            "phone": phone,
            "skills": skills,
            "experience": experience,
            "education": [],
            "raw_text": text
        }
