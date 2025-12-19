import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Business as VendorIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { vendorLogin } from '../services/api';

const VendorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, setRole, updateUser, setIsAuthenticated } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Starting vendor login process...');

      // Step 1: Try Firebase authentication first
      let firebaseUser = null;
      let firebaseIdToken = null;
      
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        firebaseUser = userCredential.user;
        firebaseIdToken = await firebaseUser.getIdToken();
        console.log('✅ Firebase vendor authentication successful:', firebaseUser.uid);
      } catch (firebaseError) {
        console.warn('⚠️ Firebase vendor authentication failed:', firebaseError?.code || firebaseError?.message);
        // Continue with backend authentication even if Firebase fails
      }

      // Step 2: Backend authentication with role validation
      let backendResponse = null;
      try {
        backendResponse = await vendorLogin({
          email: formData.email,
          password: formData.password,
          firebaseUid: firebaseUser?.uid
        });
        console.log('✅ Backend vendor authentication successful');
        
        // Additional frontend validation
        if (backendResponse.user && backendResponse.user.role !== 'vendor') {
          throw new Error(`Access denied. This account is registered as ${backendResponse.user.role}. Please use the ${backendResponse.user.role === 'customer' ? 'customer' : 'delivery partner'} login page.`);
        }
      } catch (backendError) {
        console.error('🚨 Backend vendor authentication failed:', backendError.message);
        throw new Error(backendError.message || 'Vendor login failed. Please check your credentials and ensure this account is registered as a vendor.');
      }

      // Step 3: Prepare user data
      const userData = {
        id: firebaseUser?.uid || backendResponse.user?.id,
        name: firebaseUser?.displayName || backendResponse.user?.name || formData.email.split('@')[0],
        email: formData.email,
        role: 'vendor',
        firebaseUid: firebaseUser?.uid,
        businessName: backendResponse.user?.businessName,
        businessType: backendResponse.user?.businessType
      };

      // Step 4: Update AuthContext
      updateUser(userData);
      setRole('vendor');
      setIsAuthenticated(true);

      // Step 5: Store authentication data
      const authToken = backendResponse?.token || firebaseIdToken || '';
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', 'vendor');
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('isLoggedIn', 'true');

      console.log('✅ Vendor login successful, navigating to vendor dashboard...');
      
      // Navigate to vendor dashboard
      navigate('/vendor/dashboard', { replace: true });

    } catch (error) {
      console.error('🚨 Vendor login error:', error);
      // Provide specific error messages for role validation
      let errorMessage = error.message;
      if (errorMessage.includes('registered as customer')) {
        errorMessage = 'This account is registered as a customer. Please use the customer login page instead.';
      } else if (errorMessage.includes('registered as delivery_partner')) {
        errorMessage = 'This account is registered as a delivery partner. Please use the delivery partner login page instead.';
      }
      setError(errorMessage || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              mb: 2
            }}>
              <VendorIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Vendor Login
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access your vendor dashboard to manage products and orders
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                height: 48,
                background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Login to Dashboard'
              )}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have a vendor account?
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/vendor/register"
                disabled={loading}
                fullWidth
                size="large"
              >
                Register as Vendor
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Looking for something else?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="text"
                  size="small"
                  component={Link}
                  to="/login"
                  disabled={loading}
                >
                  Customer Login
                </Button>
                <Button
                  variant="text"
                  size="small"
                  component={Link}
                  to="/delivery/login"
                  disabled={loading}
                >
                  Delivery Partner Login
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default VendorLogin;