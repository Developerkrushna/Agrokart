import React, { useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Home,
  Search,
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Notifications,
  Settings,
  ExitToApp,
  LocationOn
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMobile } from '../context/MobileContext';

const MobileNavigation = ({ user, onLogout, cartCount = 0, notificationCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isNative, vibrate, showToast } = useMobile();
  const [anchorEl, setAnchorEl] = useState(null);

  // Bottom navigation paths for different user roles
  const getNavigationItems = () => {
    const role = user?.role || 'customer';
    
    switch (role) {
      case 'vendor':
        return [
          { label: 'Dashboard', value: '/vendor-dashboard', icon: Home },
          { label: 'Products', value: '/vendor/products', icon: Search },
          { label: 'Orders', value: '/vendor/orders', icon: ShoppingCart },
          { label: 'Profile', value: '/vendor/profile', icon: Person }
        ];
      case 'delivery':
        return [
          { label: 'Dashboard', value: '/delivery-dashboard', icon: Home },
          { label: 'Routes', value: '/delivery/routes', icon: LocationOn },
          { label: 'Orders', value: '/delivery/orders', icon: ShoppingCart },
          { label: 'Profile', value: '/delivery/profile', icon: Person }
        ];
      default: // customer
        return [
          { label: 'Home', value: '/', icon: Home },
          { label: 'Search', value: '/search', icon: Search },
          { label: 'Cart', value: '/cart', icon: ShoppingCart },
          { label: 'Profile', value: '/profile', icon: Person }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const handleNavigationChange = async (event, newValue) => {
    await vibrate('light');
    navigate(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = async (action) => {
    await vibrate('light');
    handleMenuClose();
    
    switch (action) {
      case 'notifications':
        navigate('/notifications');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        if (onLogout) {
          await showToast('Logged out successfully');
          onLogout();
        }
        break;
      default:
        break;
    }
  };

  // Get current navigation value
  const getCurrentValue = () => {
    const currentPath = location.pathname;
    const matchingItem = navigationItems.find(item => 
      currentPath === item.value || currentPath.startsWith(item.value)
    );
    return matchingItem ? matchingItem.value : navigationItems[0].value;
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000,
      bgcolor: 'background.paper',
      borderTop: 1,
      borderColor: 'divider'
    }}>
      {/* Top App Bar for mobile */}
      <AppBar 
        position="fixed" 
        sx={{ 
          top: 0,
          bgcolor: 'primary.main',
          display: { xs: 'block', md: 'none' }
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, color: 'white', fontSize: '1.5rem' }}>
            Agrokart
          </Typography>
          
          {/* Notifications */}
          <IconButton 
            color="inherit" 
            onClick={() => handleMenuItemClick('notifications')}
          >
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          {/* User Menu */}
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            edge="end"
          >
            {user?.profilePhoto ? (
              <Avatar 
                src={user.profilePhoto} 
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleMenuClose} disabled>
          <ListItemText
            primary={user?.name || 'User'}
            secondary={user?.email}
          />
        </MenuItem>
        <Divider />
        
        <MenuItem onClick={() => handleMenuItemClick('notifications')}>
          <ListItemIcon>
            <Badge badgeContent={notificationCount} color="error">
              <Notifications fontSize="small" />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuItemClick('settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => handleMenuItemClick('logout')}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleNavigationChange}
        showLabels
        sx={{
          height: 70,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 0,
            padding: '6px 12px 8px',
            '&.Mui-selected': {
              color: 'primary.main',
            }
          }
        }}
      >
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          let badge = null;
          
          // Add badges for specific items
          if (item.value.includes('cart') && cartCount > 0) {
            badge = cartCount;
          }
          
          return (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={
                badge ? (
                  <Badge badgeContent={badge} color="error">
                    <IconComponent />
                  </Badge>
                ) : (
                  <IconComponent />
                )
              }
            />
          );
        })}
      </BottomNavigation>
    </Box>
  );
};

export default MobileNavigation;