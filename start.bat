@echo off
start "Backend" cmd /c "cd backend && node index.js"
start "Bot" cmd /c "cd bot && node index.js"
start "Frontend" cmd /c "cd frontend && npm run dev"
