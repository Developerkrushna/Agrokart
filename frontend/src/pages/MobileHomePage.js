import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Paper,
  Skeleton,
  useTheme,
  useMediaQuery,
  Stack,
  alpha,
  keyframes,
  Fade,
  Slide
} from '@mui/material';
import {
  LocationOn,
  Search,
  LocalOffer,
  TrendingUp,
  Star,
  ShoppingCart,
  Favorite,
  Category,
  Refresh,
  Agriculture,
  RocketLaunch,
  AutoAwesome,
  Verified,
  FlashOn
} from '@mui/icons-material';
import MobileLayout from '../components/MobileLayout';
import MobileSearch from '../components/MobileSearch';
import MobileProductCard from '../components/MobileProductCard';
import { useMobile } from '../context/MobileContext';
import { useNotifications } from '../context/NotificationProvider';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Modern animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const MobileHomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { addToCart, cart, cartCount } = useCart();
  const { showNotification } = useNotifications();
  const { 
    vibrate, 
    getCurrentLocation, 
    showToast,
    isNative 
  } = useMobile();

  const [location, setLocation] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    loadHomeData();
    detectLocation();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setProducts([
        {
          id: 1,
          name: 'Premium Urea Fertilizer',
          price: 850,
          originalPrice: 1000,
          image: '/api/placeholder/300/300',
          vendorName: 'Agrokart Premium',
          rating: 4.5,
          reviewCount: 128,
          stock: 50,
          category: 'Fertilizers',
          isPopular: true,
          discount: 15
        },
        {
          id: 2,
          name: 'DAP Fertilizer',
          price: 1200,
          image: '/api/placeholder/300/300',
          vendorName: 'Agrokart Premium',
          rating: 4.8,
          reviewCount: 89,
          stock: 25,
          category: 'Fertilizers',
          isOrganic: true
        },
        {
          id: 3,
          name: 'NPK 20:20:20',
          price: 1100,
          originalPrice: 1300,
          image: '/api/placeholder/300/300',
          vendorName: 'Agrokart Premium',
          rating: 4.7,
          reviewCount: 156,
          stock: 40,
          category: 'Fertilizers',
          discount: 15
        },
        {
          id: 4,
          name: 'Organic Compost',
          price: 450,
          image: '/api/placeholder/300/300',
          vendorName: 'Agrokart Premium',
          rating: 4.9,
          reviewCount: 203,
          stock: 60,
          category: 'Organic',
          isOrganic: true
        }
      ]);

      setCategories([
        { id: 1, name: 'Urea', icon: '🌱', count: 150, color: '#16A34A' },
        { id: 2, name: 'DAP', icon: '🌾', count: 89, color: '#8B5CF6' },
        { id: 3, name: 'NPK', icon: '🌿', count: 65, color: '#F97316' },
        { id: 4, name: 'Organic', icon: '🍃', count: 45, color: '#10B981' }
      ]);

      setBanners([
        {
          id: 1,
          title: 'Premium Fertilizers',
          subtitle: 'Up to 30% off',
          image: '/api/placeholder/800/300',
          action: '/category/fertilizers',
          gradient: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)'
        },
        {
          id: 2,
          title: 'Organic Products',
          subtitle: 'Farm Fresh Quality',
          image: '/api/placeholder/800/300',
          action: '/category/organic',
          gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
        }
      ]);
      
    } catch (error) {
      console.error('Failed to load home data:', error);
      await showToast('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = async () => {
    try {
      const position = await getCurrentLocation();
      if (position) {
        setLocation(`${position.latitude.toFixed(2)}, ${position.longitude.toFixed(2)}`);
      }
    } catch (error) {
      console.error('Location detection error:', error);
      setLocation('Location not available');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await vibrate('light');
    await loadHomeData();
    setRefreshing(false);
    await showToast('Data refreshed');
  };

  const handleSearch = async (searchTerm, filters) => {
    await vibrate('light');
    console.log('Search:', searchTerm, filters);
  };

  const handleCategoryClick = async (category) => {
    await vibrate('light');
    console.log('Category clicked:', category);
  };

  const handleAddToCart = async (product, quantity) => {
    await addToCart(product, quantity);
    await showNotification({
      title: 'Added to Cart',
      body: `${quantity} ${product.name} added to cart`,
      type: 'success'
    });
  };

  const handleToggleFavorite = async (product) => {
    await vibrate('light');
    await showToast('Added to favorites');
  };

  // Glassmorphism style
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  if (loading) {
    return (
      <MobileLayout>
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ my: 2, borderRadius: 3 }} />
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={6} key={item}>
                <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      user={user}
      onLogout={logout}
      cartCount={cartCount}
      showNavigation={true}
    >
      {/* Futuristic Header Section */}
      <Box 
        sx={{ 
          px: 2, 
          pt: 2, 
          pb: 1,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          borderRadius: '0 0 24px 24px',
          mb: 2
        }}
      >
        {/* Location and Refresh */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn 
              sx={{ 
                mr: 1, 
                color: theme.palette.primary.main,
                animation: `${pulse} 2s ease-in-out infinite`
              }} 
            />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {location || 'Detecting location...'}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                transform: 'rotate(180deg)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Refresh />
          </IconButton>
        </Box>

        {/* Welcome Message with Gradient */}
        <Fade in={isVisible} timeout={800}>
          <Box>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Hello, {user?.name || 'Guest'}! 👋
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              What premium fertilizers are you looking for today?
            </Typography>
          </Box>
        </Fade>

        {/* Search */}
        <MobileSearch
          onSearch={handleSearch}
          categories={categories}
          recentSearches={['Urea', 'DAP', 'NPK', 'Organic']}
          popularSearches={['Premium fertilizers', 'Organic compost', 'NPK 20:20:20', 'DAP fertilizer']}
        />
      </Box>

      {/* Futuristic Banners */}
      <Box sx={{ px: 2, py: 2 }}>
        <Grid container spacing={2}>
          {banners.map((banner, index) => (
            <Grid item xs={12} key={banner.id}>
              <Slide direction="right" in={isVisible} timeout={600 + index * 200}>
                <Card 
                  sx={{ 
                    position: 'relative', 
                    height: 180, 
                    overflow: 'hidden',
                    borderRadius: 4,
                    background: banner.gradient,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      px: 3,
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <Chip
                      icon={<AutoAwesome sx={{ fontSize: 16 }} />}
                      label="Featured"
                      sx={{
                        mb: 1,
                        bgcolor: alpha('#fff', 0.2),
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Typography 
                      variant="h5" 
                      fontWeight="bold" 
                      color="white" 
                      gutterBottom
                      sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                    >
                      {banner.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="white" 
                      paragraph
                      sx={{ opacity: 0.95, mb: 2 }}
                    >
                      {banner.subtitle}
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small"
                      sx={{
                        bgcolor: '#fff',
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2,
                        '&:hover': {
                          bgcolor: alpha('#fff', 0.9),
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      Shop Now
                    </Button>
                  </Box>
                  
                  {/* Decorative Elements */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      bgcolor: alpha('#fff', 0.1),
                      animation: `${pulse} 3s ease-in-out infinite`
                    }}
                  />
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modern Categories */}
      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="h6" 
            fontWeight="bold"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Categories
          </Typography>
          <Button 
            size="small" 
            endIcon={<Category />}
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            View All
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <Grid item xs={3} key={category.id}>
              <Fade in={isVisible} timeout={400 + index * 100}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(category.color, 0.1)} 0%, ${alpha(category.color, 0.05)} 100%)`,
                    border: `2px solid ${alpha(category.color, 0.2)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 24px ${alpha(category.color, 0.2)}`,
                      borderColor: category.color
                    },
                    '&:active': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => handleCategoryClick(category)}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 1,
                      animation: `${float} 3s ease-in-out infinite ${index * 0.2}s`
                    }}
                  >
                    {category.icon}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    fontWeight="bold" 
                    display="block"
                    sx={{ color: category.color }}
                  >
                    {category.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: '0.65rem' }}
                  >
                    {category.count} items
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Products */}
      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="h6" 
            fontWeight="bold"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Featured Products
          </Typography>
          <Button 
            size="small" 
            endIcon={<TrendingUp />}
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            View All
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          {products.map((product, index) => (
            <Grid item xs={6} key={product.id}>
              <Fade in={isVisible} timeout={600 + index * 100}>
                <Box>
                  <MobileProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    compact={true}
                  />
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick Actions with Glassmorphism */}
      <Box sx={{ px: 2, py: 2 }}>
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          gutterBottom
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Quick Actions
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                border: `2px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.warning.main, 0.2)}`,
                  borderColor: theme.palette.warning.main
                }
              }}
            >
              <LocalOffer 
                sx={{ 
                  fontSize: 40, 
                  mb: 1,
                  color: theme.palette.warning.main,
                  animation: `${pulse} 2s ease-in-out infinite`
                }} 
              />
              <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.warning.main }}>
                Special Offers
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <Star 
                sx={{ 
                  fontSize: 40, 
                  mb: 1,
                  color: theme.palette.primary.main,
                  animation: `${pulse} 2s ease-in-out infinite 0.5s`
                }} 
              />
              <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
                Top Rated
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom Spacing for Navigation */}
      <Box sx={{ height: 80 }} />
    </MobileLayout>
  );
};

export default MobileHomePage;
