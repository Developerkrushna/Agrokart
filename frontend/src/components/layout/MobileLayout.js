import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Container,
  useTheme,
  alpha,
  Collapse,
  Fade
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  ShoppingCart as CartIcon,
  Receipt as OrdersIcon,
  Person as ProfileIcon,
  Notifications as NotificationIcon,
  Menu as MenuIcon,
  Engineering as LaborIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  LocalShipping as DeliveryIcon,
  Store as MarketplaceIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import AgrokartLogo from '../AgrokartLogo';

const MobileLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  // Bottom navigation value based on current route
  const getBottomNavValue = () => {
    const path = location.pathname;
    if (path === '/home' || path === '/') return 0;
    if (path === '/my-orders') return 1;
    if (path.startsWith('/marketplace') || path.startsWith('/vendor') || path.startsWith('/delivery') || path === '/labor' || path === '/labour') return 2;
    if (path === '/cart') return 3;
    if (path === '/profile') return 4;
    return 0;
  };

  const handleBottomNavChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/home');
        break;
      case 1:
        navigate('/my-orders');
        break;
      case 2:
        navigate('/marketplace');
        break;
      case 3:
        navigate('/cart');
        break;
      case 4:
        navigate('/profile');
        break;
      default:
        navigate('/home');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchIconClick = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #E6F3FF 50%, #F3E8FF 100%)', // Very light green to purple gradient
    }}>
      {/* Modern Top App Bar - Flipkart Style */}
      <AppBar
        position="fixed"
        sx={{
          background: '#16A34A', // Solid green background like the image
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: theme.zIndex.drawer + 1,
          borderRadius: 0 // No rounded corners
        }}
      >
        {/* Main Navigation Bar */}
        <Toolbar sx={{ px: 2, minHeight: '56px !important', justifyContent: 'space-between' }}>
          {/* Left Section - Menu + Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {/* Hamburger Menu */}
            <IconButton
              size="medium"
              color="inherit"
              sx={{
                mr: 2,
                p: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>

            {/* Brand Name */}
            <Box
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              onClick={() => navigate('/home')}
            >
              <AgrokartLogo width={100} height={28} variant="full" color="white" />
            </Box>
          </Box>

          {/* Right Section - Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Search Icon */}
            <IconButton
              size="medium"
              color="inherit"
              onClick={handleSearchIconClick}
              sx={{
                p: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <SearchIcon sx={{ fontSize: 24 }} />
            </IconButton>

            {/* Notification Icon */}
            <IconButton
              size="medium"
              color="inherit"
              sx={{
                p: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <Badge
                badgeContent={2}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    minWidth: 18,
                    height: 18
                  }
                }}
              >
                <NotificationIcon sx={{ fontSize: 24 }} />
              </Badge>
            </IconButton>

            {/* Profile Picture */}
            <IconButton
              size="medium"
              onClick={() => navigate('/profile')}
              sx={{
                p: 0.5,
                ml: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255,255,255,0.3)',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Box>
            </IconButton>
          </Box>
        </Toolbar>

        {/* Expandable Search Bar */}
        <Collapse in={searchOpen} timeout={300}>
          <Box
            sx={{
              background: '#16A34A',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              px: 2,
              py: 1
            }}
          >
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 2,
                px: 2,
                py: 1
              }}
            >
              {/* Back Button */}
              <IconButton
                size="small"
                onClick={handleSearchClose}
                sx={{
                  mr: 1,
                  p: 0.5,
                  color: '#666'
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 20 }} />
              </IconButton>

              {/* Search Input */}
              <InputBase
                placeholder="Search for fertilizers, seeds, tools & more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                sx={{
                  flex: 1,
                  fontSize: '16px',
                  color: '#333',
                  '&::placeholder': {
                    color: '#888',
                    opacity: 1
                  }
                }}
              />

              {/* Clear Button */}
              {searchQuery && (
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery('')}
                  sx={{
                    p: 0.5,
                    color: '#666'
                  }}
                >
                  <ClearIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}

              {/* Search Button */}
              <IconButton
                type="submit"
                size="small"
                sx={{
                  ml: 1,
                  p: 0.5,
                  color: '#16A34A'
                }}
              >
                <SearchIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Collapse>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: searchOpen ? '112px' : '56px', // Adjust for expanded search bar
          pb: '56px', // Height of BottomNavigation
          minHeight: '100vh',
          background: 'transparent', // Use parent background
          transition: 'padding-top 0.3s ease'
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.drawer + 1,
          borderTop: '1px solid #e0e0e0',
          borderRadius: 0 // Remove rounded corners
        }}
        elevation={3}
      >
        <BottomNavigation
          value={getBottomNavValue()}
          onChange={handleBottomNavChange}
          sx={{
            height: 56,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 12px 8px',
              '&.Mui-selected': {
                color: '#16A34A', // Green color from theme
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                  fontWeight: 600
                }
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                fontWeight: 500
              }
            }
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Orders"
            icon={<OrdersIcon />}
          />
          <BottomNavigationAction
            label="Marketplace"
            icon={<MarketplaceIcon />}
          />
          <BottomNavigationAction
            label="Cart"
            icon={
              <Badge badgeContent={cartCount} color="error">
                <CartIcon />
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Profile"
            icon={<ProfileIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MobileLayout;
