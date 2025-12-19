@echo off
echo 🚀 Building AgriNet Android APK...
echo.

cd frontend

echo 📦 Step 1: Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ React build failed!
    pause
    exit /b 1
)

echo ✅ React build completed!
echo.

echo 🔄 Step 2: Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Capacitor sync failed!
    pause
    exit /b 1
)

echo ✅ Capacitor sync completed!
echo.

echo 🏗️ Step 3: Building Android APK...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ❌ Android build failed!
    pause
    exit /b 1
)

echo.
echo 🎉 APK Build Completed Successfully!
echo.
echo 📱 APK Location: frontend\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 📋 Installation Instructions:
echo 1. Enable "Unknown Sources" in Android Settings
echo 2. Transfer the APK to your Android device
echo 3. Install the APK
echo 4. Launch AgriNet app
echo.
echo ✅ Your AgriNet mobile app is ready!
pause
