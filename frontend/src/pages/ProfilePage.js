import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Chip,
  LinearProgress,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  ShoppingBag as OrderIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  ArrowForward as ArrowForwardIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Agriculture as AgricultureIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  CameraAlt as CameraIcon,
  VerifiedUser as VerifiedIcon,
  Timeline as TimelineIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext';


const ProfilePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Statistics
  const stats = [
    { label: 'Number of Orders', value: '12', icon: OrderIcon, color: 'primary.main' },
    { label: 'Account Age', value: '2 years', icon: StarIcon, color: 'success.main' },
    { label: 'Loyalty Points', value: '850', icon: StarIcon, color: 'warning.main' },
    { label: 'Farm Size', value: `${user?.landDetails?.totalArea || 5} acres`, icon: AgricultureIcon, color: 'info.main' }
  ];



  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = () => {
    // Edit functionality removed - using real user data from AuthContext
    console.log('Edit profile functionality would be implemented here');
  };

  const handleSaveProfile = () => {
    // Save functionality removed - using real user data from AuthContext
    console.log('Save profile functionality would be implemented here');
  };



  return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account, orders, and preferences
          </Typography>
        </Box>



        <Grid container spacing={4}>
          {/* Profile Overview */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  zIndex: 0
                }}
              />
              
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{ 
                        bgcolor: 'white', 
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'grey.100' }
                      }}
                    >
                      <CameraIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    src={user?.avatar || '/images/avatar.jpg'}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      border: '4px solid rgba(255,255,255,0.3)',
                      fontSize: '3rem'
                    }}
                  >
                    {user?.name?.charAt(0) || 'JD'}
                  </Avatar>
                </Badge>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {user?.name || 'John Doe'}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Farmer
                  </Typography>
                  {user?.isVerified && (
                    <Tooltip title="Verified Account">
                      <VerifiedIcon sx={{ fontSize: 16, color: 'yellow' }} />
                    </Tooltip>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                  <Chip 
                    label="Premium Member" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Chip
                    label="850 pts"
                    size="small"
                    icon={<StarIcon />}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditProfile}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<OrderIcon />}
                    onClick={() => navigate('/my-orders')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    My Orders
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Statistics Cards */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      textAlign: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        boxShadow: 2,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: stat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1
                      }}
                    >
                      <stat.icon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Farm Details */}
            <Card sx={{ mt: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <AgricultureIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Farm Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Farm Size
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(user?.landDetails?.totalArea / 20) * 100} 
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {user?.landDetails?.totalArea || 0} acres
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Crops
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user?.landDetails?.crops?.map((crop, index) => (
                    <Chip
                      key={index}
                      label={typeof crop === 'string' ? crop : crop.name || 'Unknown Crop'}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: 'grey.50'
                }}
              >
                <Tab
                  icon={<FavoriteIcon />}
                  label="Favorites"
                  sx={{ fontWeight: 'bold' }}
                />
                <Tab
                  icon={<SettingsIcon />}
                  label="Settings"
                  sx={{ fontWeight: 'bold' }}
                />
              </Tabs>

              {/* Favorites Tab */}
              {activeTab === 0 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Favorite Products
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <FavoriteIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No favorites yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Start adding products to your favorites to see them here
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/products')}
                    >
                      Browse Products
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Settings Tab */}
              {activeTab === 1 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Account Settings
                  </Typography>
                  
                  <List>
                    <ListItem 
                      button 
                      onClick={() => navigate('/profile/addresses')}
                      sx={{ 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                    >
                      <ListItemIcon>
                        <LocationIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Manage Addresses"
                        secondary="Add or edit delivery addresses"
                      />
                      <ListItemSecondaryAction>
                        <ArrowForwardIcon color="action" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem 
                      button 
                      onClick={() => navigate('/profile/payment')}
                      sx={{ 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                    >
                      <ListItemIcon>
                        <PaymentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Payment Methods"
                        secondary="Manage your payment options"
                      />
                      <ListItemSecondaryAction>
                        <ArrowForwardIcon color="action" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem 
                      button 
                      onClick={() => navigate('/profile/notifications')}
                      sx={{ 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                    >
                      <ListItemIcon>
                        <NotificationsIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Notification Settings"
                        secondary="Manage your notification preferences"
                      />
                      <ListItemSecondaryAction>
                        <ArrowForwardIcon color="action" />
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem 
                      button 
                      onClick={() => navigate('/profile/security')}
                      sx={{ 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                    >
                      <ListItemIcon>
                        <SecurityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Security Settings"
                        secondary="Change password and security options"
                      />
                      <ListItemSecondaryAction>
                        <ArrowForwardIcon color="action" />
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem 
                      button 
                      onClick={() => navigate('/profile/language')}
                      sx={{ 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                    >
                      <ListItemIcon>
                        <LanguageIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Language & Region"
                        secondary="Change language and regional settings"
                      />
                      <ListItemSecondaryAction>
                        <ArrowForwardIcon color="action" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Preferences
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={user?.preferences?.notifications || false}
                        onChange={(e) => {
                          // Preference change would be handled by API call
                          console.log('Notification preference changed:', e.target.checked);
                        }}
                      />
                    }
                    label="Push Notifications"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={user?.preferences?.darkMode || false}
                        onChange={(e) => {
                          // Preference change would be handled by API call
                          console.log('Dark mode preference changed:', e.target.checked);
                        }}
                      />
                    }
                    label="Dark Mode"
                  />
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Edit Profile Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            Edit Profile
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Profile editing functionality is not available in this version.
                Please contact support for profile updates.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>


      </Container>
  );
};

export default ProfilePage; 