import React from 'react';
import { isMobileDevice } from '../utils/deviceDetection';

// Import mobile pages
import MobileHomePage from '../pages/MobileHomePage';
import MobileCartPage from '../pages/MobileCartPage';
import MobileOrdersPage from '../pages/MobileOrdersPage';
import MobileProfilePage from '../pages/MobileProfilePage';
import MobileProductsPage from '../pages/MobileProductsPage';
import MobileLaborPage from '../pages/MobileLaborPage';

// Import desktop pages
import HomePage from '../pages/HomePage';
import CartPage from '../pages/CartPage';
import MyOrdersPage from '../pages/MyOrdersPage';
import ProfilePage from '../pages/ProfilePage';
import ProductsPage from '../pages/ProductsPage';

const ResponsivePageWrapper = ({ pageType, ...props }) => {
  const isMobile = isMobileDevice();
  
  if (!isMobile) {
    // Desktop/Web versions
    switch (pageType) {
      case 'home':
        return <HomePage {...props} />;
      case 'cart':
        return <CartPage {...props} />;
      case 'orders':
        return <MyOrdersPage {...props} />;
      case 'profile':
        return <ProfilePage {...props} />;
      case 'products':
        return <ProductsPage {...props} />;
      case 'labor':
      case 'labour':
        return <MobileLaborPage {...props} />;
      default:
        return <HomePage {...props} />;
    }
  }
  
  // Mobile versions
  switch (pageType) {
    case 'home':
      return <MobileHomePage {...props} />;
    case 'cart':
      return <MobileCartPage {...props} />;
    case 'orders':
      return <MobileOrdersPage {...props} />;
    case 'profile':
      return <MobileProfilePage {...props} />;
    case 'products':
      return <MobileProductsPage {...props} />;
    case 'labor':
    case 'labour':
      return <MobileLaborPage {...props} />;
    default:
      return <MobileHomePage {...props} />;
  }
};

export default ResponsivePageWrapper;
