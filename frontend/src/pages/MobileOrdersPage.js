import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Tab,
  Tabs,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Cancel as CancelledIcon,
  Schedule as PendingIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { cancelOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MobileOrdersPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Mock orders data
    const mockOrders = [
      {
        id: 'ORD001',
        date: '2024-01-15',
        status: 'delivered',
        total: 1250,
        items: [
          { name: 'NPK Fertilizer Premium', quantity: 2, price: 850 },
          { name: 'Organic Compost', quantity: 1, price: 400 }
        ],
        deliveryDate: '2024-01-18'
      },
      {
        id: 'ORD002',
        date: '2024-01-20',
        status: 'shipped',
        total: 680,
        items: [
          { name: 'Wheat Seeds Premium', quantity: 1, price: 320 },
          { name: 'Plant Growth Booster', quantity: 1, price: 280 }
        ],
        expectedDelivery: '2024-01-23'
      },
      {
        id: 'ORD003',
        date: '2024-01-22',
        status: 'pending',
        total: 450,
        items: [
          { name: 'Organic Pesticide', quantity: 1, price: 450 }
        ],
        expectedDelivery: '2024-01-25'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#4CAF50';
      case 'shipped': return '#2196F3';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <DeliveredIcon />;
      case 'shipped': return <ShippingIcon />;
      case 'pending': return <PendingIcon />;
      case 'cancelled': return <CancelledIcon />;
      default: return <ReceiptIcon />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'pending': return 'Processing';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const filterOrdersByStatus = (status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const getFilteredOrders = () => {
    switch (tabValue) {
      case 0: return orders; // All
      case 1: return filterOrdersByStatus('pending'); // Processing
      case 2: return filterOrdersByStatus('shipped'); // Shipped
      case 3: return filterOrdersByStatus('delivered'); // Delivered
      default: return orders;
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = (order) => {
    return ['pending', 'confirmed', 'processing'].includes(order.status);
  };

  // Handle cancel order dialog
  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setCancelDialogOpen(true);
  };

  // Handle cancel order confirmation
  const handleCancelConfirm = async () => {
    if (!orderToCancel || !token) return;

    setCancelLoading(true);
    try {
      await cancelOrder(orderToCancel.id, token);

      // Update order status in local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderToCancel.id
            ? { ...order, status: 'cancelled' }
            : order
        )
      );

      setSnackbar({
        open: true,
        message: 'Order cancelled successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to cancel order',
        severity: 'error'
      });
    } finally {
      setCancelLoading(false);
      setCancelDialogOpen(false);
      setOrderToCancel(null);
    }
  };

  // Handle cancel dialog close
  const handleCancelDialogClose = () => {
    if (!cancelLoading) {
      setCancelDialogOpen(false);
      setOrderToCancel(null);
    }
  };

  return (
    <Box sx={{ background: 'transparent', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ px: 2, py: 2, bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" fontWeight="bold">
          Orders
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 'auto',
              px: 2
            },
            '& .Mui-selected': {
              color: '#16A34A'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#16A34A'
            }
          }}
        >
          <Tab label="All Orders" />
          <Tab label="Processing" />
          <Tab label="Shipped" />
          <Tab label="Delivered" />
        </Tabs>
      </Box>

      {/* Orders List */}
      <Box sx={{ px: 2, py: 2 }}>
        {getFilteredOrders().length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '40vh',
              textAlign: 'center'
            }}
          >
            <ReceiptIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: '#666' }}>
              No orders found
            </Typography>
            <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
              Start shopping to see your orders here
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/home')}
              sx={{
                bgcolor: '#4CAF50',
                '&:hover': { bgcolor: '#45a049' },
                borderRadius: 2
              }}
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          getFilteredOrders().map((order) => (
            <Card key={order.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
              <CardContent sx={{ p: 2 }}>
                {/* Order Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      Order #{order.id}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(order.status)}
                    label={getStatusText(order.status)}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(order.status),
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                </Box>

                {/* Order Items */}
                <Box sx={{ mb: 2 }}>
                  {order.items.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {item.name} × {item.quantity}
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        ₹{item.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Order Total */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" fontWeight="bold">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                    ₹{order.total}
                  </Typography>
                </Box>

                {/* Delivery Info */}
                {order.status === 'delivered' && (
                  <Typography variant="body2" sx={{ color: '#4CAF50', mb: 2 }}>
                    ✓ Delivered on {new Date(order.deliveryDate).toLocaleDateString()}
                  </Typography>
                )}

                {order.status === 'shipped' && (
                  <Typography variant="body2" sx={{ color: '#2196F3', mb: 2 }}>
                    🚚 Expected delivery: {new Date(order.expectedDelivery).toLocaleDateString()}
                  </Typography>
                )}

                {order.status === 'pending' && (
                  <Typography variant="body2" sx={{ color: '#FF9800', mb: 2 }}>
                    ⏳ Expected delivery: {new Date(order.expectedDelivery).toLocaleDateString()}
                  </Typography>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/order-details/${order.id}`)}
                    sx={{
                      borderColor: '#4CAF50',
                      color: '#4CAF50',
                      textTransform: 'none',
                      borderRadius: 1,
                      flex: 1
                    }}
                  >
                    View Details
                  </Button>
                  
                  {order.status === 'shipped' && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/order-tracking/${order.id}`)}
                      sx={{
                        bgcolor: '#2196F3',
                        '&:hover': { bgcolor: '#1976D2' },
                        textTransform: 'none',
                        borderRadius: 1,
                        flex: 1
                      }}
                    >
                      Track Order
                    </Button>
                  )}

                  {order.status === 'delivered' && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: '#4CAF50',
                        '&:hover': { bgcolor: '#45a049' },
                        textTransform: 'none',
                        borderRadius: 1,
                        flex: 1
                      }}
                    >
                      Reorder
                    </Button>
                  )}

                  {/* Cancel Order Button */}
                  {canCancelOrder(order) && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleCancelClick(order)}
                      sx={{
                        borderColor: '#f44336',
                        color: '#f44336',
                        textTransform: 'none',
                        borderRadius: 1,
                        flex: 1,
                        '&:hover': {
                          borderColor: '#d32f2f',
                          bgcolor: 'rgba(244, 67, 54, 0.04)'
                        }
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Cancel Order
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to cancel this order?
          </Typography>
          {orderToCancel && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                Order #{orderToCancel.id}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total: ₹{orderToCancel.total}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
            This action cannot be undone. Any payment made will be refunded within 5-7 business days.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCancelDialogClose}
            disabled={cancelLoading}
            sx={{ textTransform: 'none' }}
          >
            Keep Order
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant="contained"
            disabled={cancelLoading}
            sx={{
              bgcolor: '#f44336',
              '&:hover': { bgcolor: '#d32f2f' },
              textTransform: 'none'
            }}
          >
            {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MobileOrdersPage;
