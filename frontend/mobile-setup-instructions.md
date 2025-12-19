# 📱 KrushiDoot Mobile App Setup Instructions

## ✅ **FIXED: Mobile Login/Signup Issue**

The login and signup issues have been resolved! Here's what was fixed:

### 🔧 **What Was Fixed**
1. **API Configuration**: Updated to use your computer's IP address for mobile devices
2. **Backend Server**: Configured to accept connections from mobile devices
3. **Network Access**: Mobile app can now connect to your backend server

### 📍 **Updated APK Location**
Your updated Android APK is ready at:
```
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

## 🚀 **Setup Steps**

### **Step 1: Ensure Backend is Running**
Make sure your backend server is running:
```bash
cd backend
npm start
```
You should see: `Server is running on http://0.0.0.0:5000`

### **Step 2: Check Network Connection**
- Ensure your phone and computer are on the **same WiFi network**
- Your computer's IP address: `192.168.43.196`
- Backend URL for mobile: `http://192.168.43.196:5000`

### **Step 3: Install Updated APK**
1. **Transfer the APK** to your phone
2. **Uninstall** the old KrushiDoot app (if installed)
3. **Install** the new APK file
4. **Open** the app and try login/signup

## 🔐 **Test Login Credentials**

### **Demo Account (Works Offline)**
- **Email**: `demo@shetmitra.com`
- **Password**: `demo123`

### **New Registration**
- Create a new account with any email/password
- Registration will work with the backend server

## 🛠️ **Troubleshooting**

### **If Login Still Fails:**

1. **Check WiFi Connection**
   - Phone and computer must be on same network
   - Try accessing `http://192.168.43.196:5000/api/health` in phone browser

2. **Firewall Issues**
   - Windows Firewall might block connections
   - Allow Node.js through Windows Firewall

3. **IP Address Changed**
   - If your IP changed, update `frontend/src/services/api.js` line 12
   - Rebuild: `npm run build && npx cap sync android && cd android && gradlew assembleDebug`

### **Check Backend Health**
Open in phone browser: `http://192.168.43.196:5000/api/health`
Should show: `{"status":"OK","message":"KrushiDoot API is running"}`

## 📱 **App Features Now Working**
- ✅ User Registration
- ✅ User Login
- ✅ Browse Products
- ✅ Add to Cart
- ✅ Place Orders
- ✅ View Order History
- ✅ Profile Management
- ✅ Multi-language Support

## 🔄 **Quick Rebuild Script**
If you need to rebuild the APK:
```bash
cd frontend
npm run build
npx cap sync android
cd android
gradlew assembleDebug
```

## 📞 **Support**
If you still face issues:
1. Check if backend server is running
2. Verify both devices are on same WiFi
3. Try the demo account first
4. Check Windows Firewall settings

Your KrushiDoot mobile app should now work perfectly! 🌾📱
