import React, { createContext, useContext, useState, useEffect } from 'react';
import MobileServices from '../services/mobileServices';
import { Capacitor } from '@capacitor/core';

const MobileContext = createContext();

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
};

export const MobileProvider = ({ children }) => {
  const [isNative, setIsNative] = useState(Capacitor.isNativePlatform());
  const [platform, setPlatform] = useState(Capacitor.getPlatform());
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [networkStatus, setNetworkStatus] = useState({ connected: true, connectionType: 'wifi' });
  const [location, setLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    notifications: false
  });

  useEffect(() => {
    initializeMobileContext();
  }, []);

  const initializeMobileContext = async () => {
    try {
      // Get device info
      if (isNative) {
        const info = await MobileServices.getDeviceInfo();
        setDeviceInfo(info);
      }

      // Get network status
      const netStatus = await MobileServices.getNetworkStatus();
      setNetworkStatus(netStatus);
      setIsOnline(netStatus.connected);

      // Setup network listener
      MobileServices.addNetworkListener((status) => {
        setNetworkStatus(status);
        setIsOnline(status.connected);
      });

      // Check permissions
      const neededPermissions = await MobileServices.checkAndRequestPermissions();
      const permissionResults = await MobileServices.requestPermissions(neededPermissions);
      setPermissions(permissionResults);

    } catch (error) {
      console.error('Mobile context initialization error:', error);
    }
  };

  // Camera functions
  const takePhoto = async () => {
    try {
      const photo = await MobileServices.takePhoto();
      return photo;
    } catch (error) {
      console.error('Take photo error:', error);
      throw error;
    }
  };

  const selectFromGallery = async () => {
    try {
      const photo = await MobileServices.selectFromGallery();
      return photo;
    } catch (error) {
      console.error('Select from gallery error:', error);
      throw error;
    }
  };

  // Location functions
  const getCurrentLocation = async () => {
    try {
      const currentLocation = await MobileServices.getCurrentLocation();
      setLocation(currentLocation);
      return currentLocation;
    } catch (error) {
      console.error('Get location error:', error);
      throw error;
    }
  };

  const watchLocation = async (callback) => {
    try {
      const watchId = await MobileServices.watchLocation((position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setLocation(locationData);
        if (callback) callback(locationData);
      });
      return watchId;
    } catch (error) {
      console.error('Watch location error:', error);
      throw error;
    }
  };

  // Notification functions
  const showNotification = async ({ title, body, id, scheduledAt }) => {
    try {
      await MobileServices.showLocalNotification({ title, body, id, scheduledAt });
    } catch (error) {
      console.error('Show notification error:', error);
    }
  };

  // Haptic feedback
  const vibrate = async (type = 'light') => {
    try {
      switch (type) {
        case 'light':
          await MobileServices.vibrateLight();
          break;
        case 'medium':
          await MobileServices.vibrateMedium();
          break;
        case 'heavy':
          await MobileServices.vibrateHeavy();
          break;
        case 'success':
          await MobileServices.vibrateSuccess();
          break;
        case 'error':
          await MobileServices.vibrateError();
          break;
        default:
          await MobileServices.vibrateLight();
      }
    } catch (error) {
      console.error('Vibrate error:', error);
    }
  };

  // Toast messages
  const showToast = async (message, duration = 'short') => {
    try {
      await MobileServices.showToast(message, duration);
    } catch (error) {
      console.error('Show toast error:', error);
    }
  };

  // Share content
  const shareContent = async ({ title, text, url, files = [] }) => {
    try {
      await MobileServices.shareContent({ title, text, url, files });
    } catch (error) {
      console.error('Share error:', error);
      throw error;
    }
  };

  // Clipboard operations
  const copyToClipboard = async (text) => {
    try {
      await MobileServices.writeToClipboard(text);
      await showToast('Copied to clipboard');
    } catch (error) {
      console.error('Copy to clipboard error:', error);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await MobileServices.readFromClipboard();
      return text;
    } catch (error) {
      console.error('Paste from clipboard error:', error);
      return '';
    }
  };

  // File operations
  const saveFile = async (filename, data) => {
    try {
      const uri = await MobileServices.writeFile(filename, data);
      await showToast('File saved successfully');
      return uri;
    } catch (error) {
      console.error('Save file error:', error);
      throw error;
    }
  };

  const loadFile = async (filename) => {
    try {
      const data = await MobileServices.readFile(filename);
      return data;
    } catch (error) {
      console.error('Load file error:', error);
      throw error;
    }
  };

  // Request permissions
  const requestPermissions = async (permissionTypes = []) => {
    try {
      const results = await MobileServices.requestPermissions(permissionTypes);
      setPermissions(prev => ({ ...prev, ...results }));
      return results;
    } catch (error) {
      console.error('Request permissions error:', error);
      return {};
    }
  };

  const contextValue = {
    // Platform info
    isNative,
    platform,
    deviceInfo,
    isOnline,
    networkStatus,
    location,
    permissions,

    // Camera functions
    takePhoto,
    selectFromGallery,

    // Location functions
    getCurrentLocation,
    watchLocation,

    // Notification functions
    showNotification,

    // Haptic feedback
    vibrate,

    // UI functions
    showToast,
    shareContent,

    // Clipboard functions
    copyToClipboard,
    pasteFromClipboard,

    // File functions
    saveFile,
    loadFile,

    // Permission functions
    requestPermissions,

    // Utility functions
    initializeMobileContext
  };

  return (
    <MobileContext.Provider value={contextValue}>
      {children}
    </MobileContext.Provider>
  );
};

export default MobileProvider;