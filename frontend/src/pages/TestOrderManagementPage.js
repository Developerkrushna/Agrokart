import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { deleteOrder } from '../services/api';

const TestOrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, orderId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleting, setDeleting] = useState(false);

  // Mock test token (this would normally come from authentication)
  const testToken = 'test-token-for-user-685920ee8f0d001655f02339';

  // Mock orders data (this would normally come from API)
  const mockOrders = [
    {
      _id: '6870e24a2b047435f70e45e8',
      trackingNumber: 'ORD0E45EA',
      totalAmount: 850,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      createdAt: '2025-07-13T10:07:06.654Z',
      items: [{ product: 'Premium Urea', quantity: 1, price: 850 }]
    },
    {
      _id: '6870e4c32b047435f70e4634',
      trackingNumber: 'ORD0E4636',
      totalAmount: 1200,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      createdAt: '2025-07-13T10:17:39.789Z',
      items: [{ product: 'Organic Compost', quantity: 1, price: 1200 }]
    },
    {
      _id: '6870e5502b047435f70e4642',
      trackingNumber: 'ORD0E4644',
      totalAmount: 850,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      createdAt: '2025-07-13T10:20:00.174Z',
      items: [{ product: 'Premium Urea', quantity: 1, price: 850 }]
    }
  ];

  useEffect(() => {
    // Simulate loading orders
    setLoading(true);
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDeleteClick = (orderId) => {
    setDeleteDialog({ open: true, orderId });
  };

  const handleDeleteConfirm = async () => {
    const { orderId } = deleteDialog;
    setDeleting(true);

    try {
      console.log('Attempting to delete order:', orderId);
      
      // Call the delete API
      await deleteOrder(orderId, testToken);
      
      // Remove from local state
      setOrders(orders.filter(order => order._id !== orderId));
      
      setSnackbar({
        open: true,
        message: 'Order deleted successfully!',
        severity: 'success'
      });
      
      console.log('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete order',
        severity: 'error'
      });
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, orderId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, orderId: null });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Order Management
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This is a test page to demonstrate order deletion functionality. 
        Click the delete button to test deleting orders.
      </Alert>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {order.trackingNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order._id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    {order.items.map((item, index) => (
                      <Typography key={index} variant="body2">
                        {item.product} × {item.quantity}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{order.totalAmount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.orderStatus}
                      color={getStatusColor(order.orderStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(order._id)}
                      disabled={deleting}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TestOrderManagementPage;
