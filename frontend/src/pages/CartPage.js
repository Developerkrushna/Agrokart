import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Divider,
  Paper,
  useTheme,
  Snackbar,
  Alert,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { cart = [], removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleQuantityChange = (cartItemId, change) => {
    if (!cart || cart.length === 0) return;
    const item = cart.find(item => item.cartItemId === cartItemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(cartItemId, newQuantity);
      }
    }
  };

  const handleRemoveItem = (cartItemId) => {
    removeFromCart(cartItemId);
    setSnackbar({
      open: true,
      message: 'Item removed from cart',
      severity: 'success'
    });
  };

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 5000 ? 0 : 200;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    navigate('/delivery-details');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Your Cart
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {!cart || cart.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Your cart is empty
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/home')}
                sx={{ mt: 2 }}
              >
                Continue Shopping
              </Button>
            </Paper>
          ) : (
            <Stack spacing={3}>
              {cart.map((item) => (
                <Paper 
                  key={item.cartItemId} 
                  elevation={1}
                  sx={{ 
                    p: 2,
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    {/* Product Image */}
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        sx={{ 
                          width: '100%',
                          height: 150,
                          objectFit: 'contain',
                          bgcolor: 'grey.50',
                          borderRadius: 1
                        }}
                        image={item.images && item.images[0] ? `/images/products/${item.images[0]}` : item.image || 'https://placehold.co/200x200/2E7D32/FFFFFF?text=No+Image'}
                        alt={item.name}
                      />
                    </Grid>

                    {/* Product Details */}
                    <Grid item xs={12} sm={9}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {/* Product Info */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.category}
                            </Typography>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(item.cartItemId)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        {/* Price and Quantity */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mt: 'auto'
                        }}>
                          <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                              ₹{item.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total: ₹{item.price * item.quantity}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.cartItemId, -1)}
                              disabled={item.quantity <= 1}
                              sx={{ 
                                border: 1, 
                                borderColor: 'divider',
                                '&:hover': {
                                  bgcolor: 'grey.100'
                                }
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.cartItemId, 1)}
                              sx={{ 
                                border: 1, 
                                borderColor: 'divider',
                                '&:hover': {
                                  bgcolor: 'grey.100'
                                }
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
          )}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>₹{subtotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Delivery</Typography>
                <Typography color={deliveryFee === 0 ? 'success.main' : 'inherit'}>
                  {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ₹{total}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Box>

            {deliveryFee === 0 ? (
              <Alert severity="success" sx={{ mt: 2 }}>
                Free delivery on orders above ₹5000
              </Alert>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                Add ₹{5000 - subtotal} more for free delivery
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage; 