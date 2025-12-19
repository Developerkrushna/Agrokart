import React from 'react';

// Device detection utility
export const isMobileDevice = () => {
  // Check if running in Capacitor (mobile app)
  if (window.Capacitor) {
    return true;
  }
  
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Mobile device patterns
  const mobilePatterns = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /Mobile/i
  ];
  
  const isMobileUA = mobilePatterns.some(pattern => pattern.test(userAgent));
  
  // Check screen size
  const isMobileScreen = window.innerWidth <= 768;
  
  // Check touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return isMobileUA || (isMobileScreen && isTouchDevice);
};

export const isTabletDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Tablet patterns
  const tabletPatterns = [
    /iPad/i,
    /Android(?!.*Mobile)/i,
    /Tablet/i
  ];
  
  const isTabletUA = tabletPatterns.some(pattern => pattern.test(userAgent));
  const isTabletScreen = window.innerWidth > 768 && window.innerWidth <= 1024;
  
  return isTabletUA || isTabletScreen;
};

export const getDeviceType = () => {
  if (isMobileDevice()) return 'mobile';
  if (isTabletDevice()) return 'tablet';
  return 'desktop';
};

// Hook for responsive layout
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = React.useState(getDeviceType());
  
  React.useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return deviceType;
};
