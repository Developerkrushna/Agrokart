import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  // Language options with native names
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
  ];

  // Update current language when i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Change language function
  const changeLanguage = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      
      // Store in localStorage for persistence
      localStorage.setItem('selectedLanguage', languageCode);
      
      // Update document direction for RTL languages if needed
      document.documentElement.dir = ['ar', 'he'].includes(languageCode) ? 'rtl' : 'ltr';
      
      return true;
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    }
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  // Check if current language is RTL
  const isRTL = () => {
    return ['ar', 'he'].includes(currentLanguage);
  };

  // Get language direction
  const getDirection = () => {
    return isRTL() ? 'rtl' : 'ltr';
  };

  // Format currency based on language
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat(currentLanguage === 'hi' ? 'hi-IN' : 'en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  // Format numbers based on language
  const formatNumber = (number) => {
    const formatter = new Intl.NumberFormat(currentLanguage === 'hi' ? 'hi-IN' : 'en-IN');
    return formatter.format(number);
  };

  const value = {
    currentLanguage,
    languages,
    changeLanguage,
    getCurrentLanguageInfo,
    isRTL,
    getDirection,
    formatCurrency,
    formatNumber,
    t, // Translation function
    i18n // i18n instance
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
