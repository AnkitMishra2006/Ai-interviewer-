# AI Recruiter Pro - Development Environment Starter
# This script runs both backend and frontend concurrently

Write-Host "🚀 AI Recruiter Pro - Starting Development Environment" -ForegroundColor Cyan
Write-Host "====================================================`n" -ForegroundColor Cyan

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Check if ports are available
Write-Host "🔍 Checking ports..." -ForegroundColor Yellow
if (Test-Port 8000) {
    Write-Host "⚠️  Port 8000 (Backend) is already in use!" -ForegroundColor Red
    Write-Host "   Please stop the existing backend server or use a different port." -ForegroundColor Yellow
}
if (Test-Port 5173) {
    Write-Host "⚠️  Port 5173 (Frontend) is already in use!" -ForegroundColor Red
    Write-Host "   Please stop the existing frontend server or use a different port." -ForegroundColor Yellow
}

Write-Host "`n📂 Setting up Backend..." -ForegroundColor Cyan

# Check if backend virtual environment exists
if (!(Test-Path "backend\venv")) {
    Write-Host "📦 Creating backend virtual environment..." -ForegroundColor Yellow
    Set-Location backend
    python -m venv venv
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
    Set-Location ..
}

# Check if backend dependencies are installed
Set-Location backend
. ".\venv\Scripts\Activate.ps1"
$installed = pip list --format=freeze 2>$null
if (!($installed -match "fastapi")) {
    Write-Host "📥 Installing backend dependencies..." -ForegroundColor Yellow
    pip install --upgrade pip --quiet
    pip install -r requirements.txt --quiet
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}
deactivate
Set-Location ..

Write-Host "`n📂 Setting up Frontend..." -ForegroundColor Cyan

# Check if frontend node_modules exists
if (!(Test-Path "frontend\node_modules")) {
    Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
    Set-Location ..
}

Write-Host "`n🎬 Starting servers..." -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

Write-Host "📍 Backend will run on:  http://localhost:8000" -ForegroundColor Blue
Write-Host "📍 Frontend will run on: http://localhost:5173" -ForegroundColor Blue
Write-Host "`n💡 Press Ctrl+C to stop both servers`n" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

# Start backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; . .\venv\Scripts\Activate.ps1; Write-Host '🔥 Backend Server Running' -ForegroundColor Green; python main.py"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '⚡ Frontend Dev Server Running' -ForegroundColor Green; npm run dev"

Write-Host "✅ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host "`n📝 Tips:" -ForegroundColor Cyan
Write-Host "   • Backend API docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "   • Close both terminal windows to stop servers" -ForegroundColor Gray
Write-Host "   • Check the separate windows for server logs" -ForegroundColor Gray
Write-Host "`nPress any key to exit this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
