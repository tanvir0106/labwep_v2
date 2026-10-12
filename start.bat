@echo off
echo ========================================
echo   Lab Report Generator - Startup
echo ========================================
echo.
echo [1/2] Starting Backend (Node.js / Express)...
start "LAB-REPORT-SERVER" cmd /k "cd /d "%~dp0server" && node index.js"

timeout /t 2 /nobreak > nul

echo [2/2] Starting Frontend (React)...
start "LAB-REPORT-CLIENT" cmd /k "cd /d "%~dp0client" && npm start"

echo.
echo Both services are starting...
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo Open http://localhost:3000 in your browser.
pause
