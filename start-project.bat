@echo off
TITLE Echo Outfits - Local Development Server
COLOR 0B

echo ===================================================
echo     ECHO OUTFITS - STARTING FULLSTACK PROJECT
echo ===================================================
echo.
echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [2/3] Moving to project root directory: %~dp0
cd /d "%~dp0"

echo [3/3] Starting Backend (Port 5000) & Frontend (Port 5173)...
echo.
echo ---------------------------------------------------
echo  Storefront: http://localhost:5173
echo  Admin Panel: http://localhost:5173/admin
echo  Backend API: http://localhost:5000/api
echo ---------------------------------------------------
echo.
echo Press Ctrl + C anytime in this window to stop servers.
echo.

npm run dev

pause
