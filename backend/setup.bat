@echo off
echo ========================================
echo Space4U Backend Setup
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
echo.

echo Step 2: Checking .env file...
if not exist .env (
    echo Creating .env from example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit backend\.env and add your Supabase credentials!
    echo Get them from: https://supabase.com/dashboard/project/_/settings/api
    echo.
    pause
) else (
    echo .env file already exists
)
echo.

echo Step 3: Starting server...
echo Server will run on http://localhost:3000
echo Press Ctrl+C to stop
echo.
node express-server.js
