import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Close as CloseIcon,
  Business as VendorIcon,
  LocalShipping as DeliveryIcon,
  Agriculture as CustomerIcon
} from '@mui/icons-material';

const RegistrationSuccessModal = ({ 
  open, 
  onClose, 
  onContinueToLogin, 
  userRole, 
  userName,
  userEmail 
}) => {
  const getRoleConfig = () => {
    switch (userRole) {
      case 'vendor':
        return {
          title: 'Vendor Registration Successful!',
          icon: <VendorIcon sx={{ fontSize: 60, color: '#FF9800' }} />,
          color: '#FF9800',
          description: 'Your vendor account has been created successfully.',
          nextSteps: [
            'Complete document verification',
            'Set up your product inventory',
            'Start receiving orders from farmers',
            'Track your earnings and analytics'
          ],
          loginRoute: 'vendor login'
        };
      case 'delivery_partner':
        return {
          title: 'Delivery Partner Registration Successful!',
          icon: <DeliveryIcon sx={{ fontSize: 60, color: '#2196F3' }} />,
          color: '#2196F3',
          description: 'Your delivery partner account has been created successfully.',
          nextSteps: [
            'Complete document verification',
            'Set up your delivery preferences',
            'Start accepting delivery assignments',
            'Track your earnings and performance'
          ],
          loginRoute: 'delivery partner login'
        };
      default:
        return {
          title: 'Customer Registration Successful!',
          icon: <CustomerIcon sx={{ fontSize: 60, color: '#4CAF50' }} />,
          color: '#4CAF50',
          description: 'Your customer account has been created successfully.',
          nextSteps: [
            'Browse agricultural products',
            'Add items to your cart',
            'Place orders for delivery',
            'Track your order status'
          ],
          loginRoute: 'customer login'
        };
    }
  };

  const roleConfig = getRoleConfig();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', position: 'relative', pb: 0 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', py: 3 }}>
        {/* Success Icon */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'inline-flex', 
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <SuccessIcon sx={{ 
              fontSize: 80, 
              color: 'success.main',
              position: 'absolute',
              zIndex: 2
            }} />
            <Box sx={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              backgroundColor: `${roleConfig.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}>
              {roleConfig.icon}
            </Box>
          </Box>
        </Box>

        {/* Title */}
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          {roleConfig.title}
        </Typography>

        {/* User Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Welcome, {userName}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userEmail}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Description */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {roleConfig.description}
        </Typography>

        {/* Next Steps */}
        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            What's Next?
          </Typography>
          {roleConfig.nextSteps.map((step, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: roleConfig.color,
                mr: 2,
                flexShrink: 0
              }} />
              <Typography variant="body2" color="text.secondary">
                {step}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            size="large"
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={onContinueToLogin}
            size="large"
            sx={{
              background: `linear-gradient(135deg, ${roleConfig.color} 0%, ${roleConfig.color}CC 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${roleConfig.color}DD 0%, ${roleConfig.color}AA 100%)`,
              }
            }}
          >
            Continue to {roleConfig.loginRoute}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationSuccessModal;