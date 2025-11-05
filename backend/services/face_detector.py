import cv2
import mediapipe as mp
import numpy as np
import base64
from deepface import DeepFace

class FaceDetector:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=2,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        self.reference_face = None
    
    def decode_image(self, base64_string: str):
        """Decode base64 image"""
        try:
            img_data = base64.b64decode(base64_string.split(',')[1] if ',' in base64_string else base64_string)
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            return img
        except Exception as e:
            print(f"Image decode error: {e}")
            return None
    
    def detect_and_analyze(self, frame_base64: str) -> dict:
        """Detect face and analyze gaze/pose"""
        frame = self.decode_image(frame_base64)
        
        if frame is None:
            return {
                "face_detected": False,
                "multiple_faces": False,
                "proper_gaze": False,
                "emotion": "unknown"
            }
        
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        face_detected = False
        multiple_faces = False
        proper_gaze = True
        emotion = "neutral"
        
        if results.multi_face_landmarks:
            face_detected = True
            num_faces = len(results.multi_face_landmarks)
            multiple_faces = num_faces > 1
            
            # Analyze first face for gaze
            if num_faces >= 1:
                landmarks = results.multi_face_landmarks[0]
                
                # Calculate head pose
                proper_gaze = self.check_gaze(landmarks, frame.shape)
                
                # Detect emotion using DeepFace
                try:
                    analysis = DeepFace.analyze(
                        frame,
                        actions=['emotion'],
                        enforce_detection=False
                    )
                    emotion = analysis[0]['dominant_emotion']
                except:
                    emotion = "neutral"
            
            # Store reference face on first detection
            if self.reference_face is None:
                self.reference_face = frame.copy()
        
        return {
            "face_detected": face_detected,
            "multiple_faces": multiple_faces,
            "proper_gaze": proper_gaze,
            "emotion": emotion,
            "num_faces": len(results.multi_face_landmarks) if results.multi_face_landmarks else 0
        }
    
    def check_gaze(self, landmarks, frame_shape) -> bool:
        """Check if candidate is looking at camera"""
        # Get nose tip and eye landmarks
        nose_tip = landmarks.landmark[1]
        left_eye = landmarks.landmark[33]
        right_eye = landmarks.landmark[263]
        
        # Calculate center point
        center_x = (left_eye.x + right_eye.x) / 2
        center_y = (left_eye.y + right_eye.y) / 2
        
        # Check if nose is roughly centered (gaze forward)
        gaze_threshold = 0.15
        x_diff = abs(nose_tip.x - center_x)
        y_diff = abs(nose_tip.y - center_y)
        
        return x_diff < gaze_threshold and y_diff < gaze_threshold
