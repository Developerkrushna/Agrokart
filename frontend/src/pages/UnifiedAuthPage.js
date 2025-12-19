import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  useTheme,
  alpha,
  Fade,
  Zoom
} from '@mui/material';
import {
  Person as CustomerIcon,
  Business as VendorIcon,
  LocalShipping as DeliveryIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AgriNetLogo from '../components/AgriNetLogo';
import { auth } from '../config/firebase';

const UnifiedAuthPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, register, setRole } = useAuth();
  
  useEffect(() => {
    // Test Firebase auth status on component mount
    console.log('🔍 Firebase auth object:', auth);
    console.log('🔍 Current Firebase user:', auth.currentUser);
    
    // Removed external network HEAD test to avoid console errors on restricted networks
  }, []);
  
  const [selectedRole, setSelectedRole] = useState('customer');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const roles = [
    {
      id: 'customer',
      title: 'Customer/Farmer',
      subtitle: 'Buy Agricultural Products',
      description: 'Shop for fertilizers, seeds, tools and get them delivered to your farm',
      icon: CustomerIcon,
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      loginRoute: '/home',
      registerRoute: '/register'
    },
    {
      id: 'vendor',
      title: 'Vendor/Supplier',
      subtitle: 'Sell Your Products',
      description: 'Register your business and sell agricultural products to farmers',
      icon: VendorIcon,
      color: '#FF9800',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      loginRoute: '/vendor/dashboard',
      registerRoute: '/vendor/register'
    },
    {
      id: 'delivery',
      title: 'Delivery Partner',
      subtitle: 'Earn by Delivering',
      description: 'Join our delivery network and earn money by delivering products',
      icon: DeliveryIcon,
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      loginRoute: '/delivery/dashboard',
      registerRoute: '/delivery/register'
    }
  ];

  const selectedRoleData = roles.find(role => role.id === selectedRole);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setRole(roleId);
    setError('');
    setSuccess('');
  };

  const handleAuthModeChange = (event, newMode) => {
    setAuthMode(newMode);
    setError('');
    setSuccess('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
  };

  // Direct Firebase test function - bypasses the regular flow
  const testFirebaseAuth = async () => {
    try {
      console.log('🧪 Testing direct Firebase authentication');
      const testEmail = 'test' + Date.now() + '@example.com';
      const testPassword = 'Test123456';
      
      console.log('🧪 Test credentials:', { testEmail, testPassword });
      
      // Test network connectivity first
      try {
        console.log('🌐 Testing general network connectivity...');
        const networkResponse = await fetch('https://www.google.com/generate_204');
        console.log('🌐 Network connectivity test result:', networkResponse.status);
        if (networkResponse.status !== 204) {
          console.warn('⚠️ Network connectivity issue detected:', networkResponse.status);
        }
      } catch (networkError) {
        console.error('❌ Network connectivity test failed:', networkError);
      }
      
      // Test Firebase API connectivity
      try {
        console.log('🧪 Testing Firebase API connectivity...');
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + 
          'AIzaSyDAMtYm61y2d3YzLBoo1m4K7V1lsJI3lyY', {
          method: 'OPTIONS'
        });
        console.log('🧪 Firebase API connectivity test result:', {
          status: response.status,
          ok: response.ok,
          headers: [...response.headers.entries()]
        });
      } catch (error) {
        console.error('🧪 Firebase API connectivity test failed:', error);
      }
      
      // Import Firebase auth functions directly
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      
      console.log('🧪 Attempting direct Firebase registration');
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('🧪 Direct Firebase registration successful:', userCredential.user);
      
      return { success: true, message: 'Direct Firebase test successful' };
    } catch (error) {
      console.error('🧪 Direct Firebase test failed:', error);
      return { success: false, error };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔄 Form submission started');
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Test direct Firebase auth first if it's a registration
      if (authMode === 'register' && selectedRole === 'customer') {
        console.log('🧪 Running direct Firebase test before registration');
        const testResult = await testFirebaseAuth();
        console.log('🧪 Direct Firebase test result:', testResult);
        
        if (!testResult.success) {
          throw new Error('Firebase direct test failed: ' + testResult.error?.message);
        }
      }
      
      if (authMode === 'login') {
        // Handle Login with Firebase
        console.log('🔍 UnifiedAuth Login attempt:', {
          email: formData.email,
          passwordLength: formData.password.length,
          selectedRole: selectedRole
        });

        const result = await login(formData.email, formData.password);
        console.log('✅ UnifiedAuth Login result:', result);

        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate(selectedRoleData.loginRoute);
        }, 1500);
      } else {
        // Handle Registration
        console.log('🔄 Registration process started');
        
        // Check if password meets minimum requirements
        if (formData.password.length < 6) {
          console.error('❌ Password too short during registration');
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          console.log('❌ Passwords do not match');
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (selectedRole === 'vendor' || selectedRole === 'delivery') {
          // Redirect to detailed registration for vendor/delivery
          console.log('🔄 Redirecting to detailed registration:', {
            role: selectedRole,
            route: selectedRoleData.registerRoute,
            formData: {
              email: formData.email,
              name: formData.name,
              phone: formData.phone
            }
          });

          setSuccess(`Redirecting to ${selectedRole} registration...`);
          setLoading(false); // Ensure loading is false
          
          // Navigate immediately with router
          try {
            navigate(selectedRoleData.registerRoute, {
              state: {
                email: formData.email,
                name: formData.name,
                phone: formData.phone
              },
              replace: false
            });
            console.log('🚀 navigate() called to', selectedRoleData.registerRoute);
          } catch (navigationError) {
            console.error('❌ Navigation error:', navigationError);
          }
          
          // Strong hard-redirect fallback shortly after
          setTimeout(() => {
            const target = `${window.location.origin}${selectedRoleData.registerRoute}`;
            if (window.location.pathname !== selectedRoleData.registerRoute) {
              console.log('🔁 Forcing hard redirect to', target);
              window.location.replace(target);
            }
          }, 300);

          return; // Exit early to prevent further execution
        } else {
          // Simple registration for customers
          console.log('🔍 Registering customer:', {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: selectedRole
          });

          console.log('⏳ About to call register function');
          try {
            const result = await register({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
              role: selectedRole
            });

            console.log('✅ Registration result:', result);
            setSuccess('Registration successful! You can now login with your credentials.');
            setAuthMode('login');
            setFormData({
              name: '',
              email: formData.email, // Keep email for login
              phone: '',
              password: '',
              confirmPassword: ''
            });
          } catch (registerError) {
            console.error('❌ Register function error:', registerError);
            
            // Handle specific Firebase error codes
            let errorMessage = 'Registration failed. Please try again.';
            if (registerError.code) {
              switch(registerError.code) {
                case 'auth/email-already-in-use':
                  errorMessage = 'This email is already registered. Please login instead.';
                  break;
                case 'auth/invalid-email':
                  errorMessage = 'Please enter a valid email address.';
                  break;
                case 'auth/weak-password':
                  errorMessage = 'Password is too weak. Please use at least 6 characters.';
                  break;
                case 'auth/network-request-failed':
                  errorMessage = 'Network error. Please check your internet connection and try again.';
                  break;
                default:
                  errorMessage = registerError.message || 'Registration failed. Please try again.';
              }
            } else if (registerError.message) {
              errorMessage = registerError.message;
            }
            
            setError(errorMessage);
            setLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      console.error('🚨 UnifiedAuth Error:', {
        mode: authMode,
        error: error.message,
        stack: error.stack,
        formData: {
          email: formData.email,
          password: formData.password ? '[HIDDEN]' : 'EMPTY'
        }
      });
      setError(error.message || `${authMode === 'login' ? 'Login' : 'Registration'} failed`);
    } finally {
      setLoading(false);
    }
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
        <Fade in timeout={1000}>
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Zoom in timeout={1200}>
                <Box sx={{ mb: 2 }}>
                  <AgriNetLogo size="large" />
                </Box>
              </Zoom>
              
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  mb: 1,
                  background: 'linear-gradient(135deg, #4CAF50, #2196F3)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Welcome to AgriNet
              </Typography>
              
              <Typography variant="h6" color="text.secondary">
                Three-Sided Agricultural Marketplace
              </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
              {/* Role Selection */}
              <Grid item xs={12} md={5}>
                <Card sx={{ p: 3, height: 'fit-content' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Choose Your Role
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Select how you want to use AgriNet
                  </Typography>

                  <Grid container spacing={2}>
                    {roles.map((role) => {
                      const IconComponent = role.icon;
                      const isSelected = selectedRole === role.id;
                      
                      return (
                        <Grid item xs={12} key={role.id}>
                          <Card
                            sx={{
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              border: '2px solid',
                              borderColor: isSelected ? role.color : 'transparent',
                              background: isSelected ? alpha(role.color, 0.1) : 'white',
                              '&:hover': {
                                borderColor: role.color,
                                transform: 'translateY(-2px)',
                                boxShadow: 4
                              }
                            }}
                            onClick={() => handleRoleSelect(role.id)}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  sx={{
                                    p: 1,
                                    borderRadius: 2,
                                    background: alpha(role.color, 0.1),
                                    mr: 2
                                  }}
                                >
                                  <IconComponent sx={{ color: role.color, fontSize: 24 }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" fontWeight="bold">
                                    {role.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {role.subtitle}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Card>
              </Grid>

              {/* Auth Form */}
              <Grid item xs={12} md={7}>
                <Card sx={{ p: 4 }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                      value={authMode}
                      onChange={handleAuthModeChange}
                      variant="fullWidth"
                      sx={{
                        '& .MuiTab-root': {
                          textTransform: 'none',
                          fontSize: '1.1rem',
                          fontWeight: 600
                        }
                      }}
                    >
                      <Tab
                        label="Login"
                        value="login"
                        icon={<LoginIcon />}
                        iconPosition="start"
                      />
                      <Tab
                        label="Register"
                        value="register"
                        icon={<RegisterIcon />}
                        iconPosition="start"
                      />
                    </Tabs>
                  </Box>

                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: selectedRoleData.color }}
                  >
                    {authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {authMode === 'login' 
                      ? `Sign in to your ${selectedRoleData.title.toLowerCase()} account`
                      : `Create a new ${selectedRoleData.title.toLowerCase()} account`
                    }
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {success}
                      {success?.includes('Redirecting') && (
                        <span> — <Link to={selectedRoleData?.registerRoute || '/vendor/register'}>Continue</Link></span>
                      )}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    {authMode === 'register' && (
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        sx={{ mb: 2 }}
                      />
                    )}

                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      sx={{ mb: 2 }}
                    />

                    {authMode === 'register' && (
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        sx={{ mb: 2 }}
                      />
                    )}

                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      sx={{ mb: 2 }}
                    />

                    {authMode === 'register' && (
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        sx={{ mb: 3 }}
                      />
                    )}

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        background: selectedRoleData.gradient,
                        '&:hover': {
                          background: selectedRoleData.gradient,
                          opacity: 0.9
                        }
                      }}
                    >
                      {loading 
                        ? (authMode === 'login' ? 'Signing In...' : 'Creating Account...') 
                        : (authMode === 'login' ? 'Sign In' : 'Create Account')
                      }
                    </Button>
                    
                    {/* Debug button for direct Firebase testing */}
                  <Box sx={{ mt: 2, mb: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Troubleshooting Tools
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="warning"
                          size="medium"
                          onClick={async () => {
                            setError('');
                            setSuccess('');
                            try {
                              console.log('🧪 Manual test button clicked');
                              const result = await testFirebaseAuth();
                              console.log('🧪 Manual test result:', result);
                              if (result.success) {
                                setSuccess('Direct Firebase test successful! Firebase is working correctly.');
                              } else {
                                setError('Firebase test failed: ' + (result.error?.message || 'Unknown error'));
                              }
                            } catch (error) {
                              console.error('🧪 Manual test error:', error);
                              setError('Firebase test error: ' + (error.message || 'Unknown error'));
                            }
                          }}
                        >
                          Test Firebase SDK
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="info"
                          size="medium"
                          onClick={async () => {
                            setError('');
                            setSuccess('');
                            try {
                              console.log('🌐 Testing direct Firebase API...');
                              const testEmail = 'apitest' + Date.now() + '@example.com';
                              const testPassword = 'Test123456';
                              
                              const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDAMtYm61y2d3YzLBoo1m4K7V1lsJI3lyY', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  email: testEmail,
                                  password: testPassword,
                                  returnSecureToken: true
                                })
                              });
                              
                              const data = await response.json();
                              console.log('🌐 Direct API test result:', data);
                              
                              if (response.ok) {
                                setSuccess('Direct API test successful! Firebase API is accessible.');
                              } else {
                                setError('Firebase API test failed: ' + (data.error?.message || 'Unknown error'));
                              }
                            } catch (error) {
                              console.error('🌐 Direct API test error:', error);
                              setError('Firebase API test error: ' + (error.message || 'Unknown error'));
                            }
                          }}
                        >
                          Test Firebase API
                        </Button>
                      </Grid>
                    </Grid>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Click these buttons to test if Firebase authentication is working correctly.
                    </Typography>
                  </Box>

                    {authMode === 'register' && (selectedRole === 'vendor' || selectedRole === 'delivery') && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        {selectedRole === 'vendor' 
                          ? 'Vendors need additional business verification. You\'ll be redirected to complete registration.'
                          : 'Delivery partners need vehicle verification. You\'ll be redirected to complete registration.'
                        }
                      </Alert>
                    )}
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
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

export default UnifiedAuthPage;
