Write-Host "Clearing Vite cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
Write-Host "Done!" -ForegroundColor Green
Write-Host ""
Write-Host "Now follow these steps:" -ForegroundColor Cyan
Write-Host "1. Stop your dev server (Ctrl+C)"
Write-Host "2. Run: npm run dev"
Write-Host "3. Close browser COMPLETELY"
Write-Host "4. Reopen browser and go to localhost:5173"
Write-Host ""
Read-Host "Press Enter to continue"
