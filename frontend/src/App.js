import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { MobileProvider } from './context/MobileContext';
import { NotificationProvider } from './context/NotificationProvider';
import theme from './theme';
import AppRoutes from './routes';
import AIChatbot from './components/AIChatbot';
import WorkflowProvider from './components/WorkflowManager';
import SplashScreen from './components/SplashScreen';
import RoleSelectionPage from './components/RoleSelectionPage';
import UnifiedAuthPage from './pages/UnifiedAuthPage';
import { useAuth } from './context/AuthContext';
import MobileServices from './services/mobileServices';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import './i18n'; // Initialize i18n

// Main App Content Component (must be inside AuthProvider)
const AppContent = () => {
  const { showRoleSelection, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileInitialized, setMobileInitialized] = useState(false);

  // Initialize mobile services
  useEffect(() => {
    const initializeMobile = async () => {
      try {
        // Initialize mobile services
        await MobileServices.initialize();
        
        // Set status bar style for mobile
        if (Capacitor.isNativePlatform()) {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#4CAF50' });
          
          // Setup app state listeners
          CapacitorApp.addListener('appStateChange', ({ isActive }) => {
            console.log('App state changed. Is active:', isActive);
          });
          
          // Handle back button
          CapacitorApp.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
              CapacitorApp.exitApp();
            } else {
              window.history.back();
            }
          });
        }
        
        setMobileInitialized(true);
        console.log('🚀 Mobile app initialized successfully');
      } catch (error) {
        console.error('❌ Mobile initialization error:', error);
        setMobileInitialized(true); // Continue anyway
      }
    };
    
    initializeMobile();
  }, []);

  // Allow certain routes to bypass unified auth gating
  const authBypassPaths = new Set([
    '/login',
    '/auth',
    '/vendor/login',
    '/vendor/register',
    '/delivery/login',
    '/delivery/register'
  ]);
  const shouldBypassAuthGate = authBypassPaths.has(location.pathname);

  // Show unified auth page if not authenticated and role selection is needed
  if (!shouldBypassAuthGate && showRoleSelection && !isAuthenticated) {
    return <UnifiedAuthPage />;
  }

  return (
    <>
      <AppRoutes />
      {/* AI Chatbot - Available on all pages */}
      <AIChatbot />
    </>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const initTimer = setTimeout(() => {
      setAppReady(true);
    }, 100);

    return () => clearTimeout(initTimer);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen until app is ready and splash duration is complete
  if (showSplash || !appReady) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SplashScreen onComplete={handleSplashComplete} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MobileProvider>
          <NotificationProvider>
            <LanguageProvider>
              <AuthProvider>
                <CartProvider>
                  <WorkflowProvider>
                    <AppContent />
                  </WorkflowProvider>
                </CartProvider>
              </AuthProvider>
            </LanguageProvider>
          </NotificationProvider>
        </MobileProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
