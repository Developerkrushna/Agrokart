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
  LinearProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  TrendingUp as EarningsIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CompleteIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  PlayArrow as AcceptIcon,
  Navigation as NavigateIcon,
  Camera as CameraIcon,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getDeliveryDashboard, acceptAssignment, updateDeliveryAvailability } from '../services/api';

const DeliveryDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors

      const token = localStorage.getItem('token');
      console.log('🔍 Fetching delivery dashboard with token:', token ? 'Present' : 'Missing');

      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await getDeliveryDashboard(token);
      console.log('✅ Dashboard data received:', {
        hasDeliveryPartner: !!response.deliveryPartner,
        hasStats: !!response.stats,
        partnerName: response.deliveryPartner?.name
      });

      setDashboardData(response);
      setIsAvailable(response.deliveryPartner?.isAvailable || false);
    } catch (error) {
      console.error('🚨 Dashboard fetch error:', error);

      // Provide more specific error messages
      if (error.message.includes('403') || error.message.includes('Access denied')) {
        setError('Access denied. Please ensure you are logged in as a delivery partner.');
      } else if (error.message.includes('401') || error.message.includes('token')) {
        setError('Authentication failed. Please login again.');
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Failed to load dashboard data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAssignment = async (assignmentId) => {
    try {
      const token = localStorage.getItem('token');
      await acceptAssignment(assignmentId, token);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Accept assignment error:', error);
      setError('Failed to accept assignment');
    }
  };

  const handleAvailabilityToggle = async (available) => {
    try {
      const token = localStorage.getItem('token');
      await updateDeliveryAvailability({ isAvailable: available }, token);
      setIsAvailable(available);
    } catch (error) {
      console.error('Availability toggle error:', error);
      setError('Failed to update availability');
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="contained" onClick={fetchDashboardData}>
            Retry
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              // Load demo dashboard for testing
              setDashboardData({
                deliveryPartner: {
                  name: user?.name || "Demo Delivery Partner",
                  isVerified: false,
                  verificationStatus: "pending",
                  isAvailable: true,
                  rating: { average: 4.5, count: 10 },
                  vehicleType: "bike"
                },
                stats: {
                  todayDeliveries: 3,
                  totalEarnings: 1250,
                  pendingEarnings: 450,
                  deliveriesThisMonth: 25,
                  availableAssignments: 5
                },
                earningsSummary: {
                  totalNet: 1250,
                  pendingAmount: 450,
                  transactionCount: 25
                },
                availableAssignments: [
                  {
                    _id: 'demo1',
                    order: { trackingNumber: 'TRK001', totalAmount: 150 },
                    customer: { name: 'John Doe', phone: '9999999999' },
                    vendor: { name: 'Farm Store', vendorProfile: { businessName: 'Green Farm Store' } },
                    pickupAddress: 'Farm Store, Main Street',
                    deliveryAddress: '123 Customer Street',
                    estimatedDistance: 5.2
                  }
                ],
                currentAssignments: [],
                monthlyTrend: [
                  { month: 'Jan', earnings: 800 },
                  { month: 'Feb', earnings: 950 },
                  { month: 'Mar', earnings: 1250 }
                ]
              });
              setError('');
            }}
          >
            Load Demo Dashboard
          </Button>
        </Box>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Troubleshooting:</strong><br/>
            1. Ensure you are logged in as a delivery partner<br/>
            2. Check your internet connection<br/>
            3. Try the "Load Demo Dashboard" to see the interface<br/>
            4. Contact support if the issue persists
          </Typography>
        </Alert>
      </Container>
    );
  }

  const { deliveryPartner, stats, earningsSummary, availableAssignments, currentAssignments } = dashboardData;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Delivery Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {deliveryPartner.name}
        </Typography>
        
        {/* Status and Controls */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`Verification: ${deliveryPartner.verificationStatus}`}
            color={deliveryPartner.isVerified ? 'success' : 'warning'}
            icon={deliveryPartner.isVerified ? <CheckCircle /> : <LocationIcon />}
          />
          {deliveryPartner.rating.count > 0 && (
            <Chip
              label={`Rating: ${deliveryPartner.rating.average.toFixed(1)} (${deliveryPartner.rating.count} reviews)`}
              icon={<StarIcon />}
            />
          )}
          <Chip
            label={deliveryPartner.vehicleType.toUpperCase()}
            variant="outlined"
          />
          <FormControlLabel
            control={
              <Switch
                checked={isAvailable}
                onChange={(e) => handleAvailabilityToggle(e.target.checked)}
                color="success"
              />
            }
            label={isAvailable ? "Available" : "Offline"}
          />
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CompleteIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.todayDeliveries}
                  </Typography>
                  <Typography color="text.secondary">
                    Today's Deliveries
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
                <EarningsIcon color="success" sx={{ mr: 2 }} />
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
                <AssignmentIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.deliveriesThisMonth}
                  </Typography>
                  <Typography color="text.secondary">
                    This Month
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
                <LocationIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.availableAssignments}
                  </Typography>
                  <Typography color="text.secondary">
                    Available Orders
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Current Assignments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Current Assignments
            </Typography>

            {currentAssignments.length === 0 ? (
              <Typography color="text.secondary">
                No active assignments
              </Typography>
            ) : (
              <List>
                {currentAssignments.map((assignment) => (
                  <ListItem
                    key={assignment._id}
                    sx={{
                      border: 1,
                      borderColor: 'primary.main',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText'
                    }}
                  >
                    <ListItemText
                      primary={`Order #${assignment.order.trackingNumber}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Customer: {assignment.customer.name}
                          </Typography>
                          <Typography variant="body2">
                            Amount: ₹{assignment.order.totalAmount}
                          </Typography>
                          <Typography variant="body2">
                            Status: {assignment.status}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/delivery/assignments/${assignment._id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/delivery/assignments/${assignment._id}/navigate`)}
                      >
                        <NavigateIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Available Assignments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Available Assignments
            </Typography>

            {!isAvailable && (
              <Alert severity="info" sx={{ mb: 2 }}>
                You are currently offline. Turn on availability to see assignments.
              </Alert>
            )}

            {availableAssignments.length === 0 ? (
              <Typography color="text.secondary">
                No available assignments
              </Typography>
            ) : (
              <List>
                {availableAssignments.slice(0, 5).map((assignment) => (
                  <ListItem
                    key={assignment._id}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemText
                      primary={`Order #${assignment.order.trackingNumber}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Pickup: {assignment.vendor.vendorProfile?.businessName || assignment.vendor.name}
                          </Typography>
                          <Typography variant="body2">
                            Delivery: {assignment.customer.name}
                          </Typography>
                          <Typography variant="body2">
                            Fee: ₹{assignment.deliveryFee}
                          </Typography>
                          <Typography variant="body2">
                            Distance: {assignment.distance?.toFixed(1) || 'N/A'} km
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<AcceptIcon />}
                        onClick={() => handleAcceptAssignment(assignment._id)}
                        disabled={!isAvailable}
                      >
                        Accept
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/delivery/assignments/${assignment._id}/preview`)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
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
            startIcon={<AssignmentIcon />}
            onClick={() => navigate('/delivery/assignments')}
          >
            View All Assignments
          </Button>
          <Button
            variant="contained"
            startIcon={<EarningsIcon />}
            onClick={() => navigate('/delivery/earnings')}
          >
            View Earnings
          </Button>
          <Button
            variant="outlined"
            startIcon={<LocationIcon />}
            onClick={() => navigate('/delivery/location')}
          >
            Update Location
          </Button>
          <Button
            variant="outlined"
            startIcon={<StarIcon />}
            onClick={() => navigate('/delivery/profile')}
          >
            View Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DeliveryDashboardPage;
