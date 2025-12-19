import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Check if user's role is in the allowed roles list
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on user's role
    switch (user.role) {
      case 'vendor':
        return <Navigate to="/vendor/dashboard" />;
      case 'delivery_partner':
        return <Navigate to="/delivery/dashboard" />;
      case 'customer':
        return <Navigate to="/home" />;
      case 'admin':
        return <Navigate to="/admin/dashboard" />;
      default:
        return <Navigate to="/home" />;
    }
  }

  return children;
};

export default RoleBasedRoute;