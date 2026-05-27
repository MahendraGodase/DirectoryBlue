@echo off
echo ============================================================
echo Starting Web Application with Azure SQL Database
echo ============================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Checking backend dependencies...
cd mock-backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)

echo.
echo [2/4] Checking frontend dependencies...
cd ..
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

echo.
echo [3/4] Starting Azure SQL backend server...
echo Backend will connect to: serproviderinfo.database.windows.net
echo Database: providerinfo
start "Azure SQL Backend Server" cmd /k "cd mock-backend && npm run start-azure"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Starting Angular application...
echo Frontend will run on http://localhost:4200
start "Angular App" cmd /k "npm start"

echo.
echo ============================================================
echo Application is starting with Azure SQL Database!
echo ============================================================
echo.
echo Backend Server: http://localhost:3000 (Azure SQL)
echo Frontend App:   http://localhost:4200
echo.
echo Database: serproviderinfo.database.windows.net
echo Database Name: providerinfo
echo Authentication: SQL Server Authentication
echo User: mahi
echo.
echo Two command windows will open:
echo   1. Azure SQL Backend Server (port 3000)
echo   2. Angular Application (port 4200)
echo.
echo Wait for both to finish starting, then open your browser to:
echo http://localhost:4200
echo.
echo To stop the application, close both command windows.
echo ============================================================
echo.
pause

@REM Made with Bob
