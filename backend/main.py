"""
Main FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes import auth_router, candidates_router, interviews_router, recruiters_router

# Create FastAPI app
app = FastAPI(
    title="AI Recruiter Pro API",
    description="Intelligent interview automation platform with cheating detection",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(candidates_router)
app.include_router(interviews_router)
app.include_router(recruiters_router)


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "AI Recruiter Pro API",
        "status": "active",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Recruiter Pro"
    }



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
