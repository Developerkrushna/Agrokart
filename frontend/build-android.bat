@echo off
echo Building KrushiDoot Android App...
echo.

echo Step 1: Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo Error: React build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Error: Capacitor sync failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Building Android APK...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo Error: Android build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo 📱 Your APK file is located at:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo You can install this APK on your Android device.
echo.
pause
