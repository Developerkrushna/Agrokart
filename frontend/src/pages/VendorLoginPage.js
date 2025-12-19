import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Business as BusinessIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  TrendingUp as EarningsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AgrokartLogo from '../components/AgrokartLogo';

const VendorLoginPage = () => {
  const navigate = useNavigate();
  const { login: authLogin, setRole } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set role to vendor when component mounts
    setRole('vendor');
  }, [setRole]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authLogin(formData.email, formData.password);
      navigate('/vendor/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const vendorFeatures = [
    {
      icon: DashboardIcon,
      title: 'Vendor Dashboard',
      description: 'Manage your business overview and analytics'
    },
    {
      icon: InventoryIcon,
      title: 'Inventory Management',
      description: 'Add and manage your agricultural products'
    },
    {
      icon: EarningsIcon,
      title: 'Earnings Tracking',
      description: 'Track sales, commissions, and payments'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F0FDF4 0%, #FFF8E1 50%, #FFF3E0 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
              {/* Logo and Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <AgrokartLogo size="medium" />
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  sx={{
                    mt: 2,
                    mb: 1,
                    background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Vendor Login
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Access your agricultural business dashboard
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Business Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<LoginIcon />}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mb: 3,
                    background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #F57C00, #E65100)'
                    }
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In to Dashboard'}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    New to Agrokart? Register your business to start selling agricultural products
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<RegisterIcon />}
                  component={Link}
                  to="/vendor/register"
                  sx={{
                    py: 1.5,
                    borderColor: '#FF9800',
                    color: '#FF9800',
                    '&:hover': {
                      borderColor: '#F57C00',
                      backgroundColor: 'rgba(255, 152, 0, 0.04)'
                    }
                  }}
                >
                  Register Your Business
                </Button>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  <Link to="/login" style={{ color: '#FF9800', textDecoration: 'none' }}>
                    ← Back to Role Selection
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right Side - Features */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pl: { md: 4 } }}>
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{
                  background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Grow Your Agricultural Business
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Join thousands of vendors selling agricultural products on Agrokart
              </Typography>

              <Grid container spacing={3}>
                {vendorFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Grid item xs={12} key={index}>
                      <Card
                        sx={{
                          p: 2,
                          border: '1px solid #e0e0e0',
                          '&:hover': {
                            boxShadow: 4,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      >
                        <CardContent sx={{ p: '16px !important' }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                mr: 2
                              }}
                            >
                              <IconComponent sx={{ color: '#FF9800', fontSize: 28 }} />
                            </Box>
                            <Box>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {feature.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {feature.description}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              <Box sx={{ mt: 4, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#FF9800' }}>
                  🌾 Why Choose Agrokart?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Reach thousands of farmers and agricultural businesses<br/>
                  • Easy inventory management and order processing<br/>
                  • Competitive commission rates and fast payments<br/>
                  • Dedicated vendor support and business analytics
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default VendorLoginPage;
