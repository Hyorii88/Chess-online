@echo off
echo ====================================
echo FORCE RESTART - CLEAR ALL CACHE
echo ====================================

echo.
echo [1/4] Killing all Node processes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] Clearing Next.js cache...
cd /d "%~dp0frontend"
if exist ".next" (
    rmdir /s /q ".next"
    echo     - Frontend .next folder deleted
)
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo     - Frontend node cache deleted
)

echo [3/4] Starting Backend...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo [4/4] Starting Frontend...
cd /d "%~dp0frontend"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ====================================
echo DONE! Servers are starting...
echo ====================================
echo.
echo IMPORTANT:
echo 1. Wait 10 seconds for servers to fully start
echo 2. Open browser in INCOGNITO mode
echo 3. Go to: http://localhost:3000
echo 4. Test Quick Match
echo.
pause
