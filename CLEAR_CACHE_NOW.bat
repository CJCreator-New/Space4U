@echo off
echo Clearing Vite cache...
rmdir /s /q "node_modules\.vite" 2>nul
echo Done!
echo.
echo Now:
echo 1. Stop your dev server (Ctrl+C)
echo 2. Run: npm run dev
echo 3. In browser: Ctrl+Shift+Delete, clear cache, close browser
echo 4. Reopen browser and go to localhost:5173
pause
