import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as AddressIcon,
  Payment as PaymentIcon,
  Help as HelpIcon,
  Info as AboutIcon,
  ExitToApp as LogoutIcon,
  ChevronRight as ChevronIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileMenuItems = [
    {
      icon: <PersonIcon />,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      action: () => navigate('/edit-profile')
    },
    {
      icon: <AddressIcon />,
      title: 'Manage Addresses',
      subtitle: 'Add or edit delivery addresses',
      action: () => navigate('/addresses')
    },
    {
      icon: <PaymentIcon />,
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      action: () => navigate('/payment-methods')
    }
  ];

  const supportMenuItems = [
    {
      icon: <HelpIcon />,
      title: 'Help & Support',
      subtitle: 'Get help with your orders',
      action: () => navigate('/help')
    },
    {
      icon: <AboutIcon />,
      title: 'About AgriNet',
      subtitle: 'Learn more about our app',
      action: () => navigate('/about')
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ px: 2, py: 2, bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" fontWeight="bold">
          My Profile
        </Typography>
      </Box>

      {/* User Info Card */}
      <Box sx={{ px: 2, py: 2 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: '#4CAF50',
                  fontSize: '1.5rem',
                  mr: 2
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {user?.name || 'User Name'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <PhoneIcon sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {user?.phone || '+91 9876543210'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {user?.email || 'user@example.com'}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => navigate('/edit-profile')}
                sx={{
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  textTransform: 'none',
                  borderRadius: 1
                }}
              >
                Edit
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Account Section */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#333' }}>
          Account
        </Typography>
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <List sx={{ p: 0 }}>
            {profileMenuItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  onClick={item.action}
                  sx={{
                    py: 2,
                    '&:hover': {
                      bgcolor: '#f5f5f5'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: '#4CAF50', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="500">
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {item.subtitle}
                      </Typography>
                    }
                  />
                  <ChevronIcon sx={{ color: '#ccc' }} />
                </ListItem>
                {index < profileMenuItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      </Box>

      {/* Support Section */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#333' }}>
          Support
        </Typography>
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <List sx={{ p: 0 }}>
            {supportMenuItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  onClick={item.action}
                  sx={{
                    py: 2,
                    '&:hover': {
                      bgcolor: '#f5f5f5'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: '#4CAF50', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="500">
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {item.subtitle}
                      </Typography>
                    }
                  />
                  <ChevronIcon sx={{ color: '#ccc' }} />
                </ListItem>
                {index < supportMenuItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      </Box>

      {/* App Info */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 1, bgcolor: '#E8F5E8' }}>
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 500, mb: 1 }}>
              AgriNet v1.0.0
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Premium fertilizers and farming supplies delivered to your farm
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Logout Button */}
      <Box sx={{ px: 2, mb: 4 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderColor: '#f44336',
            color: '#f44336',
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              borderColor: '#d32f2f',
              bgcolor: '#ffebee'
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default MobileProfilePage;
