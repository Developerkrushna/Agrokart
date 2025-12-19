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
  Fade,
  Slide,
  Zoom,
  Grow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  OutlinedInput,
  InputAdornment,
  keyframes
} from '@mui/material';
import {
  Business as VendorIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  Analytics as AnalyticsIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  People as CustomersIcon,
  Star as StarIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Inventory2 as InventoryIcon,
  ShoppingBag as BagIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  NotificationsActive as ActiveNotificationIcon,
  AutoGraph as AutoGraphIcon,
  Agriculture as AgricultureIcon,
  Speed as SpeedIcon,
  Cloud as CloudIcon,
  Thermostat as ThermostatIcon,
  WaterDrop as WaterDropIcon,
  WbSunny as WbSunnyIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AgriNetLoader from '../components/AgriNetLoader';

// Add futuristic animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(22, 163, 74, 0.5); }
  50% { box-shadow: 0 0 20px rgba(22, 163, 74, 0.8); }
`;

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications] = useState(3);
  const [mounted, setMounted] = useState(false);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load
    setTimeout(() => {
      setMounted(true);
      setPageLoading(false);
    }, 2000);
  }, []);

  // Mock data - replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProducts: 24,
      activeOrders: 12,
      totalRevenue: 45230,
      totalCustomers: 156,
      averageRating: 4.3
    },
    recentOrders: [
      { id: 'ORD001', customer: 'Ram Kumar', product: 'Organic Tomatoes', quantity: '10 kg', amount: 450, status: 'Pending' },
      { id: 'ORD002', customer: 'Priya Sharma', product: 'Fresh Potatoes', quantity: '25 kg', amount: 375, status: 'Processing' },
      { id: 'ORD003', customer: 'Suresh Patel', product: 'Onions', quantity: '15 kg', amount: 300, status: 'Delivered' },
      { id: 'ORD004', customer: 'Anita Singh', product: 'Carrots', quantity: '8 kg', amount: 240, status: 'Shipped' }
    ],
    topProducts: [
      { name: 'Organic Tomatoes', sales: 450, stock: 89 },
      { name: 'Fresh Potatoes', sales: 320, stock: 156 },
      { name: 'Onions', sales: 280, stock: 78 },
      { name: 'Carrots', sales: 190, stock: 45 }
    ],
    products: [
      { id: 1, name: 'Organic Tomatoes', category: 'Vegetables', price: 45, stock: 89, status: 'Active', image: '/api/placeholder/100/100' },
      { id: 2, name: 'Fresh Potatoes', category: 'Vegetables', price: 15, stock: 156, status: 'Active', image: '/api/placeholder/100/100' },
      { id: 3, name: 'Red Onions', category: 'Vegetables', price: 20, stock: 78, status: 'Active', image: '/api/placeholder/100/100' },
      { id: 4, name: 'Baby Carrots', category: 'Vegetables', price: 30, stock: 45, status: 'Low Stock', image: '/api/placeholder/100/100' },
      { id: 5, name: 'Organic Spinach', category: 'Leafy Greens', price: 25, stock: 23, status: 'Low Stock', image: '/api/placeholder/100/100' }
    ],
    notifications: [
      { id: 1, title: 'New Order Received', message: 'Order #ORD123 for Organic Tomatoes', time: '5 minutes ago', type: 'order', read: false },
      { id: 2, title: 'Low Stock Alert', message: 'Baby Carrots stock is running low (45 units left)', time: '1 hour ago', type: 'stock', read: false },
      { id: 3, title: 'Payment Received', message: 'Payment of ₹1,250 received for Order #ORD120', time: '3 hours ago', type: 'payment', read: true },
      { id: 4, title: 'Product Review', message: 'New 5-star review for Organic Tomatoes', time: '1 day ago', type: 'review', read: true },
      { id: 5, title: 'Profile Updated', message: 'Your vendor profile has been successfully updated', time: '2 days ago', type: 'info', read: true }
    ],
    analytics: {
      salesTrend: [12, 19, 15, 25, 22, 30, 28],
      ordersTrend: [5, 8, 6, 12, 10, 15, 14],
      topCategories: [
        { name: 'Vegetables', sales: 45230, percentage: 65 },
        { name: 'Fruits', sales: 22150, percentage: 32 },
        { name: 'Herbs', sales: 2100, percentage: 3 }
      ],
      monthlyRevenue: {
        current: 45230,
        previous: 38900,
        growth: 16.3
      }
    },
    profile: {
      businessName: 'Green Valley Farms',
      ownerName: user?.name || 'Vendor Name',
      email: user?.email || 'vendor@agrokart.com',
      phone: '+91 9876543210',
      address: 'Plot 123, Green Valley, Agricultural Zone, Delhi - 110001',
      gst: 'GST123456789',
      established: '2018',
      description: 'We are a leading supplier of fresh, organic vegetables directly from our farms to your doorstep.',
      certifications: ['Organic Certified', 'ISO 9001', 'FSSAI Licensed']
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
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
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${theme.palette[color].main}20`,
          border: `1px solid ${theme.palette[color].main}50`,
        }
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette[color].main}20 0%, transparent 70%)`,
          animation: `${float} 8s ease-in-out infinite`,
          pointerEvents: 'none'
        }}
      />
      
      {cardLoading ? (
        <CardContent>
          <Skeleton variant="rectangular" width="100%" height={80} />
        </CardContent>
      ) : (
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h3" 
                component="div" 
                fontWeight="bold"
                sx={{ 
                  color: theme.palette[color].main,
                  mb: 0.5,
                  fontSize: { xs: '1.8rem', sm: '2.2rem' },
                  textShadow: `0 0 10px ${theme.palette[color].main}30`
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
                color: theme.palette[color].main,
                animation: `${pulse} 2s ease-in-out infinite`
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

  // Add Product Dialog Component
  const AddProductDialog = () => (
    <Dialog open={showAddProductDialog} onClose={() => setShowAddProductDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Product Name" placeholder="Enter product name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select>
                <SelectMenuItem value="vegetables">Vegetables</SelectMenuItem>
                <SelectMenuItem value="fruits">Fruits</SelectMenuItem>
                <SelectMenuItem value="herbs">Herbs</SelectMenuItem>
                <SelectMenuItem value="grains">Grains</SelectMenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Price per KG" placeholder="₹0" type="number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Stock Quantity" placeholder="0" type="number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select defaultValue="active">
                <SelectMenuItem value="active">Active</SelectMenuItem>
                <SelectMenuItem value="inactive">Inactive</SelectMenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description" placeholder="Enter product description" multiline rows={3} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowAddProductDialog(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => setShowAddProductDialog(false)}>Add Product</Button>
      </DialogActions>
    </Dialog>
  );

  // Show loading screen on initial load
  if (pageLoading) {
    return <AgriNetLoader message="Loading Vendor Dashboard..." variant="full" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Futuristic Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}20 0%, transparent 20%), radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}20 0%, transparent 20%)`,
            animation: `${float} 6s ease-in-out infinite`,
            pointerEvents: 'none'
          }}
        />
        
        <Toolbar sx={{ position: 'relative', zIndex: 2 }}>
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
            <Box 
              sx={{ 
                animation: `${pulse} 2s ease-in-out infinite`,
                mr: 2 
              }}
            >
              <VendorIcon sx={{ fontSize: 36, color: theme.palette.primary.main }} />
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                color="text.primary"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Vendor Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back, {user?.name || 'Vendor'}!
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                sx={{ 
                  color: 'text.primary',
                  animation: notifications > 0 ? `${glow} 2s ease-in-out infinite` : 'none'
                }}
              >
                <Badge badgeContent={notifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 44, 
                  height: 44,
                  animation: `${pulse} 3s ease-in-out infinite`
                }}
              >
                {user?.name?.charAt(0) || 'V'}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: 3,
                  mt: 1.5,
                  boxShadow: `0 10px 25px rgba(0,0,0,0.15)`,
                  border: `1px solid ${theme.palette.divider}`,
                  backdropFilter: 'blur(10px)',
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}90 100%)`
                }
              }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <ProfileIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <SettingsIcon sx={{ mr: 1, color: theme.palette.secondary.main }} /> Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 1, color: 'error.main' }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

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
              <Tab icon={<ProductsIcon />} label="Products" />
              <Tab 
                icon={
                  <Badge badgeContent={12} color="error">
                    <OrdersIcon />
                  </Badge>
                } 
                label="Orders" 
              />
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
        <Fade in={mounted} timeout={800}>
          <Box>
            {activeTab === 0 && (
              <Box>
                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Total Products",
                      value: dashboardData.stats.totalProducts,
                      icon: <ProductsIcon sx={{ fontSize: 32 }} />,
                      color: "primary",
                      trend: 8.2
                    },
                    {
                      title: "Active Orders",
                      value: dashboardData.stats.activeOrders,
                      icon: <OrdersIcon sx={{ fontSize: 32 }} />,
                      color: "warning",
                      trend: -2.1
                    },
                    {
                      title: "Total Revenue",
                      value: `₹${dashboardData.stats.totalRevenue.toLocaleString()}`,
                      icon: <MoneyIcon sx={{ fontSize: 32 }} />,
                      color: "success",
                      subtitle: "This month",
                      trend: 15.3
                    },
                    {
                      title: "Customers",
                      value: dashboardData.stats.totalCustomers,
                      icon: <CustomersIcon sx={{ fontSize: 32 }} />,
                      color: "info",
                      trend: 12.5
                    },
                    {
                      title: "Avg Rating",
                      value: dashboardData.stats.averageRating,
                      icon: <StarIcon sx={{ fontSize: 32 }} />,
                      color: "secondary",
                      subtitle: "Customer reviews",
                      trend: 0.3
                    }
                  ].map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={2.4} key={stat.title}>
                      <Grow in={mounted} timeout={600 + index * 100}>
                        <div>
                          <StatCard
                            {...stat}
                            loading={loading}
                          />
                        </div>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
                
                {/* Recent Orders and Top Products */}
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={8}>
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}f0 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CardHeader
                        title="Recent Orders"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        action={
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<ViewIcon />}
                            sx={{ 
                              borderRadius: 2,
                              borderColor: `${theme.palette.primary.main}30`,
                              color: theme.palette.primary.main,
                              '&:hover': {
                                borderColor: theme.palette.primary.main,
                                bgcolor: `${theme.palette.primary.main}10`
                              }
                            }}
                          >
                            View All
                          </Button>
                        }
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '& .MuiCardHeader-action': {
                            alignSelf: 'center',
                            mt: 0,
                            mr: 0
                          }
                        }}
                      />
                      <CardContent sx={{ pt: 0 }}>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Order ID</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Customer</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main, display: { xs: 'none', sm: 'table-cell' } }}>Product</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main, display: { xs: 'none', md: 'table-cell' } }}>Quantity</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {dashboardData.recentOrders.map((order) => (
                                <TableRow 
                                  key={order.id}
                                  sx={{ 
                                    '&:hover': { 
                                      bgcolor: `${theme.palette.primary.main}05`,
                                      transform: 'scale(1.01)',
                                      transition: 'all 0.2s ease'
                                    },
                                    '&:last-child td, &:last-child th': { border: 0 }
                                  }}
                                >
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                      {order.id}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Avatar 
                                        sx={{ 
                                          width: 36, 
                                          height: 36, 
                                          mr: 1.5, 
                                          bgcolor: `${theme.palette.primary.main}20`,
                                          color: theme.palette.primary.main
                                        }}
                                      >
                                        {order.customer.charAt(0)}
                                      </Avatar>
                                      <Typography variant="body2">
                                        {order.customer}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                                      {order.product}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                    <Typography variant="body2">
                                      {order.quantity}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                      ₹{order.amount}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={order.status}
                                      color={getStatusColor(order.status)}
                                      size="small"
                                      sx={{ 
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        fontSize: '0.7rem',
                                        letterSpacing: '0.5px'
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                      <Tooltip title="Edit Order">
                                        <IconButton 
                                          size="small" 
                                          sx={{ 
                                            color: 'primary.main',
                                            bgcolor: `${theme.palette.primary.main}10`,
                                            '&:hover': {
                                              bgcolor: `${theme.palette.primary.main}20`
                                            }
                                          }}
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="View Details">
                                        <IconButton 
                                          size="small" 
                                          sx={{ 
                                            color: 'info.main',
                                            bgcolor: `${theme.palette.info.main}10`,
                                            '&:hover': {
                                              bgcolor: `${theme.palette.info.main}20`
                                            }
                                          }}
                                        >
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
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} lg={4}>
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
                        height: '100%',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}f0 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CardHeader
                        title="Top Products"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        action={
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<AddIcon />}
                            sx={{ 
                              borderRadius: 2,
                              borderColor: `${theme.palette.success.main}30`,
                              color: theme.palette.success.main,
                              '&:hover': {
                                borderColor: theme.palette.success.main,
                                bgcolor: `${theme.palette.success.main}10`
                              }
                            }}
                          >
                            Add Product
                          </Button>
                        }
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '& .MuiCardHeader-action': {
                            alignSelf: 'center',
                            mt: 0,
                            mr: 0
                          }
                        }}
                      />
                      <CardContent sx={{ pt: 0 }}>
                        {dashboardData.topProducts.map((product, index) => (
                          <Box 
                            key={product.name}
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              py: 2.5,
                              borderBottom: index < dashboardData.topProducts.length - 1 ? '1px solid' : 'none',
                              borderColor: 'divider',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateX(5px)',
                                bgcolor: `${theme.palette.primary.main}05`
                              }
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="body2" 
                                fontWeight="medium"
                                sx={{ 
                                  color: theme.palette.text.primary,
                                  mb: 0.5
                                }}
                              >
                                {product.name}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                <SpeedIcon sx={{ fontSize: 12 }} />
                                {product.sales} sold • 
                                <InventoryIcon sx={{ fontSize: 12, ml: 1 }} />
                                {product.stock} in stock
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography 
                                variant="body2" 
                                fontWeight="bold" 
                                color="success.main"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  gap: 0.5
                                }}
                              >
                                <AttachMoneyIcon sx={{ fontSize: 16 }} />
                                {product.sales}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color={product.stock < 50 ? 'error.main' : 'success.main'}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  gap: 0.5
                                }}
                              >
                                <Inventory2Icon sx={{ fontSize: 12 }} />
                                {product.stock} units
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Other tab content */}
            {activeTab === 1 && (
              <Box>
                {/* Products Section */}
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}f0 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CardHeader
                        title="Product Management"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        action={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              size="small"
                              placeholder="Search products..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: 20 }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{ width: 200 }}
                            />
                            <Button 
                              variant="contained" 
                              startIcon={<AddIcon />}
                              onClick={() => setShowAddProductDialog(true)}
                              sx={{ 
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
                                '&:hover': {
                                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                  boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              Add Product
                            </Button>
                          </Box>
                        }
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '& .MuiCardHeader-action': {
                            alignSelf: 'center',
                            mt: 0,
                            mr: 0
                          }
                        }}
                      />
                      <CardContent sx={{ pt: 0 }}>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Product</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Price</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Stock</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {dashboardData.products
                                .filter(product => 
                                  product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  product.category.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((product) => (
                                <TableRow 
                                  key={product.id} 
                                  sx={{ 
                                    '&:hover': { 
                                      bgcolor: `${theme.palette.primary.main}05`,
                                      transform: 'scale(1.005)',
                                      transition: 'all 0.2s ease'
                                    }
                                  }}
                                >
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Avatar
                                        src={product.image}
                                        sx={{ 
                                          width: 44, 
                                          height: 44, 
                                          mr: 2, 
                                          bgcolor: `${theme.palette.primary.main}20`,
                                          border: `2px solid ${theme.palette.primary.main}30`
                                        }}
                                      >
                                        <CategoryIcon sx={{ color: theme.palette.primary.main }} />
                                      </Avatar>
                                      <Box>
                                        <Typography variant="body2" fontWeight="medium">
                                          {product.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          ID: {product.id}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={product.category} 
                                      size="small" 
                                      variant="outlined"
                                      sx={{
                                        borderRadius: 2,
                                        borderColor: `${theme.palette.primary.main}30`,
                                        color: theme.palette.primary.main
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                      ₹{product.price}/kg
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography 
                                      variant="body2" 
                                      color={product.stock < 50 ? 'error.main' : 'success.main'}
                                      fontWeight="medium"
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                      }}
                                    >
                                      <Inventory2Icon sx={{ fontSize: 16 }} />
                                      {product.stock} units
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={product.status}
                                      color={product.status === 'Active' ? 'success' : 'warning'}
                                      size="small"
                                      sx={{ 
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        fontSize: '0.7rem',
                                        letterSpacing: '0.5px'
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                      <Tooltip title="Edit Product">
                                        <IconButton 
                                          size="small" 
                                          sx={{ 
                                            color: 'primary.main',
                                            bgcolor: `${theme.palette.primary.main}10`,
                                            '&:hover': {
                                              bgcolor: `${theme.palette.primary.main}20`
                                            }
                                          }}
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="View Details">
                                        <IconButton 
                                          size="small" 
                                          sx={{ 
                                            color: 'info.main',
                                            bgcolor: `${theme.palette.info.main}10`,
                                            '&:hover': {
                                              bgcolor: `${theme.palette.info.main}20`
                                            }
                                          }}
                                        >
                                          <ViewIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Delete Product">
                                        <IconButton 
                                          size="small" 
                                          sx={{ 
                                            color: 'error.main',
                                            bgcolor: `${theme.palette.error.main}10`,
                                            '&:hover': {
                                              bgcolor: `${theme.palette.error.main}20`
                                            }
                                          }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box>
                {/* Orders Section */}
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                      <CardHeader
                        title="Order Management"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        action={
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip label={`${dashboardData.recentOrders.length} Total Orders`} color="primary" />
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
                              { label: 'Pending', count: 3, color: 'warning' },
                              { label: 'Processing', count: 5, color: 'info' },
                              { label: 'Shipped', count: 2, color: 'primary' },
                              { label: 'Delivered', count: 8, color: 'success' }
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
                        
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {dashboardData.recentOrders.map((order) => (
                                <TableRow key={order.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                      {order.id}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.light' }}>
                                        {order.customer.charAt(0)}
                                      </Avatar>
                                      <Typography variant="body2">
                                        {order.customer}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">{order.product}</Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">{order.quantity}</Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                      ₹{order.amount}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={order.status}
                                      color={getStatusColor(order.status)}
                                      size="small"
                                      sx={{ borderRadius: 2 }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                      <Tooltip title="View Order">
                                        <IconButton size="small" sx={{ color: 'info.main' }}>
                                          <ViewIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Update Status">
                                        <IconButton size="small" sx={{ color: 'warning.main' }}>
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Print Receipt">
                                        <IconButton size="small" sx={{ color: 'success.main' }}>
                                          <ReceiptIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
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
                  {/* Revenue Analytics */}
                  <Grid item xs={12} md={8}>
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}f0 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CardHeader
                        title="Sales Analytics"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        action={
                          <Button 
                            variant="outlined" 
                            startIcon={<BarChartIcon />} 
                            sx={{ 
                              borderRadius: 2,
                              borderColor: `${theme.palette.primary.main}30`,
                              color: theme.palette.primary.main,
                              '&:hover': {
                                borderColor: theme.palette.primary.main,
                                bgcolor: `${theme.palette.primary.main}10`
                              }
                            }}
                          >
                            Export Report
                          </Button>
                        }
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '& .MuiCardHeader-action': {
                            alignSelf: 'center',
                            mt: 0,
                            mr: 0
                          }
                        }}
                      />
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={4}>
                            <Box 
                              sx={{ 
                                textAlign: 'center', 
                                p: 3, 
                                bgcolor: `${theme.palette.success.main}20`,
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.success.main}30`,
                                animation: `${pulse} 3s ease-in-out infinite`,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                              }}
                            >
                              <Typography 
                                variant="h4" 
                                fontWeight="bold" 
                                color="success.contrastText"
                                sx={{
                                  textShadow: `0 0 10px ${theme.palette.success.main}80`
                                }}
                              >
                                ₹{dashboardData.analytics.monthlyRevenue.current.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="success.contrastText">This Month</Typography>
                              <Typography 
                                variant="caption" 
                                color="success.contrastText"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 0.5,
                                  mt: 1
                                }}
                              >
                                <TrendingUpIcon sx={{ fontSize: 14 }} />
                                +{dashboardData.analytics.monthlyRevenue.growth}% from last month
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <Typography 
                              variant="h6" 
                              gutterBottom
                              sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 600
                              }}
                            >
                              Sales Trend (Last 7 Days)
                            </Typography>
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'end', 
                                gap: 1, 
                                height: 120,
                                p: 2,
                                bgcolor: `${theme.palette.primary.main}05`,
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.primary.main}10`
                              }}
                            >
                              {dashboardData.analytics.salesTrend.map((value, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    flex: 1,
                                    height: `${(value / Math.max(...dashboardData.analytics.salesTrend)) * 100}%`,
                                    bgcolor: theme.palette.primary.main,
                                    borderRadius: '4px 4px 0 0',
                                    minHeight: '10px',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    '&:hover': {
                                      bgcolor: theme.palette.primary.dark,
                                      transform: 'scaleY(1.05)'
                                    },
                                    '&::after': {
                                      content: `"${value}"`,
                                      position: 'absolute',
                                      top: '-25px',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      fontSize: '0.7rem',
                                      color: theme.palette.primary.main,
                                      fontWeight: 600
                                    }
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
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Category Performance */}
                  <Grid item xs={12} md={4}>
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
                        height: '100%',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}f0 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CardHeader
                        title="Top Categories"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`
                        }}
                      />
                      <CardContent sx={{ pt: 0 }}>
                        {dashboardData.analytics.topCategories.map((category, index) => (
                          <Box key={category.name} sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography 
                                variant="body2" 
                                fontWeight="medium"
                                sx={{
                                  color: theme.palette.text.primary
                                }}
                              >
                                {category.name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="success.main" 
                                fontWeight="bold"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                <AttachMoneyIcon sx={{ fontSize: 14 }} />
                                {category.sales.toLocaleString()}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={category.percentage}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: index === 0 ? 'primary.main' : index === 1 ? 'secondary.main' : 'warning.main',
                                  borderRadius: 5,
                                  backgroundImage: `linear-gradient(90deg, transparent 0%, ${index === 0 ? theme.palette.primary.main : index === 1 ? theme.palette.secondary.main : theme.palette.warning.main}30 50%, transparent 100%)`
                                }
                              }}
                            />
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                mt: 0.5
                              }}
                            >
                              <PieChartIcon sx={{ fontSize: 12 }} />
                              {category.percentage}% of total sales
                            </Typography>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Performance Metrics */}
                  <Grid item xs={12}>
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}f0 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CardHeader
                        title="Performance Metrics"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`
                        }}
                      />
                      <CardContent>
                        <Grid container spacing={3}>
                          {[
                            { title: 'Average Order Value', value: '₹' + Math.round(dashboardData.stats.totalRevenue / dashboardData.recentOrders.length), color: 'primary', icon: <MoneyIcon /> },
                            { title: 'Customer Retention', value: '78%', color: 'success', icon: <CustomersIcon /> },
                            { title: 'Product Views', value: '2.3K', color: 'info', icon: <ViewIcon /> },
                            { title: 'Conversion Rate', value: '12.5%', color: 'warning', icon: <TrendingUpIcon /> }
                          ].map((metric, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                              <Card 
                                sx={{ 
                                  bgcolor: `${theme.palette[metric.color].main}20`,
                                  color: `${theme.palette[metric.color].contrastText}`,
                                  textAlign: 'center', 
                                  p: 3,
                                  borderRadius: 3,
                                  border: `1px solid ${theme.palette[metric.color].main}30`,
                                  transition: 'all 0.3s ease',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: `0 10px 20px ${theme.palette[metric.color].main}30`
                                  }
                                }}
                              >
                                <Box 
                                  sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    mb: 2,
                                    animation: `${pulse} 2s ease-in-out infinite`
                                  }}
                                >
                                  {metric.icon}
                                </Box>
                                <Typography 
                                  variant="h5" 
                                  fontWeight="bold"
                                  sx={{
                                    textShadow: `0 0 5px ${theme.palette[metric.color].main}80`
                                  }}
                                >
                                  {metric.value}
                                </Typography>
                                <Typography variant="body2">{metric.title}</Typography>
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
                  {/* Business Information */}
                  <Grid item xs={12} md={8}>
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}f0 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CardHeader
                        title="Business Profile"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        action={
                          <Button 
                            variant="outlined" 
                            startIcon={<EditIcon />} 
                            sx={{ 
                              borderRadius: 2,
                              borderColor: `${theme.palette.primary.main}30`,
                              color: theme.palette.primary.main,
                              '&:hover': {
                                borderColor: theme.palette.primary.main,
                                bgcolor: `${theme.palette.primary.main}10`
                              }
                            }}
                          >
                            Edit Profile
                          </Button>
                        }
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '& .MuiCardHeader-action': {
                            alignSelf: 'center',
                            mt: 0,
                            mr: 0
                          }
                        }}
                      />
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Business Name"
                              value={dashboardData.profile.businessName}
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: `${theme.palette.primary.main}05`
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Owner Name"
                              value={dashboardData.profile.ownerName}
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: `${theme.palette.primary.main}05`
                                }
                              }}
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
                                    <EmailIcon sx={{ color: theme.palette.primary.main }} />
                                  </InputAdornment>
                                ),
                                sx: {
                                  borderRadius: 2,
                                  bgcolor: `${theme.palette.primary.main}05`
                                }
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2
                                }
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
                                    <PhoneIcon sx={{ color: theme.palette.primary.main }} />
                                  </InputAdornment>
                                ),
                                sx: {
                                  borderRadius: 2,
                                  bgcolor: `${theme.palette.primary.main}05`
                                }
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2
                                }
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
                                    <LocationIcon sx={{ color: theme.palette.primary.main }} />
                                  </InputAdornment>
                                ),
                                sx: {
                                  borderRadius: 2,
                                  bgcolor: `${theme.palette.primary.main}05`
                                }
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="GST Number"
                              value={dashboardData.profile.gst}
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: `${theme.palette.primary.main}05`
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Established Year"
                              value={dashboardData.profile.established}
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: `${theme.palette.primary.main}05`
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Description"
                              value={dashboardData.profile.description}
                              variant="outlined"
                              multiline
                              rows={3}
                              InputProps={{ readOnly: true }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: `${theme.palette.primary.main}05`
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Quick Stats & Certifications */}
                  <Grid item xs={12} md={4}>
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
                        mb: 3,
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}f0 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CardHeader
                        title="Account Status"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`
                        }}
                      />
                      <CardContent sx={{ pt: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                          <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, fontSize: 24 }} />
                          <Typography variant="body2">Account Verified</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                          <StarIcon sx={{ color: 'warning.main', mr: 1.5, fontSize: 24 }} />
                          <Typography variant="body2">
                            {dashboardData.stats.averageRating} Star Rating
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                          <BagIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 24 }} />
                          <Typography variant="body2">
                            {dashboardData.stats.totalProducts} Products Listed
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CustomersIcon sx={{ color: 'info.main', mr: 1.5, fontSize: 24 }} />
                          <Typography variant="body2">
                            {dashboardData.stats.totalCustomers} Customers Served
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}f0 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CardHeader
                        title="Certifications"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`
                        }}
                      />
                      <CardContent sx={{ pt: 0 }}>
                        {dashboardData.profile.certifications.map((cert, index) => (
                          <Chip
                            key={index}
                            label={cert}
                            color="success"
                            variant="outlined"
                            sx={{ 
                              mr: 1, 
                              mb: 1, 
                              borderRadius: 2,
                              borderColor: `${theme.palette.success.main}30`,
                              color: theme.palette.success.main,
                              '&:hover': {
                                bgcolor: `${theme.palette.success.main}10`
                              }
                            }}
                          />
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {activeTab === 5 && (
              <Box>
                {/* Notifications Section */}
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}f0 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CardHeader
                        title="Notifications"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        action={
                          <Button 
                            variant="outlined" 
                            startIcon={<CheckCircleIcon />}
                            sx={{ 
                              borderRadius: 2,
                              borderColor: `${theme.palette.primary.main}30`,
                              color: theme.palette.primary.main,
                              '&:hover': {
                                borderColor: theme.palette.primary.main,
                                bgcolor: `${theme.palette.primary.main}10`
                              }
                            }}
                          >
                            Mark All Read
                          </Button>
                        }
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '& .MuiCardHeader-action': {
                            alignSelf: 'center',
                            mt: 0,
                            mr: 0
                          }
                        }}
                      />
                      <CardContent sx={{ pt: 0 }}>
                        {dashboardData.notifications.map((notification) => {
                          const getNotificationIcon = (type) => {
                            switch (type) {
                              case 'order': return <OrdersIcon sx={{ color: 'primary.main' }} />;
                              case 'stock': return <WarningIcon sx={{ color: 'warning.main' }} />;
                              case 'payment': return <MoneyIcon sx={{ color: 'success.main' }} />;
                              case 'review': return <StarIcon sx={{ color: 'secondary.main' }} />;
                              default: return <InfoIcon sx={{ color: 'info.main' }} />;
                            }
                          };
                          
                          const getNotificationColor = (type) => {
                            switch (type) {
                              case 'order': return 'primary';
                              case 'stock': return 'warning';
                              case 'payment': return 'success';
                              case 'review': return 'secondary';
                              default: return 'info';
                            }
                          };
                          
                          return (
                            <Box
                              key={notification.id}
                              sx={{
                                p: 3,
                                mb: 2,
                                border: '1px solid',
                                borderColor: notification.read ? 'divider' : `${theme.palette[getNotificationColor(notification.type)].main}50`,
                                borderRadius: 3,
                                bgcolor: notification.read ? 'transparent' : `${theme.palette[getNotificationColor(notification.type)].main}10`,
                                opacity: notification.read ? 0.7 : 1,
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                  boxShadow: `0 4px 15px ${theme.palette[getNotificationColor(notification.type)].main}20`,
                                  transform: 'translateY(-2px)'
                                },
                                '&::before': notification.read ? {} : {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '4px',
                                  height: '100%',
                                  bgcolor: theme.palette[getNotificationColor(notification.type)].main
                                }
                              }}
                            >
                              {/* Animated background for unread notifications */}
                              {!notification.read && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: -20,
                                    right: -20,
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: `radial-gradient(circle, ${theme.palette[getNotificationColor(notification.type)].main}20 0%, transparent 70%)`,
                                    animation: `${float} 4s ease-in-out infinite`
                                  }}
                                />
                              )}
                              
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                                <Box 
                                  sx={{ 
                                    mr: 2, 
                                    mt: 0.5,
                                    p: 1,
                                    borderRadius: 2,
                                    bgcolor: `${theme.palette[getNotificationColor(notification.type)].main}20`,
                                    animation: notification.read ? 'none' : `${pulse} 2s ease-in-out infinite`
                                  }}
                                >
                                  {getNotificationIcon(notification.type)}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography 
                                    variant="body1" 
                                    fontWeight="medium" 
                                    gutterBottom
                                    sx={{
                                      color: theme.palette.text.primary
                                    }}
                                  >
                                    {notification.title}
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    gutterBottom
                                    sx={{
                                      lineHeight: 1.6
                                    }}
                                  >
                                    {notification.message}
                                  </Typography>
                                  <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5
                                    }}
                                  >
                                    <AccessTimeIcon sx={{ fontSize: 12 }} />
                                    {notification.time}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  {!notification.read && (
                                    <Tooltip title="Mark as read">
                                      <IconButton 
                                        size="small" 
                                        sx={{ 
                                          color: 'primary.main',
                                          bgcolor: `${theme.palette.primary.main}10`,
                                          '&:hover': {
                                            bgcolor: `${theme.palette.primary.main}20`
                                          }
                                        }}
                                      >
                                        <CheckCircleIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  <Tooltip title="Delete">
                                    <IconButton 
                                      size="small" 
                                      sx={{ 
                                        color: 'error.main',
                                        bgcolor: `${theme.palette.error.main}10`,
                                        '&:hover': {
                                          bgcolor: `${theme.palette.error.main}20`
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Box>
                          );
                        })}
                        
                        {dashboardData.notifications.length === 0 && (
                          <Box sx={{ textAlign: 'center', py: 6 }}>
                            <ActiveNotificationIcon 
                              sx={{ 
                                fontSize: 80, 
                                color: 'text.secondary', 
                                mb: 3,
                                animation: `${float} 3s ease-in-out infinite`
                              }} 
                            />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              No notifications yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              We'll notify you about orders, payments, and important updates.
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Fade>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}f0 100%)`,
            borderRight: `1px solid ${theme.palette.divider}`,
            backdropFilter: 'blur(10px)'
          },
        }}
      >
        <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header with animated background */}
          <Box 
            sx={{ 
              p: 2, 
              borderBottom: '1px solid', 
              borderColor: 'divider',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated background elements */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}20 0%, transparent 20%), radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}20 0%, transparent 20%)`,
                animation: `${float} 6s ease-in-out infinite`,
                pointerEvents: 'none'
              }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', zIndex: 2 }}>
              <VendorIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold">
                Vendor Panel
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
                {user?.name?.charAt(0) || 'V'}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {user?.name || 'Vendor'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Business: {user?.businessName || 'Your Business'}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Navigation Items */}
          <List sx={{ flex: 1, py: 1 }}>
            {[
              { icon: <DashboardIcon />, label: 'Dashboard', index: 0, badge: null },
              { icon: <ProductsIcon />, label: 'Products', index: 1, badge: null },
              { icon: <OrdersIcon />, label: 'Orders', index: 2, badge: 12 },
              { icon: <AnalyticsIcon />, label: 'Analytics', index: 3, badge: null },
              { icon: <ProfileIcon />, label: 'Profile', index: 4, badge: null },
              { icon: <NotificationsIcon />, label: 'Notifications', index: 5, badge: notifications }
            ].map((item) => (
              <ListItem
                key={item.index}
                button
                onClick={() => {
                  setActiveTab(item.index);
                  setMobileOpen(false);
                }}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  bgcolor: activeTab === item.index ? `${theme.palette.primary.main}20` : 'transparent',
                  color: activeTab === item.index ? 'primary.main' : 'text.primary',
                  border: activeTab === item.index ? `1px solid ${theme.palette.primary.main}30` : '1px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: activeTab === item.index ? `${theme.palette.primary.main}30` : 'action.hover',
                    transform: 'translateX(5px)'
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: 'inherit',
                    minWidth: 40
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    fontWeight: activeTab === item.index ? 600 : 400
                  }}
                />
              </ListItem>
            ))}
          </List>
          
          {/* Footer with logout button */}
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                borderColor: `${theme.palette.error.main}30`,
                color: theme.palette.error.main,
                '&:hover': {
                  borderColor: theme.palette.error.main,
                  bgcolor: `${theme.palette.error.main}10`
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Add Floating Action Button for quick actions */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', md: 'none' },
          width: 60,
          height: 60,
          boxShadow: `0 6px 20px ${theme.palette.primary.main}40`,
          animation: `${pulse} 2s ease-in-out infinite`,
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: `0 8px 25px ${theme.palette.primary.main}60`
          }
        }}
        onClick={() => setActiveTab(1)}
      >
        <AddIcon sx={{ fontSize: 32 }} />
      </Fab>
      
      {/* Add Product Dialog */}
      <AddProductDialog />
    </Box>
  );
};

export default VendorDashboard;