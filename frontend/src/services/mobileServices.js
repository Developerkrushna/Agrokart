import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Toast } from '@capacitor/toast';
import { Clipboard } from '@capacitor/clipboard';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export class MobileServices {
  static isNative = Capacitor.isNativePlatform();
  static platform = Capacitor.getPlatform();

  // Camera Services
  static async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      return image.dataUrl;
    } catch (error) {
      console.error('Camera error:', error);
      throw error;
    }
  }

  static async selectFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });
      return image.dataUrl;
    } catch (error) {
      console.error('Gallery error:', error);
      throw error;
    }
  }

  // Geolocation Services
  static async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy
      };
    } catch (error) {
      console.error('Geolocation error:', error);
      throw error;
    }
  }

  static async watchLocation(callback) {
    try {
      const watchId = await Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 10000
      }, callback);
      return watchId;
    } catch (error) {
      console.error('Watch location error:', error);
      throw error;
    }
  }

  static async clearWatch(watchId) {
    await Geolocation.clearWatch({ id: watchId });
  }

  // Push Notifications
  static async initializePushNotifications() {
    if (!this.isNative) return;

    try {
      // Request permission
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
      
      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }
      
      await PushNotifications.register();
      
      // Setup listeners
      PushNotifications.addListener('registration', token => {
        console.info('Registration token: ', token.value);
        // Send token to backend
        this.sendTokenToBackend(token.value);
      });
      
      PushNotifications.addListener('registrationError', err => {
        console.error('Registration error: ', err.error);
      });
      
      PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push notification received: ', notification);
        // Handle foreground notification
        this.handleForegroundNotification(notification);
      });
      
      PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
        // Handle notification tap
        this.handleNotificationTap(notification);
      });
      
    } catch (error) {
      console.error('Push notification setup error:', error);
    }
  }

  static async sendTokenToBackend(token) {
    try {
      const response = await fetch('/api/push-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ token })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send token to backend');
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }

  static handleForegroundNotification(notification) {
    // Show local notification when app is in foreground
    this.showLocalNotification({
      title: notification.title,
      body: notification.body,
      id: Date.now()
    });
  }

  static handleNotificationTap(notification) {
    // Navigate to relevant screen based on notification data
    const data = notification.notification.data;
    if (data.route) {
      // Use React Router to navigate
      window.location.href = data.route;
    }
  }

  // Local Notifications
  static async requestNotificationPermissions() {
    if (!this.isNative) return;
    
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  static async showLocalNotification({ title, body, id, scheduledAt = null }) {
    if (!this.isNative) {
      // Fallback for web - show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/logo192.png' });
      }
      return;
    }

    try {
      const notifications = [{
        title,
        body,
        id: id || Date.now(),
        schedule: scheduledAt ? { at: scheduledAt } : undefined,
        sound: 'beep.wav',
        smallIcon: 'ic_stat_icon_config_sample',
        iconColor: '#4CAF50'
      }];

      await LocalNotifications.schedule({ notifications });
    } catch (error) {
      console.error('Local notification error:', error);
    }
  }

  // Network Status
  static async getNetworkStatus() {
    const status = await Network.getStatus();
    return {
      connected: status.connected,
      connectionType: status.connectionType
    };
  }

  static addNetworkListener(callback) {
    return Network.addListener('networkStatusChange', callback);
  }

  // Device Information
  static async getDeviceInfo() {
    const info = await Device.getInfo();
    return {
      platform: info.platform,
      operatingSystem: info.operatingSystem,
      osVersion: info.osVersion,
      manufacturer: info.manufacturer,
      model: info.model,
      isVirtual: info.isVirtual,
      memUsed: info.memUsed,
      diskFree: info.diskFree,
      diskTotal: info.diskTotal,
      batteryLevel: info.batteryLevel,
      isCharging: info.isCharging
    };
  }

  static async getDeviceId() {
    const id = await Device.getId();
    return id.identifier;
  }

  // App State Management
  static addAppStateListener(callback) {
    return App.addListener('appStateChange', callback);
  }

  static addBackButtonListener(callback) {
    if (this.platform === 'android') {
      return App.addListener('backButton', callback);
    }
  }

  // Haptic Feedback
  static async vibrateLight() {
    if (this.isNative) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  }

  static async vibrateMedium() {
    if (this.isNative) {
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  }

  static async vibrateHeavy() {
    if (this.isNative) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    }
  }

  static async vibrateSuccess() {
    if (this.isNative) {
      await Haptics.notification({ type: 'SUCCESS' });
    }
  }

  static async vibrateError() {
    if (this.isNative) {
      await Haptics.notification({ type: 'ERROR' });
    }
  }

  // Toast Messages
  static async showToast(message, duration = 'short') {
    if (this.isNative) {
      await Toast.show({
        text: message,
        duration: duration,
        position: 'bottom'
      });
    } else {
      // Fallback for web - you can integrate with your existing toast system
      console.log('Toast:', message);
    }
  }

  // Clipboard
  static async writeToClipboard(text) {
    await Clipboard.write({ string: text });
  }

  static async readFromClipboard() {
    const result = await Clipboard.read();
    return result.value;
  }

  // File System
  static async writeFile(filename, data, directory = Directory.Documents) {
    try {
      const result = await Filesystem.writeFile({
        path: filename,
        data: data,
        directory: directory,
        encoding: Encoding.UTF8
      });
      return result.uri;
    } catch (error) {
      console.error('Write file error:', error);
      throw error;
    }
  }

  static async readFile(filename, directory = Directory.Documents) {
    try {
      const result = await Filesystem.readFile({
        path: filename,
        directory: directory,
        encoding: Encoding.UTF8
      });
      return result.data;
    } catch (error) {
      console.error('Read file error:', error);
      throw error;
    }
  }

  static async deleteFile(filename, directory = Directory.Documents) {
    try {
      await Filesystem.deleteFile({
        path: filename,
        directory: directory
      });
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }

  // Share
  static async shareContent({ title, text, url, files = [] }) {
    try {
      await Share.share({
        title,
        text,
        url,
        files,
        dialogTitle: 'Share via AgriNet'
      });
    } catch (error) {
      console.error('Share error:', error);
      throw error;
    }
  }

  // Utility Methods
  static async checkAndRequestPermissions() {
    const permissions = [];
    
    // Camera permission
    try {
      const cameraStatus = await Camera.checkPermissions();
      if (cameraStatus.camera !== 'granted') {
        permissions.push('camera');
      }
    } catch (e) {}
    
    // Location permission
    try {
      const locationStatus = await Geolocation.checkPermissions();
      if (locationStatus.location !== 'granted') {
        permissions.push('location');
      }
    } catch (e) {}
    
    // Notification permission
    try {
      const notificationStatus = await LocalNotifications.checkPermissions();
      if (notificationStatus.display !== 'granted') {
        permissions.push('notifications');
      }
    } catch (e) {}
    
    return permissions;
  }

  static async requestPermissions(permissions = []) {
    const results = {};
    
    if (permissions.includes('camera')) {
      try {
        const result = await Camera.requestPermissions();
        results.camera = result.camera === 'granted';
      } catch (e) {
        results.camera = false;
      }
    }
    
    if (permissions.includes('location')) {
      try {
        const result = await Geolocation.requestPermissions();
        results.location = result.location === 'granted';
      } catch (e) {
        results.location = false;
      }
    }
    
    if (permissions.includes('notifications')) {
      try {
        const result = await LocalNotifications.requestPermissions();
        results.notifications = result.display === 'granted';
      } catch (e) {
        results.notifications = false;
      }
    }
    
    return results;
  }

  // Initialize all mobile services
  static async initialize() {
    if (!this.isNative) {
      console.log('Running in web mode');
      return;
    }
    
    console.log('Initializing mobile services...');
    
    try {
      // Initialize push notifications
      await this.initializePushNotifications();
      
      // Request basic permissions
      const neededPermissions = await this.checkAndRequestPermissions();
      if (neededPermissions.length > 0) {
        await this.requestPermissions(neededPermissions);
      }
      
      // Setup app state listeners
      this.addAppStateListener(({ isActive }) => {
        console.log('App state changed. Active:', isActive);
      });
      
      // Setup network listener
      this.addNetworkListener((status) => {
        console.log('Network status changed:', status);
        // You can dispatch this to Redux store or handle offline mode
      });
      
      // Android back button handler
      this.addBackButtonListener((result) => {
        // Handle back button press
        if (window.location.pathname === '/') {
          App.exitApp();
        } else {
          window.history.back();
        }
      });
      
      console.log('Mobile services initialized successfully');
    } catch (error) {
      console.error('Error initializing mobile services:', error);
    }
  }
}

// Export individual functions for convenience
export const {
  takePhoto,
  selectFromGallery,
  getCurrentLocation,
  watchLocation,
  clearWatch,
  showLocalNotification,
  getNetworkStatus,
  addNetworkListener,
  getDeviceInfo,
  getDeviceId,
  vibrateLight,
  vibrateMedium,
  vibrateHeavy,
  vibrateSuccess,
  vibrateError,
  showToast,
  writeToClipboard,
  readFromClipboard,
  shareContent,
  writeFile,
  readFile,
  deleteFile
} = MobileServices;

export default MobileServices;