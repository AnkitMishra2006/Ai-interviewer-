from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from datetime import datetime
from typing import Dict, List, Optional
import os
from config import settings


class Database:
    """MongoDB database manager - Async version"""
    client: Optional[AsyncIOMotorClient] = None
    db = None

    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB"""
        try:
            cls.client = AsyncIOMotorClient(settings.MONGODB_URI)
            cls.db = cls.client[settings.DATABASE_NAME]
            # Test connection
            await cls.client.admin.command('ping')
            print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            raise
    
    @classmethod
    async def close_db(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            print("✅ Disconnected from MongoDB")
    
    @classmethod
    def get_collection(cls, name: str):
        """Get a MongoDB collection"""
        if cls.db is None:
            raise RuntimeError("Database not connected")
        return cls.db[name]


# Helper functions to get collections
def get_users_collection():
    """Get users collection"""
    return Database.get_collection("users")


def get_interviews_collection():
    """Get interviews collection"""
    return Database.get_collection("interviews")


def get_responses_collection():
    """Get responses collection"""
    return Database.get_collection("responses")


# Legacy sync database class for backward compatibility
class LegacyDatabase:
    def __init__(self):
        # Use MongoDB connection string from env or default to local
        mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
        self.client = MongoClient(mongo_uri)
        self.db = self.client["ai_recruiter_pro"]
        
        self.candidates = self.db["candidates"]
        self.sessions = self.db["sessions"]
    
    def save_candidate(self, candidate_data: Dict) -> str:
        """Save candidate profile"""
        candidate_data["created_at"] = datetime.now()
        result = self.candidates.insert_one(candidate_data)
        return str(result.inserted_id)
    
    def get_candidate(self, candidate_id: str) -> Dict:
        """Get candidate by ID"""
        from bson import ObjectId
        return self.candidates.find_one({"_id": ObjectId(candidate_id)})
    
    def save_session(self, session_data: Dict) -> str:
        """Save interview session"""
        session_data["created_at"] = datetime.now()
        result = self.sessions.insert_one(session_data)
        return str(result.inserted_id)
    
    def get_session(self, session_id: str) -> Dict:
        """Get session by ID"""
        from bson import ObjectId
        return self.sessions.find_one({"_id": ObjectId(session_id)})
    
    def update_session(self, session_id: str, update_data: Dict):
        """Update session data"""
        from bson import ObjectId
        self.sessions.update_one(
            {"_id": ObjectId(session_id)},
            {"$set": update_data}
        )
    
    def get_all_sessions(self) -> List[Dict]:
        """Get all sessions for dashboard"""
        sessions = list(self.sessions.find().sort("created_at", -1).limit(50))
        
        # Convert ObjectId to string
        for session in sessions:
            session["_id"] = str(session["_id"])
            if "candidate_id" in session:
                session["candidate_id"] = str(session["candidate_id"])
        
        return sessions
