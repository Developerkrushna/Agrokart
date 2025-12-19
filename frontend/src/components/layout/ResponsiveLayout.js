import React from 'react';
import { isMobileDevice } from '../../utils/deviceDetection';
import MainLayout from './MainLayout';
import MobileLayout from './MobileLayout';

const ResponsiveLayout = ({ children }) => {
  const isMobile = isMobileDevice();
  
  // Use mobile layout for mobile devices, desktop layout for others
  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }
  
  return <MainLayout>{children}</MainLayout>;
};

export default ResponsiveLayout;
