import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  useTheme,
  alpha,
  Fade,
  Zoom
} from '@mui/material';
import {
  Person as CustomerIcon,
  Business as VendorIcon,
  LocalShipping as DeliveryIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AgriNetLogo from './AgriNetLogo';

const RoleSelectionPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { selectRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAnimation, setShowAnimation] = useState(true);

  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'Shop for Agricultural Products',
      description: 'Browse fertilizers, seeds, tools and place orders for delivery to your farm',
      icon: CustomerIcon,
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      route: '/auth/login?role=customer',
      features: ['Browse Products', 'Place Orders', 'Track Deliveries', 'AI Assistant']
    },
    {
      id: 'vendor',
      title: 'Vendor/Farmer',
      subtitle: 'Sell Your Products',
      description: 'Register your business, manage inventory and sell agricultural products',
      icon: VendorIcon,
      color: '#FF9800',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      route: '/vendor/login',
      features: ['Manage Inventory', 'Process Orders', 'Track Earnings', 'Business Analytics']
    },
    {
      id: 'delivery',
      title: 'Delivery Partner',
      subtitle: 'Earn by Delivering',
      description: 'Join our delivery network and earn money by delivering agricultural products',
      icon: DeliveryIcon,
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      route: '/delivery/register',
      features: ['Accept Deliveries', 'Route Optimization', 'Earn Money', 'Flexible Schedule']
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
    selectRole(role.id);

    // Add a small delay for better UX
    setTimeout(() => {
      navigate(role.route);
    }, 300);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F0FDF4 0%, #E6F3FF 50%, #F3E8FF 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Fade in={showAnimation} timeout={1000}>
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Zoom in={showAnimation} timeout={1200}>
                <Box sx={{ mb: 3 }}>
                  <AgriNetLogo size="large" />
                </Box>
              </Zoom>
              
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  mb: 2,
                  background: 'linear-gradient(135deg, #4CAF50, #2196F3)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center'
                }}
              >
                Welcome to AgriNet
              </Typography>
              
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Three-Sided Agricultural Marketplace
              </Typography>
              
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: 'auto' }}
              >
                Choose your role to access the marketplace designed for farmers, vendors, and delivery partners
              </Typography>
            </Box>

            {/* Role Selection Cards */}
            <Grid container spacing={4} justifyContent="center">
              {roles.map((role, index) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.id;
                
                return (
                  <Grid item xs={12} md={4} key={role.id}>
                    <Zoom in={showAnimation} timeout={1000 + (index * 200)}>
                      <Card
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '2px solid transparent',
                          background: isSelected ? role.gradient : 'white',
                          color: isSelected ? 'white' : 'inherit',
                          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                          boxShadow: isSelected 
                            ? `0 20px 40px ${alpha(role.color, 0.3)}`
                            : '0 4px 20px rgba(0,0,0,0.1)',
                          '&:hover': {
                            transform: 'translateY(-8px) scale(1.02)',
                            boxShadow: `0 20px 40px ${alpha(role.color, 0.2)}`,
                            border: `2px solid ${role.color}`
                          }
                        }}
                        onClick={() => handleRoleSelect(role)}
                      >
                        <CardContent sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                          {/* Icon */}
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              background: isSelected 
                                ? 'rgba(255,255,255,0.2)' 
                                : alpha(role.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 3,
                              border: isSelected 
                                ? '2px solid rgba(255,255,255,0.3)'
                                : `2px solid ${alpha(role.color, 0.2)}`
                            }}
                          >
                            <IconComponent 
                              sx={{ 
                                fontSize: 40, 
                                color: isSelected ? 'white' : role.color 
                              }} 
                            />
                          </Box>

                          {/* Title */}
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{ mb: 1 }}
                          >
                            {role.title}
                          </Typography>

                          {/* Subtitle */}
                          <Typography
                            variant="subtitle1"
                            sx={{ 
                              mb: 2,
                              opacity: isSelected ? 0.9 : 0.7,
                              fontWeight: 500
                            }}
                          >
                            {role.subtitle}
                          </Typography>

                          {/* Description */}
                          <Typography
                            variant="body2"
                            sx={{ 
                              mb: 3,
                              opacity: isSelected ? 0.9 : 0.8,
                              lineHeight: 1.6
                            }}
                          >
                            {role.description}
                          </Typography>

                          {/* Features */}
                          <Box sx={{ mb: 3 }}>
                            {role.features.map((feature, idx) => (
                              <Typography
                                key={idx}
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  mb: 0.5,
                                  opacity: isSelected ? 0.9 : 0.7,
                                  fontSize: '0.75rem'
                                }}
                              >
                                ✓ {feature}
                              </Typography>
                            ))}
                          </Box>

                          {/* Action Button */}
                          <Button
                            variant={isSelected ? "outlined" : "contained"}
                            fullWidth
                            endIcon={<ArrowIcon />}
                            sx={{
                              mt: 'auto',
                              py: 1.5,
                              fontWeight: 'bold',
                              background: isSelected 
                                ? 'rgba(255,255,255,0.2)' 
                                : role.gradient,
                              color: isSelected ? 'white' : 'white',
                              border: isSelected ? '2px solid rgba(255,255,255,0.5)' : 'none',
                              '&:hover': {
                                background: isSelected 
                                  ? 'rgba(255,255,255,0.3)' 
                                  : role.gradient,
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            Get Started
                          </Button>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                );
              })}
            </Grid>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="body2" color="text.secondary">
                © 2025 AgriNet. All rights reserved.
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Connecting farmers, vendors, and delivery partners across India
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default RoleSelectionPage;
