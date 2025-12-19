import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrderIcon,
  Warning as WarningIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  Notifications as NotificationIcon,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getVendorDashboard, respondToVendorOrder } from '../services/api';

const VendorDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await getVendorDashboard(token);
      setDashboardData(response);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderResponse = async (orderId, action, reason = '') => {
    try {
      const token = localStorage.getItem('token');
      await respondToVendorOrder(orderId, { action, reason }, token);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Order response error:', error);
      setError('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading dashboard...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const { vendor, stats, earningsSummary, lowStockProducts, recentOrders } = dashboardData;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Vendor Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {vendor.businessName}
        </Typography>
        
        {/* Verification Status */}
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`Verification: ${vendor.verificationStatus}`}
            color={vendor.isVerified ? 'success' : 'warning'}
            icon={vendor.isVerified ? <CheckCircle /> : <WarningIcon />}
          />
          {vendor.rating.count > 0 && (
            <Chip
              label={`Rating: ${vendor.rating.average.toFixed(1)} (${vendor.rating.count} reviews)`}
              icon={<StarIcon />}
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InventoryIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalProducts}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Products
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    ₹{stats.totalEarnings.toLocaleString()}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Earnings
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <OrderIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.ordersThisMonth}
                  </Typography>
                  <Typography color="text.secondary">
                    Orders This Month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.lowStockCount}
                  </Typography>
                  <Typography color="text.secondary">
                    Low Stock Alerts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Orders
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/vendor/orders')}
              >
                View All
              </Button>
            </Box>

            <List>
              {recentOrders.slice(0, 5).map((order) => (
                <ListItem
                  key={order._id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemText
                    primary={`Order #${order.trackingNumber}`}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          Customer: {order.user.name}
                        </Typography>
                        <Typography variant="body2">
                          Amount: ₹{order.totalAmount}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={order.orderStatus}
                      size="small"
                      color={order.orderStatus === 'pending' ? 'warning' : 'success'}
                    />
                    {order.orderStatus === 'pending' && (
                      <>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleOrderResponse(order._id, 'accept')}
                        >
                          <AcceptIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOrderResponse(order._id, 'reject', 'Out of stock')}
                        >
                          <RejectIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/vendor/orders/${order._id}`)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Low Stock Alerts
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/vendor/inventory?lowStock=true')}
              >
                View All
              </Button>
            </Box>

            <List>
              {lowStockProducts.map((item) => (
                <ListItem
                  key={item._id}
                  sx={{
                    border: 1,
                    borderColor: 'warning.main',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: 'warning.light',
                    color: 'warning.contrastText'
                  }}
                >
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.product.name}
                    secondary={`Stock: ${item.availableStock} units`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<InventoryIcon />}
            onClick={() => navigate('/vendor/inventory')}
          >
            Manage Inventory
          </Button>
          <Button
            variant="contained"
            startIcon={<OrderIcon />}
            onClick={() => navigate('/vendor/orders')}
          >
            View Orders
          </Button>
          <Button
            variant="outlined"
            startIcon={<TrendingUpIcon />}
            onClick={() => navigate('/vendor/earnings')}
          >
            View Earnings
          </Button>
          <Button
            variant="outlined"
            startIcon={<NotificationIcon />}
            onClick={() => navigate('/vendor/notifications')}
          >
            Notifications
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default VendorDashboardPage;
