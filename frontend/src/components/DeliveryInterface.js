import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DeliveryDashboardPage from '../pages/DeliveryDashboardPage';
import { CircularProgress, Box } from '@mui/material';

const DeliveryInterface = () => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  console.log('🚚 DeliveryInterface - Current state:', {
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    userRole,
    loading,
    pathname: location.pathname
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    console.log('🔄 DeliveryInterface - No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Check if user is a delivery partner or admin
  const effectiveRole = user.role || userRole;
  console.log('🔍 DeliveryInterface - Effective role:', effectiveRole);
  
  if (effectiveRole !== 'delivery_partner' && effectiveRole !== 'admin') {
    console.log('⚠️ DeliveryInterface - User not authorized, role:', effectiveRole);
    // Redirect based on user's role
    switch (effectiveRole) {
      case 'vendor':
        return <Navigate to="/vendor/dashboard" replace />;
      case 'customer':
        return <Navigate to="/home" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  console.log('✅ DeliveryInterface - Rendering DeliveryDashboardPage');
  // If user is a delivery partner or admin, show the delivery dashboard
  return <DeliveryDashboardPage />;
};

export default DeliveryInterface;