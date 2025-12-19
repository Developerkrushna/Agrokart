import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Badge,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Button,
  InputBase,
  alpha,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  ShoppingBag as OrdersIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Storefront as SellerIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  // Category Icons
  Computer as ElectronicsIcon,
  Grass as FertilizersIcon,
  Agriculture as SeedsIcon,
  BugReport as PesticidesIcon,
  Build as ToolsIcon,
  Terrain as SoilIcon,
  Nature as BioIcon,
  Spa as OrganicIcon,
  MoreHoriz as MoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../LanguageSelector';
import AgrokartLogo from '../AgrokartLogo';

const categories = [
  { name: 'Electronics', icon: ElectronicsIcon, color: 'white' },
  { name: 'Fertilizers', icon: FertilizersIcon, color: '#FFE500' },
  { name: 'Seeds', icon: SeedsIcon, color: 'white' },
  { name: 'Pesticides', icon: PesticidesIcon, color: '#FFE500' },
  { name: 'Tools', icon: ToolsIcon, color: 'white' },
  { name: 'Soil', icon: SoilIcon, color: '#FFE500' },
  { name: 'Bio', icon: BioIcon, color: 'white' },
  { name: 'Organic', icon: OrganicIcon, color: '#FFE500' },
  { name: 'More', icon: MoreIcon, color: 'white' }
];

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [moreAnchorEl, setMoreAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = React.useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleMoreMenu = (event) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreAnchorEl(null);
  };

  // Search functionality with debouncing
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }

    // Trigger search when user types (debounced)
    if (query.length > 2) {
      window.searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 300); // 300ms delay
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit(event);
    }
  };

  // Enhanced search function with API calls
  const performSearch = async (query) => {
    setSearchLoading(true);
    try {
      // Try to fetch from API first
      const response = await fetch(`http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.products || []);
      } else {
        // Fallback to mock data if API fails
        performMockSearch(query);
      }
    } catch (error) {
      console.log('Search API error, using mock data:', error);
      // Fallback to mock data
      performMockSearch(query);
    } finally {
      setSearchLoading(false);
    }
  };

  // Fallback mock search function using real product data
  const performMockSearch = async (query) => {
    try {
      // Import mock products data
      const { mockProducts } = await import('../../data/mockProducts');

      const searchResults = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      ).map(product => ({
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.images?.[0],
        brand: product.brand
      }));

      setSearchResults(searchResults);
    } catch (error) {
      console.error('Error loading product data:', error);
      // Fallback to basic mock data
      const basicMockResults = [
        { id: 1, name: 'Premium Urea', category: 'Nitrogen Fertilizer', price: 850 },
        { id: 2, name: 'DAP Fertilizer', category: 'Phosphorus Fertilizer', price: 1200 },
        { id: 3, name: 'NPK 20:20:20', category: 'Balanced Fertilizer', price: 1100 },
        { id: 4, name: 'Organic Compost', category: 'Organic Fertilizer', price: 450 }
      ].filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(basicMockResults);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f1f3f6' }}>
      {/* Flipkart-style AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #388E3C 50%, #4CAF50 100%)',
          color: '#fff',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(46, 125, 50, 0.25)',
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64, px: { xs: 1, sm: 2 } }}>
            {/* AgiNet Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/home')}>
              <AgrokartLogo width={180} height={50} variant="full" color="white" />
            </Box>

            {/* Home Button */}
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/home')}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 1,
                px: 2,
                ml: 2,
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              {t('navigation.home')}
            </Button>

            {/* Search Bar */}
            <Box
              ref={searchRef}
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                flex: 1,
                mx: 3,
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 1,
                boxShadow: '0 1px 4px rgba(40,116,240,0.08)',
                px: 1,
                py: 0.5,
                maxWidth: 500,
                minWidth: 250,
                position: 'relative',
                width: '100%',
                height: 40
              }}
            >
              <InputBase
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                sx={{
                  color: '#212121',
                  width: '100%',
                  fontSize: 16,
                  minWidth: 200,
                  flex: 1,
                  px: 1,
                  '& input': {
                    padding: '8px 4px',
                    width: '100%',
                    minWidth: 200,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton
                type="submit"
                sx={{
                  color: '#2874f0',
                  ml: 1,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: alpha('#2874f0', 0.1)
                  }
                }}
              >
                <SearchIcon sx={{ fontSize: 20 }} />
              </IconButton>

              {/* Search Results Dropdown */}
              {(searchResults.length > 0 || searchLoading) && searchQuery.length > 2 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    borderRadius: 1,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    mt: 0.5,
                    maxHeight: 300,
                    overflow: 'auto'
                  }}
                >
                  {searchLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        Searching...
                      </Typography>
                    </Box>
                  ) : (
                    searchResults.slice(0, 5).map((result) => (
                    <Box
                      key={result.id}
                      onClick={() => {
                        navigate(`/products?search=${encodeURIComponent(result.name)}`);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        '&:hover': {
                          backgroundColor: '#f8f9fa'
                        },
                        '&:last-child': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      {result.image && (
                        <Box
                          component="img"
                          src={result.image}
                          alt={result.name}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {result.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {result.category} • ₹{result.price}
                        </Typography>
                        {result.brand && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            by {result.brand}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )))}
                  {searchResults.length > 5 && (
                    <Box
                      onClick={() => {
                        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        textAlign: 'center',
                        color: '#2874f0',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    >
                      View all {searchResults.length} results
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Login/Profile */}
              {user ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: '#ffe500',
                        color: '#2874f0',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      onClick={handleProfile}
                    >
                      {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                    </Avatar>
                    <IconButton
                      color="inherit"
                      onClick={handleMenu}
                      sx={{
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                      }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Box>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{ sx: { mt: 1.5, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
                  >
                    <MenuItem onClick={handleProfile}>
                      <PersonIcon sx={{ mr: 1 }} />
                      {t('navigation.profile')}
                    </MenuItem>
                    <MenuItem onClick={() => { handleClose(); navigate('/my-orders'); }}>
                      <OrdersIcon sx={{ mr: 1 }} />
                      My Orders
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      {t('navigation.logout')}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    bgcolor: '#fff',
                    color: '#2874f0',
                    borderRadius: 1,
                    px: 3,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#f1f3f6' }
                  }}
                >
                  {t('navigation.login')}
                </Button>
              )}



              {/* Become a Seller */}
              <Button
                color="inherit"
                startIcon={<SellerIcon />}
                sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 1, px: 2, display: { xs: 'none', md: 'flex' } }}
              >
                {t('navigation.becomeASeller')}
              </Button>
              {/* More */}
              <Button
                color="inherit"
                endIcon={<ExpandMoreIcon />}
                onClick={handleMoreMenu}
                sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 1, px: 2, display: { xs: 'none', md: 'flex' } }}
              >
                {t('navigation.more')}
              </Button>
              <Menu
                anchorEl={moreAnchorEl}
                open={Boolean(moreAnchorEl)}
                onClose={handleMoreClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { mt: 1.5, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
              >
                <MenuItem onClick={handleMoreClose}>24x7 Customer Care</MenuItem>
                <MenuItem onClick={handleMoreClose}>Advertise</MenuItem>
                <MenuItem onClick={handleMoreClose}>Download App</MenuItem>
              </Menu>
              {/* Language Selector */}
              <LanguageSelector variant="chip" size="small" />

              {/* Mobile Search Icon */}
              <IconButton
                color="inherit"
                onClick={() => setMobileSearchOpen(true)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.08)',
                  borderRadius: 1,
                  ml: 1,
                  display: { xs: 'flex', sm: 'none' }
                }}
              >
                <SearchIcon />
              </IconButton>

              {/* Cart */}
              <IconButton
                color="inherit"
                onClick={() => navigate('/cart')}
                sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 1, ml: 1 }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <CartIcon />
                </Badge>
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                  {t('navigation.cart')}
                </Typography>
              </IconButton>

              {/* My Orders - Only show for logged in users */}
              {user && (
                <IconButton
                  color="inherit"
                  onClick={() => navigate('/my-orders')}
                  sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 1, ml: 1 }}
                >
                  <OrdersIcon />
                  <Typography variant="body2" sx={{ ml: 1, fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                    My Orders
                  </Typography>
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
        {/* Category Navigation Bar */}
        <Divider sx={{ bgcolor: '#1B5E20', height: 1 }} />
        <Box sx={{ bgcolor: '#2E7D32', py: 0.5, px: { xs: 1, sm: 2 }, display: { xs: 'none', md: 'block' } }}>
          <Container maxWidth="lg" disableGutters>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Button
                    key={cat.name}
                    color="inherit"
                    onClick={() => {
                      if (cat.name === 'More') {
                        // Handle "More" category differently if needed
                        navigate('/products');
                      } else {
                        navigate(`/products?category=${encodeURIComponent(cat.name)}`);
                      }
                    }}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: 15,
                      px: 1.5,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': { bgcolor: '#1B5E20' },
                      cursor: 'pointer'
                    }}
                  >
                    <IconComponent
                      sx={{
                        fontSize: 18,
                        color: cat.color
                      }}
                    />
                    {cat.name}
                  </Button>
                );
              })}
            </Box>
          </Container>
        </Box>
      </AppBar>
      {/* Add space for the fixed AppBar */}
      <Toolbar sx={{ minHeight: 64 }} />
      <Box sx={{ height: 40, display: { xs: 'none', md: 'block' } }} />
      {/* Main Content */}
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#fff',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} {t('app.name')}. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Mobile Search Dialog */}
      <Dialog
        open={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            m: 2
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6">Search Products</Typography>
          <IconButton
            onClick={() => setMobileSearchOpen(false)}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box
            component="form"
            onSubmit={(e) => {
              handleSearchSubmit(e);
              setMobileSearchOpen(false);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: 1,
              px: 1,
              py: 1,
              mb: 2,
              height: 40
            }}
          >
            <InputBase
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                color: '#212121',
                width: '100%',
                fontSize: 16,
                flex: 1,
                '& input': {
                  padding: '8px 0',
                  width: '100%'
                }
              }}
              inputProps={{ 'aria-label': 'search' }}
              autoFocus
            />
            <IconButton
              type="submit"
              sx={{
                color: '#2874f0',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: alpha('#2874f0', 0.1)
                }
              }}
            >
              <SearchIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Mobile Search Results */}
          {searchResults.length > 0 && searchQuery.length > 2 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Search Results:
              </Typography>
              {searchResults.slice(0, 8).map((result) => (
                <Box
                  key={result.id}
                  onClick={() => {
                    navigate(`/products?search=${encodeURIComponent(result.name)}`);
                    setSearchQuery('');
                    setSearchResults([]);
                    setMobileSearchOpen(false);
                  }}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e9ecef'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {result.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {result.category}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MainLayout; 