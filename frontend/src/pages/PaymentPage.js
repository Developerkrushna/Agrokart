import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  Stack,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  PhoneAndroid as UpiIcon,
  LocalAtm as CashIcon,
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  LocalShipping as ShippingIcon,
  Support as SupportIcon,
  VerifiedUser as VerifiedUserIcon,
  Agriculture as AgricultureIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { useCart } from '../context/CartContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { cart, getCartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [upiError, setUpiError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 5000 ? 0 : 200;
  const total = subtotal + deliveryFee;

  const handleCardChange = (field) => (event) => {
    let value = event.target.value;
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Format expiry date
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
    }

    setCardDetails({
      ...cardDetails,
      [field]: value
    });
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePayment = async () => {
    try {
      // Validate payment details based on method
      if (paymentMethod === 'card' && !validateCardDetails()) {
        setError('Please fill in all card details correctly.');
        return;
      }

      if (paymentMethod === 'upi' && (!upiId || !upiId.includes('@'))) {
        setError('Please enter a valid UPI ID.');
        return;
      }

      // Store payment method for order creation
      localStorage.setItem('paymentMethod', paymentMethod);

      // Store payment details if needed
      if (paymentMethod === 'card') {
        localStorage.setItem('paymentDetails', JSON.stringify({
          method: 'card',
          last4: cardDetails.cardNumber.slice(-4),
          cardName: cardDetails.cardName
        }));
      } else if (paymentMethod === 'upi') {
        localStorage.setItem('paymentDetails', JSON.stringify({
          method: 'upi',
          upiId: upiId
        }));
      } else {
        localStorage.setItem('paymentDetails', JSON.stringify({
          method: 'cod'
        }));
      }

      // Show payment success state
      setPaymentSuccess(true);
      setError('');

      // Store cart items in localStorage before navigation
      localStorage.setItem('orderCartItems', JSON.stringify(cart));
      console.log('PaymentPage: Cart items stored for order confirmation:', cart);

      // Simulate payment processing delay
      setTimeout(() => {
        // Navigate to order confirmation (cart will be cleared there after order creation)
        navigate('/order-confirmation');
      }, 1500);

    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
      setPaymentSuccess(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateCardDetails = () => {
    if (paymentMethod === 'card') {
      return (
        cardDetails.cardNumber.length === 16 &&
        cardDetails.cardName.trim() !== '' &&
        cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/) &&
        cardDetails.cvv.length === 3
      );
    }
    return true;
  };

  const features = [
    {
      icon: <SecurityIcon color="primary" />,
      title: 'Secure Payment',
      description: 'Your payment information is encrypted and secure'
    },
    {
      icon: <ShippingIcon color="primary" />,
      title: 'Fast Delivery',
      description: 'Get your fertilizers delivered to your farm'
    },
    {
      icon: <SupportIcon color="primary" />,
      title: '24/7 Support',
      description: 'Our team is always here to help you'
    }
  ];

  // Show payment success screen
  if (paymentSuccess) {
    return (
      <MainLayout>
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="success.main">
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Processing your order and redirecting to confirmation page...
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress color="primary" />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AgricultureIcon color="primary" />
            Secure Payment
          </Typography>
        </Box>

        <Grid container spacing={4}>
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
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedUserIcon color="primary" />
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

          {/* Payment Form */}
          <Grid item xs={12} md={8}>
            <Paper 
              sx={{ 
                p: 3, 
                mb: 3,
                background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.1)})`,
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentIcon color="primary" />
                Select Payment Method
              </Typography>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <Card 
                    sx={{ 
                      mb: 2, 
                      border: paymentMethod === 'card' ? `2px solid ${theme.palette.primary.main}` : 'none',
                      '&:hover': {
                        border: `2px solid ${theme.palette.primary.main}`,
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CardContent>
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CreditCardIcon color="primary" />
                            <Typography>Credit/Debit Card</Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>

                  <Card 
                    sx={{ 
                      mb: 2,
                      border: paymentMethod === 'upi' ? `2px solid ${theme.palette.primary.main}` : 'none',
                      '&:hover': {
                        border: `2px solid ${theme.palette.primary.main}`,
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <CardContent>
                      <FormControlLabel
                        value="upi"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BankIcon color="primary" />
                            <Typography>UPI</Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>

                  <Card 
                    sx={{ 
                      border: paymentMethod === 'cod' ? `2px solid ${theme.palette.primary.main}` : 'none',
                      '&:hover': {
                        border: `2px solid ${theme.palette.primary.main}`,
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <CardContent>
                      <FormControlLabel
                        value="cod"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CashIcon color="primary" />
                            <Typography>Cash on Delivery</Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>
                </RadioGroup>
              </FormControl>

              {paymentMethod === 'card' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Card Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        value={cardDetails.cardNumber}
                        onChange={handleCardChange('cardNumber')}
                        inputProps={{ maxLength: 16 }}
                        placeholder="1234 5678 9012 3456"
                        InputProps={{
                          startAdornment: <CreditCardIcon color="action" sx={{ mr: 1 }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name on Card"
                        value={cardDetails.cardName}
                        onChange={handleCardChange('cardName')}
                        placeholder="John Doe"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        value={cardDetails.expiryDate}
                        onChange={handleCardChange('expiryDate')}
                        placeholder="MM/YY"
                        inputProps={{ maxLength: 5 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        value={cardDetails.cvv}
                        onChange={handleCardChange('cvv')}
                        type="password"
                        inputProps={{ maxLength: 3 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {paymentMethod === 'upi' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    UPI Details
                  </Typography>
                  <TextField
                    fullWidth
                    label="UPI ID"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="example@upi"
                    InputProps={{
                      startAdornment: <BankIcon color="action" sx={{ mr: 1 }} />
                    }}
                  />
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Pay using any UPI app like Google Pay, PhonePe, or Paytm
                  </Alert>
                </Box>
              )}

              {paymentMethod === 'cod' && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  Pay with cash when your order is delivered to your farm
                </Alert>
              )}
            </Paper>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PaymentIcon />}
              onClick={handlePayment}
              disabled={!validateCardDetails()}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                }
              }}
            >
              Pay ₹{total}
            </Button>

            {/* Features Section */}
            <Grid container spacing={2} sx={{ mt: 4 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        transition: 'transform 0.2s ease-in-out',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    {feature.icon}
                    <Typography variant="h6">{feature.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
};

export default PaymentPage; 