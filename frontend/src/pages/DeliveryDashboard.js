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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  Switch,
  FormControlLabel,
  Fab,
  Badge,
  Tooltip,
  Skeleton,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CardHeader,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  Dashboard as DashboardIcon,
  Assignment as DeliveriesIcon,
  Route as RouteIcon,
  Analytics as AnalyticsIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon,
  Navigation as NavigationIcon,
  Timer as TimerIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  DirectionsCar as VehicleIcon,
  Star as StarIcon,
  Logout as LogoutIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Speed as SpeedIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  Map as MapIcon,
  BarChart as BarChartIcon,
  NotificationsActive as ActiveNotificationIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AgriNetLoader from '../components/AgriNetLoader';

const DeliveryDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications] = useState(5);
  const [isOnline, setIsOnline] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load
    setTimeout(() => {
      setPageLoading(false);
    }, 2000);
  }, []);

  // Mock data - replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalDeliveries: 142,
      activeDeliveries: 3,
      totalEarnings: 12450,
      todayDeliveries: 8,
      averageRating: 4.6,
      completionRate: 96
    },
    activeDeliveries: [
      { 
        id: 'DEL001', 
        orderNumber: 'ORD001', 
        customer: 'Ram Kumar', 
        pickup: 'Green Farm, Sector 12', 
        delivery: 'Block A, Noida', 
        amount: 50, 
        status: 'In Transit',
        estimatedTime: '15 mins'
      },
      { 
        id: 'DEL002', 
        orderNumber: 'ORD008', 
        customer: 'Priya Sharma', 
        pickup: 'Organic Store, Main Road', 
        delivery: 'Phase 2, Gurgaon', 
        amount: 75, 
        status: 'Picked Up',
        estimatedTime: '25 mins'
      }
    ],
    recentDeliveries: [
      { id: 'DEL098', orderNumber: 'ORD045', customer: 'Anita Singh', amount: 60, status: 'Delivered', time: '2 hours ago' },
      { id: 'DEL097', orderNumber: 'ORD044', customer: 'Rohit Kumar', amount: 45, status: 'Delivered', time: '3 hours ago' }
    ],
    todayStats: {
      deliveriesCompleted: 8,
      totalDistance: 45.2,
      totalEarnings: 420,
      averageTime: 18
    },
    routes: [
      { id: 1, name: 'Route A - Central Delhi', assignments: 5, distance: '25 km', estimatedTime: '2.5 hrs', status: 'Active' },
      { id: 2, name: 'Route B - South Delhi', assignments: 3, distance: '18 km', estimatedTime: '1.8 hrs', status: 'Completed' },
      { id: 3, name: 'Route C - East Delhi', assignments: 4, distance: '22 km', estimatedTime: '2.2 hrs', status: 'Pending' }
    ],
    analytics: {
      weeklyEarnings: [320, 420, 380, 450, 520, 480, 510],
      deliveryTrend: [12, 15, 13, 18, 20, 17, 19],
      performanceMetrics: {
        onTimeDelivery: 94,
        customerRating: 4.6,
        totalDistance: 245.8,
        fuelEfficiency: 15.2
      }
    },
    notifications: [
      { id: 1, title: 'New Delivery Assignment', message: 'Order #ORD456 assigned to you for delivery', time: '2 minutes ago', type: 'assignment', read: false },
      { id: 2, title: 'Route Optimization', message: 'Your route has been optimized to save 15 minutes', time: '30 minutes ago', type: 'route', read: false },
      { id: 3, title: 'Payment Credited', message: 'Delivery payment of ₹75 has been credited', time: '1 hour ago', type: 'payment', read: true },
      { id: 4, title: 'Customer Rating', message: 'You received a 5-star rating from Ram Kumar', time: '3 hours ago', type: 'rating', read: true },
      { id: 5, title: 'Weekly Summary', message: 'Your weekly performance report is ready', time: '1 day ago', type: 'report', read: true }
    ],
    profile: {
      name: user?.name || 'Delivery Partner',
      email: user?.email || 'partner@agrokart.com',
      phone: '+91 9876543210',
      address: 'Flat 456, Delivery Apartments, Delhi - 110002',
      vehicleType: 'Motorcycle',
      vehicleNumber: 'DL-01-AB-1234',
      licenseNumber: 'DL123456789',
      joinedDate: '2023-01-15',
      totalDeliveries: 142,
      documentsVerified: true
    }
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const handleOnlineToggle = () => {
    setIsOnline(!isOnline);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'assigned': return 'warning';
      case 'picked up': return 'info';
      case 'in transit': return 'primary';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle = '', trend = null, loading: cardLoading = false }) => (
    <Card 
      sx={{ 
        height: '100%', 
        position: 'relative',
        background: `linear-gradient(135deg, ${theme.palette[color].main}15 0%, ${theme.palette[color].main}25 100%)`,
        border: `1px solid ${theme.palette[color].main}30`,
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${theme.palette[color].main}20`,
          border: `1px solid ${theme.palette[color].main}50`,
        }
      }}
    >
      {cardLoading ? (
        <CardContent>
          <Skeleton variant="rectangular" width="100%" height={80} />
        </CardContent>
      ) : (
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h3" 
                component="div" 
                fontWeight="bold"
                sx={{ 
                  color: theme.palette[color].main,
                  mb: 0.5,
                  fontSize: { xs: '1.8rem', sm: '2.2rem' }
                }}
              >
                {value}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontWeight: 500, mb: subtitle ? 0.5 : 0 }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box 
              sx={{ 
                p: 1.5,
                borderRadius: 2,
                bgcolor: `${theme.palette[color].main}15`,
                color: theme.palette[color].main
              }}
            >
              {icon}
            </Box>
          </Box>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUpIcon 
                sx={{ 
                  fontSize: 16, 
                  color: trend > 0 ? 'success.main' : 'error.main',
                  mr: 0.5 
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: trend > 0 ? 'success.main' : 'error.main',
                  fontWeight: 600
                }}
              >
                {trend > 0 ? '+' : ''}{trend}% from last month
              </Typography>
            </Box>
          )}
        </CardContent>
      )}
    </Card>
  );

  // Navigation items for responsive sidebar
  const navigationItems = [
    { icon: <DashboardIcon />, label: 'Dashboard', index: 0, badge: null },
    { icon: <DeliveriesIcon />, label: 'Deliveries', index: 1, badge: 3 },
    { icon: <RouteIcon />, label: 'Routes', index: 2, badge: null },
    { icon: <AnalyticsIcon />, label: 'Analytics', index: 3, badge: null },
    { icon: <ProfileIcon />, label: 'Profile', index: 4, badge: null },
    { icon: <NotificationsIcon />, label: 'Notifications', index: 5, badge: notifications }
  ];

  // Mobile sidebar component
  const MobileSidebar = () => (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DeliveryIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            Delivery Panel
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
            {user?.name?.charAt(0) || 'D'}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {user?.name || 'Delivery Partner'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Vehicle: {user?.vehicleType || 'Bike'}
            </Typography>
          </Box>
        </Box>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.index}
            button
            onClick={() => {
              setActiveTab(item.index);
              setMobileOpen(false);
            }}
            sx={{
              bgcolor: activeTab === item.index ? 'primary.light' : 'transparent',
              color: activeTab === item.index ? 'primary.main' : 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.badge ? (
                <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const OnlineStatusCard = () => (
    <Card sx={{ 
      mb: 3, 
      bgcolor: isOnline ? 'success.light' : 'grey.200',
      border: `2px solid ${isOnline ? theme.palette.success.main : theme.palette.grey[400]}`,
      borderRadius: 3
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              bgcolor: isOnline ? 'success.main' : 'grey.500',
              mr: 2,
              animation: isOnline ? 'pulse 2s infinite' : 'none'
            }} />
            <Box>
              <Typography variant="h6" fontWeight="bold" color={isOnline ? 'success.dark' : 'text.secondary'}>
                {isOnline ? 'You are Online' : 'You are Offline'}
              </Typography>
              <Typography variant="body2" color={isOnline ? 'success.dark' : 'text.secondary'}>
                {isOnline ? 'Ready to receive delivery assignments' : 'Not available for new deliveries'}
              </Typography>
            </Box>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={isOnline}
                onChange={handleOnlineToggle}
                color="success"
                size="large"
              />
            }
            label={isOnline ? 'Go Offline' : 'Go Online'}
            labelPlacement="start"
          />
        </Box>
      </CardContent>
    </Card>
  );

  // Show loading screen on initial load
  if (pageLoading) {
    return <AgriNetLoader message="Loading Delivery Dashboard..." variant="full" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Modern Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <DeliveryIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Delivery Partner Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back, {user?.name || 'Partner'}! Vehicle: {user?.vehicleType || 'Bike'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit" sx={{ color: 'text.primary' }}>
                <Badge badgeContent={notifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                {user?.name?.charAt(0) || 'D'}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <ProfileIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <SettingsIcon sx={{ mr: 1 }} /> Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        <MobileSidebar />
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        {/* Desktop Navigation Tabs */}
        {!isMobile && (
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 72,
                  fontSize: '0.95rem',
                  fontWeight: 500
                }
              }}
            >
              <Tab icon={<DashboardIcon />} label="Dashboard" />
              <Tab 
                icon={
                  <Badge badgeContent={3} color="error">
                    <DeliveriesIcon />
                  </Badge>
                } 
                label="Deliveries" 
              />
              <Tab icon={<RouteIcon />} label="Routes" />
              <Tab icon={<AnalyticsIcon />} label="Analytics" />
              <Tab icon={<ProfileIcon />} label="Profile" />
              <Tab 
                icon={
                  <Badge badgeContent={notifications} color="error">
                    <NotificationsIcon />
                  </Badge>
                } 
                label="Notifications" 
              />
            </Tabs>
          </Paper>
        )}

        {/* Content based on active tab */}
        {activeTab === 0 && (
          <Box>
            {/* Online Status */}
            <OnlineStatusCard />

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard
                  title="Total Deliveries"
                  value={dashboardData.stats.totalDeliveries}
                  icon={<DeliveriesIcon sx={{ fontSize: 32 }} />}
                  color="primary"
                  trend={5.2}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard
                  title="Active Deliveries"
                  value={dashboardData.stats.activeDeliveries}
                  icon={<TimerIcon sx={{ fontSize: 32 }} />}
                  color="warning"
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard
                  title="Total Earnings"
                  value={`₹${dashboardData.stats.totalEarnings.toLocaleString()}`}
                  icon={<MoneyIcon sx={{ fontSize: 32 }} />}
                  color="success"
                  trend={12.8}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard
                  title="Today's Deliveries"
                  value={dashboardData.stats.todayDeliveries}
                  icon={<VehicleIcon sx={{ fontSize: 32 }} />}
                  color="info"
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard
                  title="Rating"
                  value={dashboardData.stats.averageRating}
                  icon={<StarIcon sx={{ fontSize: 32 }} />}
                  color="secondary"
                  subtitle={`${dashboardData.stats.completionRate}% completion`}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard
                  title="Today's Earnings"
                  value={`₹${dashboardData.todayStats.totalEarnings}`}
                  icon={<TrendingUpIcon sx={{ fontSize: 32 }} />}
                  color="success"
                  subtitle={`${dashboardData.todayStats.totalDistance} km`}
                  loading={loading}
                />
              </Grid>
            </Grid>

            {/* Active Deliveries and Today's Summary */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardHeader
                    title="Active Deliveries"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                    action={
                      <Button 
                        variant="contained" 
                        size="small" 
                        startIcon={<NavigationIcon />}
                        disabled={!isOnline}
                        sx={{ borderRadius: 2 }}
                      >
                        Start Navigation
                      </Button>
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                    {dashboardData.activeDeliveries.length > 0 ? (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                              <TableCell sx={{ fontWeight: 600, display: { xs: 'none', sm: 'table-cell' } }}>Pickup</TableCell>
                              <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>Delivery</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>ETA</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dashboardData.activeDeliveries.map((delivery) => (
                              <TableRow 
                                key={delivery.id}
                                sx={{ 
                                  '&:hover': { bgcolor: 'action.hover' },
                                  '&:last-child td, &:last-child th': { border: 0 }
                                }}
                              >
                                <TableCell>
                                  <Typography variant="body2" fontWeight="medium">
                                    {delivery.orderNumber}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.light' }}>
                                      {delivery.customer.charAt(0)}
                                    </Avatar>
                                    <Typography variant="body2">
                                      {delivery.customer}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                  <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                                    {delivery.pickup}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                  <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                                    {delivery.delivery}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" fontWeight="bold" color="success.main">
                                    ₹{delivery.amount}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={delivery.status}
                                    color={getStatusColor(delivery.status)}
                                    size="small"
                                    sx={{ borderRadius: 2 }}
                                  />
                                </TableCell>
                                <TableCell>{delivery.estimatedTime}</TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="Navigate">
                                      <IconButton size="small" sx={{ color: 'primary.main' }}>
                                        <NavigationIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="View Details">
                                      <IconButton size="small" sx={{ color: 'info.main' }}>
                                        <ViewIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        No active deliveries. {isOnline ? 'You will receive new assignments soon!' : 'Go online to receive assignments.'}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Today's Summary */}
              <Grid item xs={12} lg={4}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: '100%' }}>
                  <CardHeader
                    title="Today's Summary"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Completion Rate</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {dashboardData.stats.completionRate}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={dashboardData.stats.completionRate} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight="bold" color="primary.contrastText">
                            {dashboardData.todayStats.deliveriesCompleted}
                          </Typography>
                          <Typography variant="caption" color="primary.contrastText">
                            Completed
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight="bold" color="success.contrastText">
                            {dashboardData.todayStats.totalDistance}
                          </Typography>
                          <Typography variant="caption" color="success.contrastText">
                            km traveled
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight="bold" color="warning.contrastText">
                            {dashboardData.todayStats.averageTime}
                          </Typography>
                          <Typography variant="caption" color="warning.contrastText">
                            avg time (mins)
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 2, textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight="bold" color="info.contrastText">
                            ₹{dashboardData.todayStats.totalEarnings}
                          </Typography>
                          <Typography variant="caption" color="info.contrastText">
                            earnings
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Other tab content */}
        {activeTab === 1 && (
          <Box>
            {/* Deliveries Section */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardHeader
                    title="Delivery Assignments"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                    action={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={isOnline ? 'Online' : 'Offline'} 
                          color={isOnline ? 'success' : 'default'} 
                          icon={isOnline ? <CheckCircleIcon /> : <WarningIcon />}
                        />
                        <Button 
                          variant="outlined" 
                          startIcon={<RefreshIcon />}
                          onClick={handleRefresh}
                          sx={{ borderRadius: 2 }}
                        >
                          Refresh
                        </Button>
                      </Box>
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        {[
                          { label: 'Assigned', count: 2, color: 'warning' },
                          { label: 'In Transit', count: 1, color: 'primary' },
                          { label: 'Delivered Today', count: 8, color: 'success' },
                          { label: 'Pending Pickup', count: 1, color: 'info' }
                        ].map((status) => (
                          <Grid item xs={6} sm={3} key={status.label}>
                            <Card sx={{ bgcolor: `${status.color}.light`, color: `${status.color}.contrastText`, textAlign: 'center', p: 2 }}>
                              <Typography variant="h4" fontWeight="bold">{status.count}</Typography>
                              <Typography variant="body2">{status.label}</Typography>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    
                    {/* Active Deliveries Table */}
                    <Typography variant="h6" gutterBottom>Active Deliveries</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Pickup Location</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Delivery Address</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dashboardData.activeDeliveries.map((delivery) => (
                            <TableRow key={delivery.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {delivery.orderNumber}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.light' }}>
                                    {delivery.customer.charAt(0)}
                                  </Avatar>
                                  <Typography variant="body2">{delivery.customer}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ maxWidth: 150 }} noWrap>
                                  {delivery.pickup}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ maxWidth: 150 }} noWrap>
                                  {delivery.delivery}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={delivery.status}
                                  color={getStatusColor(delivery.status)}
                                  size="small"
                                  sx={{ borderRadius: 2 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <Tooltip title="Navigate">
                                    <IconButton size="small" sx={{ color: 'primary.main' }}>
                                      <NavigationIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Update Status">
                                    <IconButton size="small" sx={{ color: 'warning.main' }}>
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Contact Customer">
                                    <IconButton size="small" sx={{ color: 'info.main' }}>
                                      <PhoneIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    {dashboardData.activeDeliveries.length === 0 && (
                      <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                        {isOnline ? 'No active deliveries. New assignments will appear here.' : 'Go online to receive delivery assignments.'}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeTab === 2 && (
          <Box>
            {/* Routes Section */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardHeader
                    title="Route Management"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                    action={
                      <Button 
                        variant="contained" 
                        startIcon={<NavigationIcon />}
                        sx={{ borderRadius: 2 }}
                      >
                        Optimize Route
                      </Button>
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Grid container spacing={3}>
                      {dashboardData.routes.map((route) => (
                        <Grid item xs={12} md={4} key={route.id}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              bgcolor: route.status === 'Active' ? 'primary.light' : 
                                       route.status === 'Completed' ? 'success.light' : 'grey.100',
                              color: route.status === 'Active' ? 'primary.contrastText' : 
                                     route.status === 'Completed' ? 'success.contrastText' : 'text.primary'
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <MapIcon sx={{ mr: 1, fontSize: 24 }} />
                                <Typography variant="h6" fontWeight="bold">
                                  {route.name}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" gutterBottom>
                                  <AssignmentIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                  {route.assignments} Assignments
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <SpeedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                  {route.distance}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <TimerIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                  {route.estimatedTime}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Chip
                                  label={route.status}
                                  size="small"
                                  color={
                                    route.status === 'Active' ? 'primary' :
                                    route.status === 'Completed' ? 'success' : 'default'
                                  }
                                  variant="filled"
                                  sx={{ borderRadius: 2 }}
                                />
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <Tooltip title="View Route">
                                    <IconButton size="small">
                                      <ViewIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Navigate">
                                    <IconButton size="small">
                                      <NavigationIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    
                    {/* Route Optimization Tips */}
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        Route Optimization Tips
                      </Typography>
                      <Grid container spacing={2}>
                        {[
                          { icon: <TimerIcon />, title: 'Save Time', desc: 'Optimize routes to reduce delivery time by up to 30%' },
                          { icon: <MoneyIcon />, title: 'Save Fuel', desc: 'Efficient routes can reduce fuel costs significantly' },
                          { icon: <CheckCircleIcon />, title: 'Better Service', desc: 'Timely deliveries improve customer satisfaction' }
                        ].map((tip, index) => (
                          <Grid item xs={12} sm={4} key={index}>
                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                              <Box sx={{ mr: 2, color: 'primary.main' }}>
                                {tip.icon}
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {tip.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {tip.desc}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeTab === 3 && (
          <Box>
            {/* Analytics Section */}
            <Grid container spacing={3}>
              {/* Weekly Performance */}
              <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardHeader
                    title="Delivery Analytics"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                    action={
                      <Button variant="outlined" startIcon={<BarChartIcon />} sx={{ borderRadius: 2 }}>
                        Export Report
                      </Button>
                    }
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                          <Typography variant="h4" fontWeight="bold" color="success.contrastText">
                            ₹{dashboardData.stats.totalEarnings.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="success.contrastText">Total Earnings</Typography>
                          <Typography variant="caption" color="success.contrastText">
                            +12.8% from last month
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                          <Typography variant="h4" fontWeight="bold" color="primary.contrastText">
                            {dashboardData.stats.totalDeliveries}
                          </Typography>
                          <Typography variant="body2" color="primary.contrastText">Total Deliveries</Typography>
                          <Typography variant="caption" color="primary.contrastText">
                            +5.2% from last month
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>Weekly Earnings Trend</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: 100 }}>
                        {dashboardData.analytics.weeklyEarnings.map((value, index) => (
                          <Box
                            key={index}
                            sx={{
                              flex: 1,
                              height: `${(value / Math.max(...dashboardData.analytics.weeklyEarnings)) * 100}%`,
                              bgcolor: 'primary.main',
                              borderRadius: '4px 4px 0 0',
                              minHeight: '10px',
                              transition: 'all 0.3s ease'
                            }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                          <Typography key={day} variant="caption" color="text.secondary">
                            {day}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Performance Metrics */}
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: '100%' }}>
                  <CardHeader
                    title="Performance Metrics"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    {[
                      { label: 'On-Time Delivery', value: `${dashboardData.analytics.performanceMetrics.onTimeDelivery}%`, color: 'success' },
                      { label: 'Customer Rating', value: dashboardData.analytics.performanceMetrics.customerRating, color: 'warning' },
                      { label: 'Total Distance', value: `${dashboardData.analytics.performanceMetrics.totalDistance} km`, color: 'info' },
                      { label: 'Fuel Efficiency', value: `${dashboardData.analytics.performanceMetrics.fuelEfficiency} km/l`, color: 'primary' }
                    ].map((metric, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {metric.label}
                          </Typography>
                          <Typography variant="body2" color={`${metric.color}.main`} fontWeight="bold">
                            {metric.value}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={index === 0 ? metric.value.replace('%', '') : (index === 1 ? (parseFloat(metric.value) / 5) * 100 : 75)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: `${metric.color}.main`
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Monthly Statistics */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardHeader
                    title="Monthly Statistics"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      {[
                        { title: 'Average Daily Earnings', value: '₹' + Math.round(dashboardData.stats.totalEarnings / 30), color: 'success', icon: <MoneyIcon /> },
                        { title: 'Average Delivery Time', value: '18 mins', color: 'info', icon: <TimerIcon /> },
                        { title: 'Distance Covered', value: '245 km', color: 'primary', icon: <SpeedIcon /> },
                        { title: 'Customer Satisfaction', value: '4.6/5', color: 'warning', icon: <StarIcon /> }
                      ].map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <Card sx={{ bgcolor: `${stat.color}.light`, color: `${stat.color}.contrastText`, textAlign: 'center', p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                              {stat.icon}
                            </Box>
                            <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                            <Typography variant="body2">{stat.title}</Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeTab === 4 && (
          <Box>
            {/* Profile Section */}
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardHeader
                    title="Delivery Partner Profile"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                    action={
                      <Button variant="outlined" startIcon={<EditIcon />} sx={{ borderRadius: 2 }}>
                        Edit Profile
                      </Button>
                    }
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={dashboardData.profile.name}
                          variant="outlined"
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={dashboardData.profile.email}
                          variant="outlined"
                          InputProps={{ 
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={dashboardData.profile.phone}
                          variant="outlined"
                          InputProps={{ 
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Vehicle Type"
                          value={dashboardData.profile.vehicleType}
                          variant="outlined"
                          InputProps={{ 
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <VehicleIcon />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          value={dashboardData.profile.address}
                          variant="outlined"
                          multiline
                          rows={2}
                          InputProps={{ 
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <HomeIcon />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Vehicle Number"
                          value={dashboardData.profile.vehicleNumber}
                          variant="outlined"
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="License Number"
                          value={dashboardData.profile.licenseNumber}
                          variant="outlined"
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Statistics & Status */}
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', mb: 3 }}>
                  <CardHeader
                    title="Account Status"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                      <Typography variant="body2">
                        {dashboardData.profile.documentsVerified ? 'Documents Verified' : 'Verification Pending'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StarIcon sx={{ color: 'warning.main', mr: 1 }} />
                      <Typography variant="body2">
                        {dashboardData.stats.averageRating} Star Rating
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DeliveriesIcon sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="body2">
                        {dashboardData.profile.totalDeliveries} Total Deliveries
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ color: 'info.main', mr: 1 }} />
                      <Typography variant="body2">
                        Member since {new Date(dashboardData.profile.joinedDate).getFullYear()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardHeader
                    title="Quick Stats"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'primary.light', borderRadius: 2 }}>
                          <Typography variant="h6" fontWeight="bold" color="primary.contrastText">
                            {dashboardData.stats.completionRate}%
                          </Typography>
                          <Typography variant="caption" color="primary.contrastText">
                            Completion Rate
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'success.light', borderRadius: 2 }}>
                          <Typography variant="h6" fontWeight="bold" color="success.contrastText">
                            {dashboardData.stats.todayDeliveries}
                          </Typography>
                          <Typography variant="caption" color="success.contrastText">
                            Today's Deliveries
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>

      {/* Add Floating Action Button for quick actions */}
      <Fab
        color={isOnline ? "success" : "primary"}
        aria-label="toggle online"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={handleOnlineToggle}
      >
        {isOnline ? <StopIcon /> : <StartIcon />}
      </Fab>
    </Box>
  );
};

export default DeliveryDashboard;