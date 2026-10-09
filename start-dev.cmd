@echo off
setlocal

set "ROOT=%~dp0"
set "FRONTEND=%ROOT%home-healthcare-frontend"
set "BACKEND=%ROOT%home-healthcare-backend\home-healthcare-backend"

if not exist "%FRONTEND%\package.json" (
  echo Frontend project not found: "%FRONTEND%"
  exit /b 1
)

if not exist "%BACKEND%\mvnw.cmd" (
  echo Backend Maven wrapper not found: "%BACKEND%\mvnw.cmd"
  exit /b 1
)

echo Starting CareNest frontend and backend...

powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" >nul 2>&1
if errorlevel 1 (
  start "CareNest Backend" /D "%BACKEND%" cmd.exe /k mvnw.cmd spring-boot:run
) else (
  echo Backend port 8080 is already in use; leaving the running service untouched.
)

powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" >nul 2>&1
if errorlevel 1 (
  start "CareNest Frontend" /D "%FRONTEND%" cmd.exe /k npm run dev -- --host localhost --port 5173 --strictPort
) else (
  echo Frontend port 5173 is already in use; leaving the running service untouched.
)

echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080
echo Close either server window to stop a server started by this command.
