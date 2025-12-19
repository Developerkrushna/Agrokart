import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Grid,
  Divider,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrderById } from '../services/api';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home';

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { token } = useAuth();
  const theme = useTheme();
  const [orderNumber, setOrderNumber] = useState(orderId || '');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch order details from API
  const fetchOrderDetails = async (orderIdToFetch) => {
    if (!orderIdToFetch) {
      setError('Please enter an order ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await getOrderById(orderIdToFetch, token);
      const orderData = response.data || response;

      // Convert API response to tracking format
      const trackingData = {
        orderNumber: orderData._id,
        status: orderData.status || orderData.orderStatus,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        createdAt: orderData.createdAt,
        deliveryAddress: orderData.deliveryAddress || 'Default delivery address'
      };

      setOrderDetails(trackingData);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Order not found. Please check your order ID.');
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = () => {
    fetchOrderDetails(orderNumber);
  };

  // Auto-fetch order details if orderId is provided in URL
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId, token]);

  const getOrderStatus = () => {
    if (!orderDetails) {
      return {
        orderPlaced: false,
        confirmed: false,
        processing: false,
        shipped: false,
        delivered: false
      };
    }

    const status = orderDetails.status;
    switch (status) {
      case 'pending':
        return {
          orderPlaced: true,
          confirmed: false,
          processing: false,
          shipped: false,
          delivered: false
        };
      case 'confirmed':
        return {
          orderPlaced: true,
          confirmed: true,
          processing: false,
          shipped: false,
          delivered: false
        };
      case 'processing':
        return {
          orderPlaced: true,
          confirmed: true,
          processing: true,
          shipped: false,
          delivered: false
        };
      case 'shipped':
      case 'out_for_delivery':
        return {
          orderPlaced: true,
          confirmed: true,
          processing: true,
          shipped: true,
          delivered: false
        };
      case 'delivered':
        return {
          orderPlaced: true,
          confirmed: true,
          processing: true,
          shipped: true,
          delivered: true
        };
      default:
        return {
          orderPlaced: true,
          confirmed: false,
          processing: false,
          shipped: false,
          delivered: false
        };
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        sx={{ 
          p: 4,
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.1)})`,
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Track Your Order
        </Typography>

        {/* Search Section */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Enter Order Number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              onClick={handleTrackOrder}
              disabled={loading}
              sx={{ minWidth: '150px' }}
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </Button>
          </Stack>
        </Box>

        {orderDetails && (
          <>
            {/* Order Details */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order Number
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {orderDetails.orderNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(orderDetails.orderDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Order Tracking */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Order Status
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleIcon color="success" />
                  <Box>
                    <Typography variant="subtitle1">Order Placed</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your order has been successfully placed
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AssignmentIcon color="success" />
                  <Box>
                    <Typography variant="subtitle1">Order Confirmed</Typography>
                    <Typography variant="body2" color="text.secondary">
                      We've confirmed your order
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <InventoryIcon color="success" />
                  <Box>
                    <Typography variant="subtitle1">Processing</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your order is being processed
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocalShippingIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1">Shipped</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your order will be shipped soon
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleIcon color="disabled" />
                  <Box>
                    <Typography variant="subtitle1">Delivered</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your order will be delivered soon
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/home')}
              >
                Back to Home
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default OrderTrackingPage; 