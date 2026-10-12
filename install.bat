@echo off
echo ========================================
echo  Lab Report Generator - Install
echo ========================================
echo.
echo [1/2] Installing server dependencies...
cd /d "%~dp0server"
npm install
if %errorlevel% neq 0 ( echo ERROR: Server npm install failed! & pause & exit /b 1 )

echo.
echo [2/2] Installing client dependencies...
cd /d "%~dp0client"
npm install
if %errorlevel% neq 0 ( echo ERROR: Client npm install failed! & pause & exit /b 1 )

echo.
echo ✅ All dependencies installed!
echo.
echo Now run start.bat to launch the app.
pause
