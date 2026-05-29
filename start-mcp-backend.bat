@echo off
echo ========================================
echo Starting DirectoryBlue Backend with MCP
echo ========================================
echo.
echo Data Source: MCP Context Studio
echo.

cd mock-backend
set USE_MCP=true
npm start

@REM Made with Bob
