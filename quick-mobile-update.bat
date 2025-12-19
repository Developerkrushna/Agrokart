@echo off
echo 🔄 Quick Mobile App Update...
echo.

cd frontend

echo 📦 Step 1: Building React app with latest changes...
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

echo 🎉 Mobile app updated successfully!
echo.
echo 📱 Next steps:
echo 1. Open Android Studio: npx cap open android
echo 2. Or build APK: cd android && gradlew assembleDebug
echo.
echo ✅ Your mobile app now includes:
echo   - Fixed import errors
echo   - Updated marketplace navigation
echo   - Vendor and delivery partner access
echo   - Three-sided marketplace features
echo.
pause
