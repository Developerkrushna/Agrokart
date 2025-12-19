import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Stack,
  useTheme,
  alpha,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocalShipping as ShippingIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const DeliveryDetailsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();
  
  // Helper function to extract address string from user object
  const getAddressString = (userAddress) => {
    if (!userAddress) return '';
    if (typeof userAddress === 'string') return userAddress;
    if (typeof userAddress === 'object') {
      const parts = [];
      if (userAddress.street) parts.push(userAddress.street);
      if (userAddress.city) parts.push(userAddress.city);
      if (userAddress.state) parts.push(userAddress.state);
      if (userAddress.pincode) parts.push(userAddress.pincode);
      return parts.join(', ');
    }
    return '';
  };

  // Helper function to extract individual address components
  const getAddressComponent = (userAddress, component) => {
    if (!userAddress) return '';
    if (typeof userAddress === 'string') {
      // If address is a string, try to extract components (basic implementation)
      if (component === 'street') return userAddress;
      return '';
    }
    if (typeof userAddress === 'object') {
      return userAddress[component] || '';
    }
    return '';
  };

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: getAddressString(user?.address) || '',
    landmark: '',
    city: getAddressComponent(user?.address, 'city') || '',
    state: getAddressComponent(user?.address, 'state') || '',
    pincode: getAddressComponent(user?.address, 'pincode') || '',
    deliveryInstructions: ''
  });
  const [errors, setErrors] = useState({});

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 5000 ? 0 : 200;
  const total = subtotal + deliveryFee;

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Store delivery details in localStorage for use in payment and confirmation pages
      localStorage.setItem('deliveryDetails', JSON.stringify(formData));
      navigate('/payment');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        sx={{ 
          p: 3,
          mb: 4,
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.1)})`,
          borderRadius: 2,
          boxShadow: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            color="primary"
            sx={{ 
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: theme.palette.primary.main,
              fontWeight: 'bold'
            }}
          >
            <ShippingIcon color="primary" sx={{ fontSize: 32 }} />
            Delivery Details
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Delivery Form */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3,
              background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.1)})`,
              borderRadius: 2
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleChange('fullName')}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={handleChange('address')}
                  error={!!errors.address}
                  helperText={errors.address}
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Landmark (Optional)"
                  value={formData.landmark}
                  onChange={handleChange('landmark')}
                  placeholder="Near temple, school, etc."
                  InputProps={{
                    startAdornment: <HomeIcon color="action" sx={{ mr: 1 }} />
                  }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.city}
                      onChange={handleChange('city')}
                      error={!!errors.city}
                      helperText={errors.city}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      value={formData.state}
                      onChange={handleChange('state')}
                      error={!!errors.state}
                      helperText={errors.state}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Pincode"
                  value={formData.pincode}
                  onChange={handleChange('pincode')}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                />

                <TextField
                  fullWidth
                  label="Delivery Instructions (Optional)"
                  value={formData.deliveryInstructions}
                  onChange={handleChange('deliveryInstructions')}
                  multiline
                  rows={2}
                  placeholder="Any specific instructions for delivery"
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    }
                  }}
                >
                  Proceed to Payment
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3,
              position: 'sticky',
              top: 20,
              background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.1)})`,
              borderRadius: 2
            }}
          >
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Stack spacing={2}>
              {cart.map((item) => (
                <Box 
                  key={item.cartItemId}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <Typography>
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography>₹{item.price * item.quantity}</Typography>
                </Box>
              ))}
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Subtotal</Typography>
                <Typography>₹{subtotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Delivery</Typography>
                <Typography color={deliveryFee === 0 ? 'success.main' : 'inherit'}>
                  {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ₹{total}
                </Typography>
              </Box>
              {deliveryFee > 0 && (
                <Alert severity="info">
                  Add ₹{5000 - subtotal} more to get free delivery!
                </Alert>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DeliveryDetailsPage; 