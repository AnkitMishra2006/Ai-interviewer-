# Backend Quick Start Script for PowerShell

Write-Host "🚀 AI Recruiter Pro - Backend Setup" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Check if virtual environment exists
if (Test-Path "venv") {
    Write-Host "✅ Virtual environment found" -ForegroundColor Green
} else {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "`n🔌 Activating virtual environment..." -ForegroundColor Yellow
. ".\venv\Scripts\Activate.ps1"

# Check if requirements are installed
Write-Host "`n📚 Checking dependencies..." -ForegroundColor Yellow
$installed = pip list --format=freeze
if ($installed -match "fastapi") {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "📥 Installing dependencies (this may take 2-3 minutes)..." -ForegroundColor Yellow
    pip install --upgrade pip
    pip install -r requirements.txt
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# Check environment file
Write-Host "`n⚙️  Checking configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file not found - copying from .env.example" -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please update .env with your configuration" -ForegroundColor Yellow
}

# Check Firebase credentials
if (Test-Path "firebase-service-account.json") {
    Write-Host "✅ Firebase credentials found" -ForegroundColor Green
} else {
    Write-Host "⚠️  firebase-service-account.json not found!" -ForegroundColor Red
    Write-Host "   Please add your Firebase service account JSON file" -ForegroundColor Red
}

# Start server
Write-Host "`n🚀 Starting backend server..." -ForegroundColor Cyan
Write-Host "   Backend will run on: http://localhost:8000" -ForegroundColor Cyan
Write-Host "   API Docs available at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "`n   Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

uvicorn main:app --reload --port 8000
