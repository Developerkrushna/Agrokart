import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ProfileLayout from './components/layout/ProfileLayout';
import ResponsiveLayout from './components/layout/ResponsiveLayout';
import ResponsivePageWrapper from './components/ResponsivePageWrapper';
import RoleBasedRoute from './components/RoleBasedRoute';
import VendorInterface from './components/VendorInterface';
import DeliveryInterface from './components/DeliveryInterface';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import EmailLoginPage from './pages/EmailLoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPPage from './pages/OtpPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProduct from './components/admin/AddProduct';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import DeliveryDetailsPage from './pages/DeliveryDetailsPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import ProductsPage from './pages/ProductsPage';
import WorkflowDashboard from './components/WorkflowDashboard';
import TestOrderPage from './pages/TestOrderPage';
import TestOrderManagementPage from './pages/TestOrderManagementPage';
import MobileLaborPage from './pages/MobileLaborPage';
import CategoriesPage from './pages/CategoriesPage';
import VendorRegistrationPage from './pages/VendorRegistrationPage';
import VendorLogin from './pages/VendorLogin';
import VendorDashboard from './pages/VendorDashboard';
import UnifiedAuthPage from './pages/UnifiedAuthPage';
import DeliveryRegistrationPage from './pages/DeliveryRegistrationPage';
import DeliveryLogin from './pages/DeliveryLogin';
import DeliveryDashboard from './pages/DeliveryDashboard';
import MarketplaceNavigation from './components/MarketplaceNavigation';

// Protected Route Component
const PrivateRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/home" />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const Routes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/" element={<ResponsiveLayout><ResponsivePageWrapper pageType="home" /></ResponsiveLayout>} />
        <Route path="/home" element={<ResponsiveLayout><ResponsivePageWrapper pageType="home" /></ResponsiveLayout>} />
        <Route path="/products" element={<ResponsiveLayout><ResponsivePageWrapper pageType="products" /></ResponsiveLayout>} />
        <Route path="/labor" element={<ResponsiveLayout><MobileLaborPage /></ResponsiveLayout>} />
        <Route path="/labour" element={<ResponsiveLayout><MobileLaborPage /></ResponsiveLayout>} />
        <Route path="/workflow" element={<MainLayout><WorkflowDashboard /></MainLayout>} />
        {/* Auth Routes */}
        <Route path="/auth" element={<UnifiedAuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/email-login" element={<EmailLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/product/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        <Route path="/test-order" element={<MainLayout><TestOrderPage /></MainLayout>} />
        <Route path="/test-order-management" element={<MainLayout><TestOrderManagementPage /></MainLayout>} />

        {/* Vendor Routes */}
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/register" element={<VendorRegistrationPage />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/inventory" element={<VendorDashboard />} />
        <Route path="/vendor/orders" element={<VendorDashboard />} />
        <Route path="/vendor/orders/:orderId" element={<VendorDashboard />} />
        <Route path="/vendor/earnings" element={<VendorDashboard />} />
        <Route path="/vendor/notifications" element={<VendorDashboard />} />

        {/* Delivery Partner Routes */}
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route path="/delivery/register" element={<DeliveryRegistrationPage />} />
        <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
        <Route path="/delivery/assignments" element={<DeliveryDashboard />} />
        <Route path="/delivery/assignments/:assignmentId/preview" element={<DeliveryDashboard />} />
        <Route path="/delivery/earnings" element={<DeliveryDashboard />} />
        <Route path="/delivery/profile" element={<DeliveryDashboard />} />
        <Route path="/delivery/notifications" element={<DeliveryDashboard />} />
        <Route path="/delivery/location" element={<DeliveryDashboard />} />

        {/* Marketplace Navigation */}
        <Route path="/marketplace" element={<MainLayout><MarketplaceNavigation /></MainLayout>} />

        {/* Protected Routes */}
        <Route
          path="/cart"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ResponsiveLayout><ResponsivePageWrapper pageType="cart" /></ResponsiveLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/delivery-details"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MainLayout><DeliveryDetailsPage /></MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MainLayout><PaymentPage /></MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ProfileLayout><OrderConfirmationPage /></ProfileLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ResponsiveLayout><ResponsivePageWrapper pageType="profile" /></ResponsiveLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ResponsiveLayout><CategoriesPage /></ResponsiveLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/order-tracking"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ProfileLayout><OrderTrackingPage /></ProfileLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ResponsiveLayout><ResponsivePageWrapper pageType="orders" /></ResponsiveLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/order-details/:orderId"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ProfileLayout><OrderDetailsPage /></ProfileLayout>
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <MainLayout><AddProduct /></MainLayout>
            </AdminRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    </ThemeProvider>
  );
};

export default Routes;