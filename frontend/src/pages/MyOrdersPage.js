import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Snackbar
} from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Schedule as PendingIcon,
  Cancel as CancelledIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getUserOrders, deleteOrder } from '../services/api';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getUserOrders(token);
        
        if (Array.isArray(response)) {
          setOrders(response);
        } else {
          setError(response.message || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getOrderStatus = (order) => {
    switch (order.orderStatus) {
      case 'pending':
        return { label: 'Pending', color: 'warning', icon: PendingIcon };
      case 'processing':
        return { label: 'Processing', color: 'info', icon: PendingIcon };
      case 'out_for_delivery':
        return { label: 'Out for Delivery', color: 'primary', icon: ShippingIcon };
      case 'delivered':
        return { label: 'Delivered', color: 'success', icon: DeliveredIcon };
      case 'cancelled':
        return { label: 'Cancelled', color: 'error', icon: CancelledIcon };
      default:
        return { label: 'Unknown', color: 'default', icon: PendingIcon };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteOrder = async (orderId) => {
    setDeletingOrderId(orderId);
    setConfirmDelete(true);
  };

  const confirmDeleteOrder = async () => {
    if (!deletingOrderId) return;
    try {
      await deleteOrder(deletingOrderId, token);
      setOrders((prev) => prev.filter((order) => order._id !== deletingOrderId));
      setSnackbar({ open: true, message: 'Order deleted successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete order.', severity: 'error' });
    } finally {
      setDeletingOrderId(null);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Orders
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your order history and current deliveries
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <OrderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You haven't placed any orders yet. Start shopping to see your orders here.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/home')}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => {
            const status = getOrderStatus(order);
            const StatusIcon = status.icon;
            
            return (
              <Grid item xs={12} key={order._id}>
                <Card 
                  sx={{ 
                    p: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.1)})`,
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Order #{order.trackingNumber || order._id.slice(-6)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Placed on {formatDate(order.createdAt)}
                        </Typography>
                      </Box>
                      <Chip
                        icon={<StatusIcon />}
                        label={status.label}
                        color={status.color}
                        variant="outlined"
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Typography variant="subtitle2" gutterBottom>
                          Order Items:
                        </Typography>
                        <Stack spacing={1}>
                          {order.items && order.items.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">
                                {item.product?.name || 'Product'} x {item.quantity}
                              </Typography>
                              <Typography variant="body2">
                                ₹{item.price * item.quantity}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Total Amount
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ₹{order.totalAmount}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {order.deliveryAddress && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Delivery Address:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/order-details/${order._id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteOrder(order._id)}
                        disabled={deletingOrderId === order._id}
                      >
                        Delete Order
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 4, minWidth: 320, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Delete this order?</Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>Are you sure you want to delete this order? This action cannot be undone.</Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" color="error" onClick={confirmDeleteOrder}>Delete</Button>
              <Button variant="outlined" onClick={() => { setConfirmDelete(false); setDeletingOrderId(null); }}>Cancel</Button>
            </Stack>
          </Paper>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyOrdersPage; 