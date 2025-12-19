# Agrokart Mobile App - Build Instructions

This guide explains how to build the Agrokart mobile application as an APK for Android devices.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Android Studio** with Android SDK
3. **Java JDK 11** or higher
4. **Capacitor CLI** (installed globally)

## Installation Steps

### 1. Install Capacitor CLI
```bash
npm install -g @capacitor/cli
```

### 2. Install Android Studio
- Download and install Android Studio from https://developer.android.com/studio
- Install Android SDK (API level 33+)
- Set up environment variables:
  - ANDROID_HOME: Path to Android SDK
  - JAVA_HOME: Path to JDK installation

### 3. Install Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
```

## Building the Mobile App

### Step 1: Build the Web App
```bash
cd frontend
npm run build
```

### Step 2: Sync with Capacitor
```bash
npx cap sync android
```

### Step 3: Open in Android Studio
```bash
npx cap open android
```

### Step 4: Build APK
1. In Android Studio, select **Build > Generate Signed Bundle / APK**
2. Choose **APK**
3. Create or select a keystore
4. Choose build variant (release for production)
5. Click **Finish**

## Alternative: CLI Build

### For Debug APK:
```bash
cd frontend/android
./gradlew assembleDebug
```

### For Release APK:
```bash
cd frontend/android
./gradlew assembleRelease
```

## Output Location

The generated APK will be located at:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

## Mobile Features Included

✅ **Native Features:**
- Camera integration for profile photos
- GPS location detection
- Push notifications
- Haptic feedback
- File system access
- Device information
- Network status monitoring
- App state management

✅ **Mobile UI/UX:**
- Bottom navigation for mobile
- Touch-optimized components
- Swipe gestures
- Mobile-first responsive design
- Native status bar styling
- Safe area handling

✅ **Agrokart Features:**
- Customer marketplace
- Vendor dashboard
- Delivery partner interface
- Product catalog
- Shopping cart
- Order management
- Real-time tracking
- Multi-language support

## Testing the Mobile App

### 1. Web Development
```bash
cd frontend
npm start
```

### 2. Mobile Development
```bash
npx cap run android
```

### 3. Live Reload (Development)
```bash
npx cap run android --external
```

## Troubleshooting

### Common Issues:

1. **Build Errors:**
   - Check Android SDK installation
   - Verify JAVA_HOME and ANDROID_HOME
   - Clean and rebuild: `./gradlew clean`

2. **Plugin Issues:**
   - Update Capacitor: `npm update @capacitor/core @capacitor/cli`
   - Sync plugins: `npx cap sync`

3. **Performance:**
   - Enable Proguard for release builds
   - Optimize images and assets
   - Use bundle analyzer for size optimization

## App Configuration

Key configuration files:
- `capacitor.config.ts` - Capacitor settings
- `android/app/src/main/AndroidManifest.xml` - Android permissions
- `android/app/build.gradle` - Build configuration

## App Store Deployment

### Prepare for Release:
1. Update version in `package.json`
2. Generate signed APK
3. Test thoroughly on different devices
4. Prepare store assets (screenshots, descriptions)
5. Upload to Google Play Console

### Version Management:
```json
{
  "version": "1.0.0",
  "android": {
    "versionCode": 1
  }
}
```

## Next Steps

1. **iOS Build:** Follow similar steps with Xcode for iOS deployment
2. **CI/CD:** Set up automated builds with GitHub Actions
3. **Code Signing:** Configure proper certificates for distribution
4. **Analytics:** Integrate mobile analytics (Firebase, etc.)
5. **Crash Reporting:** Add crash reporting tools

---

**Note:** This mobile conversion includes all web app features optimized for mobile use, with native mobile capabilities like camera, GPS, and push notifications fully integrated.