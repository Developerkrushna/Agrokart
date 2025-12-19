import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VendorDashboardPage from '../pages/VendorDashboardPage';
import { CircularProgress, Box } from '@mui/material';

const VendorInterface = () => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  console.log('🏪 VendorInterface - Current state:', {
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
    console.log('🔄 VendorInterface - No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Check if user is a vendor or admin
  const effectiveRole = user.role || userRole;
  console.log('🔍 VendorInterface - Effective role:', effectiveRole);
  
  if (effectiveRole !== 'vendor' && effectiveRole !== 'admin') {
    console.log('⚠️ VendorInterface - User not authorized, role:', effectiveRole);
    // Redirect based on user's role
    switch (effectiveRole) {
      case 'delivery_partner':
        return <Navigate to="/delivery/dashboard" replace />;
      case 'customer':
        return <Navigate to="/home" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  console.log('✅ VendorInterface - Rendering VendorDashboardPage');
  // If user is a vendor or admin, show the vendor dashboard
  return <VendorDashboardPage />;
};

export default VendorInterface;