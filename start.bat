@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

echo.
echo === SyncFlow Setup ===
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js not found.
  echo Install from https://nodejs.org then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto :error
)

if not exist "prisma\dev.db" (
  echo Setting up database...
  call npm run db:push
  if errorlevel 1 goto :error
)

echo.
echo Starting app at http://localhost:3000
echo Press Ctrl+C to stop.
echo.
call npm run dev
goto :end

:error
echo.
echo Something went wrong. See errors above.
pause
exit /b 1

:end
