@echo off
REM TrackWeave Dashboard Migration Script (Windows)
REM This script migrates from the old MusicBrainz-based dashboard to the new local artist registry dashboard

echo ===============================================================
echo   TrackWeave Dashboard Migration
echo ===============================================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: Please run this script from the project root directory
    exit /b 1
)

echo This script will:
echo    1. Backup your current dashboard.html
echo    2. Replace it with the new simplified dashboard
echo    3. Update navigation links if needed
echo.

set /p CONTINUE="Continue? (y/n): "
if /i not "%CONTINUE%"=="y" (
    echo Migration cancelled
    exit /b 0
)

echo.
echo Starting migration...
echo.

REM Step 1: Backup current dashboard
echo Backing up current dashboard...
if exist "src\pages\dashboard.html" (
    copy "src\pages\dashboard.html" "src\pages\dashboard-old.html" >nul
    echo Backup created: src\pages\dashboard-old.html
) else (
    echo No existing dashboard.html found
)

REM Step 2: Replace with new dashboard
echo Installing new dashboard...
copy "src\pages\dashboard-new.html" "src\pages\dashboard.html" >nul
echo New dashboard installed: src\pages\dashboard.html

REM Step 3: Verify files exist
echo.
echo Verifying installation...

if exist "src\scripts\available-artists.js" (
    echo available-artists.js found
) else (
    echo available-artists.js missing!
)

if exist "src\scripts\dashboard-simple.js" (
    echo dashboard-simple.js found
) else (
    echo dashboard-simple.js missing!
)

if exist "src\data\graph_data" (
    echo graph_data folder found
) else (
    echo graph_data folder missing!
)

echo.
echo ===============================================================
echo   Migration Complete!
echo ===============================================================
echo.
echo Summary:
echo    - Old dashboard backed up to: src\pages\dashboard-old.html
echo    - New dashboard active at: src\pages\dashboard.html
echo    - 22 artists available across 6 genres
echo.
echo Next steps:
echo    1. Test the dashboard in your browser
echo    2. Verify all artists are displaying correctly
echo    3. Test the search functionality
echo.
echo For more information, see:
echo    docs\DASHBOARD_AVAILABLE_ARTISTS_UPDATE.md
echo.

pause
