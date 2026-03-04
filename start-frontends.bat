@echo off
echo Starting Admin Portal...
start "Admin Portal" cmd /k "cd admin && npm run dev"

echo Starting Staff Portal...
start "Staff Portal" cmd /k "cd staff && npm run dev"

echo Starting Main Frontend (Legacy)...
start "Main Frontend" cmd /k "cd frontend && npm run dev"

echo All frontend portals are starting up!
echo They should automatically open in your default browser or be available at:
echo - http://localhost:5173
echo - http://localhost:5174
echo - http://localhost:5175
