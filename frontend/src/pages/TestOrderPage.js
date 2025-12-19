import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { useCart } from '../context/CartContext';

const TestOrderPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const testProducts = [
    {
      id: '1',
      name: 'Premium Urea',
      price: 850,
      category: 'Nitrogen Fertilizer',
      unit: 'kg',
      image: '/images/urea.jpg'
    },
    {
      id: '2',
      name: 'DAP Fertilizer',
      price: 1200,
      category: 'Phosphorus Fertilizer',
      unit: 'kg',
      image: '/images/dap.jpg'
    },
    {
      id: '3',
      name: 'NPK 20:20:20',
      price: 1100,
      category: 'Balanced Fertilizer',
      unit: 'kg',
      image: '/images/npk.jpg'
    }
  ];

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    alert(`${product.name} added to cart!`);
  };

  const handleTestOrder = () => {
    // Add test products to cart
    testProducts.forEach(product => {
      addToCart({ ...product, quantity: 1 });
    });

    // Set test delivery details
    localStorage.setItem('deliveryDetails', JSON.stringify({
      address: '123 Test Street, Test Area',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    }));

    // Set test payment method
    localStorage.setItem('paymentMethod', 'cod');

    // Navigate to order confirmation
    navigate('/order-confirmation');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        🧪 Test Order & Bill Generation
      </Typography>

      <Paper sx={{ p: 4, mb: 4, bgcolor: 'info.light' }}>
        <Typography variant="h5" gutterBottom>
          📋 Test Instructions:
        </Typography>
        <Typography variant="body1" paragraph>
          This page allows you to test the order confirmation and bill generation functionality:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>Add products to cart individually or use the "Test Complete Order" button</li>
          <li>The test order will automatically set delivery details and payment method</li>
          <li>You'll be redirected to the order confirmation page</li>
          <li>On the confirmation page, you can download the bill as PDF or print it</li>
          <li>The bill includes all order details, customer info, and professional formatting</li>
        </Box>
      </Paper>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleTestOrder}
          sx={{ 
            fontSize: '1.2rem',
            py: 2,
            px: 4,
            bgcolor: 'success.main',
            '&:hover': { bgcolor: 'success.dark' }
          }}
        >
          🚀 Test Complete Order Flow
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
        Available Test Products:
      </Typography>

      <Grid container spacing={3}>
        {testProducts.map((product) => (
          <Grid item xs={12} md={4} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  height: 200,
                  bgcolor: 'grey.100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem'
                }}
              >
                🌾
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.category}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                  ₹{product.price.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  per {product.unit}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          🎯 Features to Test:
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'white' }}>
              <Typography variant="h6" gutterBottom>📄 Professional Invoice</Typography>
              <Typography variant="body2">
                Complete bill with company details, customer info, and itemized products
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, bgcolor: 'secondary.light', color: 'white' }}>
              <Typography variant="h6" gutterBottom>📥 PDF Download</Typography>
              <Typography variant="body2">
                Download the invoice as a professional PDF document
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, bgcolor: 'success.light', color: 'white' }}>
              <Typography variant="h6" gutterBottom>🖨️ Print Ready</Typography>
              <Typography variant="body2">
                Print-optimized layout with proper formatting and styling
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, bgcolor: 'warning.light', color: 'white' }}>
              <Typography variant="h6" gutterBottom>📱 Share Options</Typography>
              <Typography variant="body2">
                Share order details via WhatsApp, email, or copy to clipboard
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          ← Back to Home
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/cart')}
        >
          View Cart 🛒
        </Button>
      </Box>
    </Container>
  );
};

export default TestOrderPage;
