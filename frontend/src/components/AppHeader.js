import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Container,
  useScrollTrigger,
  Slide,
  InputBase,
  Select
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  FavoriteOutlined as FavoriteIcon,
  NotificationsOutlined as NotificationIcon,
  SearchOutlined as SearchIcon,
  Agriculture as AgricultureIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MicIcon from '@mui/icons-material/Mic';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const AppHeader = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { cart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };

  const handleOrdersClick = () => {
    navigate('/my-orders');
    handleProfileMenuClose();
  };

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          backgroundColor: '#2874f0',
          color: 'white',
          borderBottom: '1px solid #e0e0e0',
          zIndex: 1201,
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ px: { xs: 1, sm: 2 }, minHeight: 64 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: '0 0 auto', mr: 2, cursor: 'pointer' }} onClick={() => navigate('/') }>
              <img src="/logo192.png" alt="AgriNet" style={{ height: 40, marginRight: 8 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, color: 'white', fontSize: '1.5rem' }}>
                AgriNet
              </Typography>
            </Box>
            {/* Search Bar */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: 2, width: { xs: '100%', sm: 480, md: 600 }, boxShadow: 1, px: 1 }}>
                <Select
                  defaultValue="all"
                  size="small"
                  sx={{ minWidth: 90, fontWeight: 600, color: '#2874f0', background: '#f1f3f6', borderRadius: 1, mr: 1, '& .MuiSelect-icon': { color: '#2874f0' } }}
                  disableUnderline
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="fertilizers">Fertilizers</MenuItem>
                  <MenuItem value="seeds">Seeds</MenuItem>
                  <MenuItem value="tools">Tools</MenuItem>
                  <MenuItem value="offers">Offers</MenuItem>
                </Select>
                <InputBase
                  placeholder="Search for products, brands and more"
                  sx={{ flex: 1, px: 1, fontSize: '1rem', color: '#222', fontWeight: 500 }}
                  inputProps={{ 'aria-label': 'search' }}
                />
                <IconButton sx={{ color: '#2874f0', ml: 1 }}>
                  <SearchIcon />
                </IconButton>
                <IconButton sx={{ color: '#2874f0', ml: 1 }}>
                  <MicIcon />
                </IconButton>
              </Box>
            </Box>
            {/* Cart and User */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" onClick={() => navigate('/cart')}>
                <Badge badgeContent={cartItemsCount} color="error">
                  <CartIcon />
                </Badge>
              </IconButton>
              {isAuthenticated ? (
                <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
                  <Avatar sx={{ bgcolor: '#2874f0', color: 'white', width: 36, height: 36, fontWeight: 700 }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              ) : (
                <Button
                  variant="contained"
                  sx={{ background: '#ffeb3b', color: '#2874f0', fontWeight: 700, ml: 1, borderRadius: 2, px: 3, boxShadow: 'none', '&:hover': { background: '#ffe033' } }}
                  startIcon={<PersonIcon />}
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              )}
            </Box>
            {/* Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 220,
                  borderRadius: 3,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <AccountIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleOrdersClick} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>My Orders</ListItemText>
              </MenuItem>
              <MenuItem sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <FavoriteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Wishlist</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
        {/* Category Navigation Bar */}
        <Box sx={{ background: '#1565c0', px: 2, py: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
          {['Fertilizers', 'Seeds', 'Tools', 'Compost', 'Offers', 'Best Sellers', 'New Arrivals'].map((cat) => (
            <Button key={cat} sx={{ color: 'white', fontWeight: 600, fontSize: '1rem', textTransform: 'none', px: 2, borderRadius: 2, '&:hover': { background: '#1976d2' } }}>
              {cat}
            </Button>
          ))}
        </Box>
      </AppBar>
    </HideOnScroll>
  );
};

export default AppHeader;