import google.generativeai as genai
from typing import Dict

class SentimentAnalyzer:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    def analyze(self, text: str, audio_features: dict = None) -> Dict:
        """Analyze sentiment and confidence from text and speech"""
        
        prompt = f"""
        Analyze this interview response for:
        - Confidence level (0-10)
        - Enthusiasm level (0-10)
        - Clarity of thought (0-10)
        - Professionalism (0-10)
        - Overall sentiment (positive/neutral/negative)
        
        Response: "{text}"
        
        Format: confidence:X, enthusiasm:X, clarity:X, professionalism:X, sentiment:XXX
        """
        
        response = self.model.generate_content(prompt)
        
        # Parse scores
        scores = {
            "confidence": 5.0,
            "enthusiasm": 5.0,
            "clarity": 5.0,
            "professionalism": 5.0,
            "sentiment": "neutral"
        }
        
        try:
            text_response = response.text.lower()
            import re
            
            for key in ["confidence", "enthusiasm", "clarity", "professionalism"]:
                match = re.search(f"{key}[:\s]+(\d+\.?\d*)", text_response)
                if match:
                    scores[key] = float(match.group(1))
            
            if "positive" in text_response:
                scores["sentiment"] = "positive"
            elif "negative" in text_response:
                scores["sentiment"] = "negative"
                
        except Exception as e:
            print(f"Sentiment parsing error: {e}")
        
        # Incorporate audio features if available
        if audio_features:
            clarity_bonus = audio_features.get("clarity_score", 5) / 10
            scores["clarity"] = (scores["clarity"] + clarity_bonus * 10) / 2
        
        return scores
