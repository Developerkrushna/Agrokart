import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Container,
  Paper,
  Chip
} from '@mui/material';
import {
  ShoppingCart as CustomerIcon,
  Business as VendorIcon,
  LocalShipping as DeliveryIcon,
  TrendingUp as EarningsIcon,
  Star as RatingIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const MarketplaceNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const marketplaceSides = [
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'Shop for agricultural products',
      description: 'Browse fertilizers, seeds, and farming equipment from verified vendors',
      icon: CustomerIcon,
      color: 'primary',
      features: [
        'Browse products',
        'Compare prices',
        'Track orders',
        'Rate vendors'
      ],
      actions: [
        { label: 'Start Shopping', path: '/home', variant: 'contained' },
        { label: 'View Orders', path: '/my-orders', variant: 'outlined' }
      ]
    },
    {
      id: 'vendor',
      title: 'Vendor/Seller',
      subtitle: 'Sell your agricultural products',
      description: 'Join our marketplace as a vendor and reach thousands of farmers',
      icon: VendorIcon,
      color: 'success',
      features: [
        'Manage inventory',
        'Process orders',
        'Track earnings',
        'Customer analytics'
      ],
      actions: [
        { label: 'Become a Vendor', path: '/vendor/register', variant: 'contained' },
        { label: 'Vendor Login', path: '/vendor/dashboard', variant: 'outlined' }
      ]
    },
    {
      id: 'delivery',
      title: 'Delivery Partner',
      subtitle: 'Earn by delivering orders',
      description: 'Join our delivery network and earn money by delivering agricultural products',
      icon: DeliveryIcon,
      color: 'info',
      features: [
        'Flexible schedule',
        'Route optimization',
        'Instant payments',
        'Performance tracking'
      ],
      actions: [
        { label: 'Join as Delivery Partner', path: '/delivery/register', variant: 'contained' },
        { label: 'Delivery Dashboard', path: '/delivery/dashboard', variant: 'outlined' }
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getUserRole = () => {
    if (!user) return null;
    return user.role;
  };

  const isUserLoggedIn = () => {
    return !!user;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          AgriNet Marketplace
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          A complete three-sided marketplace connecting farmers, vendors, and delivery partners
        </Typography>
        
        {isUserLoggedIn() && (
          <Chip
            label={`Logged in as: ${getUserRole()?.toUpperCase()}`}
            color="primary"
            icon={<VerifiedIcon />}
            sx={{ mt: 2 }}
          />
        )}
      </Box>

      {/* Marketplace Sides */}
      <Grid container spacing={4}>
        {marketplaceSides.map((side) => {
          const IconComponent = side.icon;
          const isCurrentUserRole = getUserRole() === side.id;
          
          return (
            <Grid item xs={12} md={4} key={side.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: isCurrentUserRole ? 2 : 1,
                  borderColor: isCurrentUserRole ? `${side.color}.main` : 'divider',
                  boxShadow: isCurrentUserRole ? 4 : 1,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                {isCurrentUserRole && (
                  <Chip
                    label="Your Role"
                    color={side.color}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1
                    }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Icon and Title */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconComponent
                      sx={{
                        fontSize: 40,
                        color: `${side.color}.main`,
                        mr: 2
                      }}
                    />
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {side.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {side.subtitle}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography variant="body1" paragraph>
                    {side.description}
                  </Typography>

                  {/* Features */}
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Key Features:
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {side.features.map((feature, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 0.5
                        }}
                      >
                        • {feature}
                      </Typography>
                    ))}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {side.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant}
                        color={side.color}
                        fullWidth
                        onClick={() => handleNavigation(action.path)}
                        disabled={isUserLoggedIn() && getUserRole() !== side.id && action.variant === 'outlined'}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Statistics Section */}
      <Paper sx={{ p: 4, mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Marketplace Statistics
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={3}>
            <Box>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                1000+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Active Customers
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box>
              <Typography variant="h3" fontWeight="bold" color="success.main">
                150+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Verified Vendors
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box>
              <Typography variant="h3" fontWeight="bold" color="info.main">
                75+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Delivery Partners
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box>
              <Typography variant="h3" fontWeight="bold" color="warning.main">
                5000+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Orders Delivered
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Call to Action */}
      {!isUserLoggedIn() && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Ready to Join AgriNet?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Choose your role and start your journey with India's leading agricultural marketplace
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
            >
              Register as Customer
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/vendor/register')}
            >
              Become a Vendor
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/delivery/register')}
            >
              Join as Delivery Partner
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default MarketplaceNavigation;
