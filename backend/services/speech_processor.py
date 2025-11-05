import speech_recognition as sr
import numpy as np
from pydub import AudioSegment
import io
import base64

class SpeechProcessor:
    def __init__(self):
        self.recognizer = sr.Recognizer()
    
    def transcribe(self, audio_base64: str) -> str:
        """Convert speech to text"""
        try:
            # Decode base64 audio
            audio_data = base64.b64decode(audio_base64)
            
            # Convert to audio segment
            audio = AudioSegment.from_file(io.BytesIO(audio_data))
            
            # Export as WAV
            wav_io = io.BytesIO()
            audio.export(wav_io, format="wav")
            wav_io.seek(0)
            
            # Recognize speech
            with sr.AudioFile(wav_io) as source:
                audio_data = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio_data)
                return text
                
        except Exception as e:
            print(f"Transcription error: {e}")
            return ""
    
    def analyze_speech_features(self, audio_base64: str) -> dict:
        """Analyze speech characteristics"""
        try:
            audio_data = base64.b64decode(audio_base64)
            audio = AudioSegment.from_file(io.BytesIO(audio_data))
            
            # Calculate features
            duration = len(audio) / 1000.0  # seconds
            avg_volume = audio.dBFS
            
            # Speech rate (rough estimate)
            words = self.transcribe(audio_base64).split()
            speech_rate = len(words) / duration if duration > 0 else 0
            
            return {
                "duration": duration,
                "avg_volume": avg_volume,
                "speech_rate": speech_rate,
                "word_count": len(words),
                "clarity_score": min(10, max(0, (avg_volume + 30) / 5))  # Normalize
            }
            
        except Exception as e:
            print(f"Speech analysis error: {e}")
            return {
                "duration": 0,
                "avg_volume": 0,
                "speech_rate": 0,
                "word_count": 0,
                "clarity_score": 5
            }
