@echo off
echo Starting ArtSpark Studio Canvas servers...

echo.
echo Starting Frontend Server (Port 8080)...
start "Frontend" cmd /k "cd /d C:\Users\USER\artspark-studio-canvas-2 && npm run dev"

echo.
echo Starting Backend Server (Port 3001)...
start "Backend" cmd /k "cd /d C:\Users\USER\artspark-studio-canvas-2\server && npm start"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:8080
echo Backend API: http://localhost:3001
echo.
echo Press any key to close this window...
pause > nul
