@echo off
echo ========================================
echo 🚀 AI Recruiter Pro - Backend Setup
echo ========================================
echo.

REM Check if virtual environment exists
if exist "venv" (
    echo ✅ Virtual environment found
) else (
    echo 📦 Creating virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created
)

echo.
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo 📚 Installing/Updating dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo.
echo ⚙️  Checking configuration...
if exist ".env" (
    echo ✅ .env file found
) else (
    echo ⚠️  Creating .env from .env.example
    copy .env.example .env
    echo ⚠️  Please update .env with your configuration
)

if exist "firebase-service-account.json" (
    echo ✅ Firebase credentials found
) else (
    echo ⚠️  firebase-service-account.json not found!
    echo    Please add your Firebase service account JSON file
)

echo.
echo ========================================
echo 🚀 Starting backend server...
echo    Backend: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo    Press Ctrl+C to stop
echo ========================================
echo.

uvicorn main:app --reload --port 8000
