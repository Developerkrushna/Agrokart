import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  CheckCircle,
  Schedule as PendingIcon,
  Cancel as CancelledIcon,
  Inventory as PackedIcon,
  LocalShippingOutlined as OutForDeliveryIcon,
  HomeOutlined as DeliveredHomeIcon,
  Receipt as OrderIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getOrderById } from '../services/api';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate dynamic tracking steps based on order status
  const getTrackingSteps = (orderStatus) => {
    const baseSteps = [
      {
        label: 'Order Placed',
        description: 'Your order has been successfully placed',
        icon: <OrderIcon />,
        timestamp: order?.createdAt
      },
      {
        label: 'Order Confirmed',
        description: 'Order confirmed and being prepared',
        icon: <CheckCircle />,
        timestamp: order?.createdAt
      },
      {
        label: 'Packed',
        description: 'Your items have been packed and ready for dispatch',
        icon: <PackedIcon />,
        timestamp: null
      },
      {
        label: 'Out for Delivery',
        description: 'Your order is on the way to your location',
        icon: <OutForDeliveryIcon />,
        timestamp: null
      },
      {
        label: 'Delivered',
        description: 'Order delivered successfully to your address',
        icon: <DeliveredHomeIcon />,
        timestamp: null
      }
    ];

    // Set timestamps based on order status
    const now = new Date();
    const orderDate = new Date(order?.createdAt);

    switch (orderStatus) {
      case 'pending':
        return baseSteps.map((step, index) => ({
          ...step,
          completed: index === 0,
          active: index === 0
        }));
      case 'confirmed':
        return baseSteps.map((step, index) => ({
          ...step,
          completed: index <= 1,
          active: index === 1,
          timestamp: index <= 1 ? (index === 0 ? orderDate : new Date(orderDate.getTime() + 30 * 60 * 1000)) : null
        }));
      case 'shipped':
        return baseSteps.map((step, index) => ({
          ...step,
          completed: index <= 3,
          active: index === 3,
          timestamp: index <= 3 ? new Date(orderDate.getTime() + index * 4 * 60 * 60 * 1000) : null
        }));
      case 'delivered':
        return baseSteps.map((step, index) => ({
          ...step,
          completed: true,
          active: index === 4,
          timestamp: new Date(orderDate.getTime() + index * 4 * 60 * 60 * 1000)
        }));
      default:
        return baseSteps.map((step, index) => ({
          ...step,
          completed: index === 0,
          active: index === 0
        }));
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getOrderById(orderId, token);
        // Handle both API response format and mock data format
        const orderData = response.data || response;
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return theme.palette.warning.main;
      case 'confirmed': return theme.palette.info.main;
      case 'shipped': return theme.palette.primary.main;
      case 'delivered': return theme.palette.success.main;
      case 'cancelled': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <PendingIcon />;
      case 'confirmed': return <CheckCircle />;
      case 'shipped': return <ShippingIcon />;
      case 'delivered': return <DeliveredIcon />;
      case 'cancelled': return <CancelledIcon />;
      default: return <PendingIcon />;
    }
  };

  const getActiveStep = (orderStatus) => {
    switch (orderStatus) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/my-orders')}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          Order not found
        </Alert>
        <Button variant="contained" onClick={() => navigate('/my-orders')}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  const trackingSteps = getTrackingSteps(order.status || order.orderStatus);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/my-orders')}
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Order Details
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Order ID: {order._id}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Order Tracking */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              📦 Order Tracking
            </Typography>

            <Stepper orientation="vertical">
              {trackingSteps.map((step, index) => (
                <Step key={step.label} active={step.active} completed={step.completed}>
                  <StepLabel
                    icon={
                      <Avatar
                        sx={{
                          bgcolor: step.completed ? theme.palette.success.main :
                                  step.active ? theme.palette.primary.main : theme.palette.grey[300],
                          width: 40,
                          height: 40,
                          border: step.active ? `3px solid ${alpha(theme.palette.primary.main, 0.3)}` : 'none'
                        }}
                      >
                        {step.icon}
                      </Avatar>
                    }
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {step.label}
                      </Typography>
                      {step.timestamp && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(step.timestamp).toLocaleString('en-IN')}
                        </Typography>
                      )}
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>
                    <Chip
                      label={step.completed ? 'Completed' : step.active ? 'In Progress' : 'Pending'}
                      color={step.completed ? 'success' : step.active ? 'primary' : 'default'}
                      size="small"
                    />
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {/* Estimated Delivery */}
            <Box sx={{ mt: 4, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Estimated Delivery
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          </Paper>

          {/* Order Items */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Order Items
            </Typography>
            
            <List>
              {order.items?.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={item.product?.images?.[0] || '/api/placeholder/60/60'}
                        sx={{ width: 60, height: 60 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {item.product?.name || item.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity} {item.product?.unit || 'kg'}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                            ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < order.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Order Summary & Contact */}
        <Grid item xs={12} lg={4}>
          {/* Order Summary */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={getStatusIcon(order.status || order.orderStatus)}
                label={(order.status || order.orderStatus)?.toUpperCase()}
                color={(order.status || order.orderStatus) === 'delivered' ? 'success' : (order.status || order.orderStatus) === 'cancelled' ? 'error' : 'primary'}
                sx={{ mb: 2 }}
              />
            </Box>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Subtotal:</Typography>
                <Typography>₹{order.totalAmount - (order.deliveryFee || 0)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Delivery Fee:</Typography>
                <Typography>₹{order.deliveryFee || 0}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>₹{order.totalAmount}</Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Payment Method:</strong> {order.paymentMethod || 'Cash on Delivery'}
              </Typography>
            </Box>
          </Paper>

          {/* Delivery Address */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Delivery Address
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocationIcon color="primary" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="body2">
                  {order.deliveryAddress?.street}<br />
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state}<br />
                  {order.deliveryAddress?.pincode}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Contact Support */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Need Help?
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                fullWidth
                onClick={() => window.open('tel:1800-XXX-XXXX')}
              >
                Call Support
              </Button>
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                fullWidth
                onClick={() => window.open('mailto:support@krushidoot.com')}
              >
                Email Support
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetailsPage;
