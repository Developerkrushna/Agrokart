import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  Home as HomeIcon,
  ShoppingCart as CartIcon,
  LocalShipping as DeliveryIcon,
  Payment as PaymentIcon,
  CheckCircle as ConfirmIcon,
  TrackChanges as TrackIcon,
  Star as FeedbackIcon,
  Person as ProfileIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon
} from '@mui/icons-material';
import { useWorkflow } from './WorkflowManager';

const WorkflowDashboard = () => {
  const theme = useTheme();
  const { currentStep, workflowHistory, transitionTo, getNextSteps, WORKFLOW_STEPS } = useWorkflow();

  // Define workflow categories
  const workflowCategories = {
    'User Journey': [
      { step: WORKFLOW_STEPS.LANDING, label: 'Landing Page', icon: <HomeIcon />, color: 'primary' },
      { step: WORKFLOW_STEPS.BROWSE_PRODUCTS, label: 'Browse Products', icon: <HomeIcon />, color: 'primary' },
      { step: WORKFLOW_STEPS.PRODUCT_DETAIL, label: 'Product Details', icon: <HomeIcon />, color: 'primary' }
    ],
    'Authentication': [
      { step: WORKFLOW_STEPS.LOGIN_REQUIRED, label: 'Login Required', icon: <LoginIcon />, color: 'warning' },
      { step: WORKFLOW_STEPS.PHONE_LOGIN, label: 'Phone Login', icon: <LoginIcon />, color: 'warning' },
      { step: WORKFLOW_STEPS.EMAIL_LOGIN, label: 'Email Login', icon: <LoginIcon />, color: 'warning' },
      { step: WORKFLOW_STEPS.OTP_VERIFICATION, label: 'OTP Verification', icon: <LoginIcon />, color: 'warning' },
      { step: WORKFLOW_STEPS.REGISTRATION, label: 'Registration', icon: <RegisterIcon />, color: 'warning' }
    ],
    'Shopping Flow': [
      { step: WORKFLOW_STEPS.ADD_TO_CART, label: 'Add to Cart', icon: <CartIcon />, color: 'success' },
      { step: WORKFLOW_STEPS.CART_REVIEW, label: 'Review Cart', icon: <CartIcon />, color: 'success' },
      { step: WORKFLOW_STEPS.DELIVERY_DETAILS, label: 'Delivery Details', icon: <DeliveryIcon />, color: 'success' },
      { step: WORKFLOW_STEPS.PAYMENT_METHOD, label: 'Payment Method', icon: <PaymentIcon />, color: 'success' },
      { step: WORKFLOW_STEPS.PAYMENT_PROCESSING, label: 'Processing Payment', icon: <PaymentIcon />, color: 'success' },
      { step: WORKFLOW_STEPS.ORDER_CONFIRMATION, label: 'Order Confirmed', icon: <ConfirmIcon />, color: 'success' }
    ],
    'Post-Order': [
      { step: WORKFLOW_STEPS.ORDER_TRACKING, label: 'Track Order', icon: <TrackIcon />, color: 'info' },
      { step: WORKFLOW_STEPS.DELIVERY_IN_PROGRESS, label: 'Delivery in Progress', icon: <DeliveryIcon />, color: 'info' },
      { step: WORKFLOW_STEPS.ORDER_DELIVERED, label: 'Order Delivered', icon: <ConfirmIcon />, color: 'info' },
      { step: WORKFLOW_STEPS.FEEDBACK_RATING, label: 'Feedback & Rating', icon: <FeedbackIcon />, color: 'info' }
    ],
    'User Management': [
      { step: WORKFLOW_STEPS.PROFILE_MANAGEMENT, label: 'Profile Management', icon: <ProfileIcon />, color: 'secondary' },
      { step: WORKFLOW_STEPS.ORDER_HISTORY, label: 'Order History', icon: <TrackIcon />, color: 'secondary' },
      { step: WORKFLOW_STEPS.SUPPORT_CHAT, label: 'Support Chat', icon: <ProfileIcon />, color: 'secondary' }
    ]
  };

  const getStepStatus = (step) => {
    if (step === currentStep) return 'current';
    if (workflowHistory.includes(step)) return 'completed';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return theme.palette.primary.main;
      case 'completed': return theme.palette.success.main;
      case 'pending': return theme.palette.grey[400];
      default: return theme.palette.grey[400];
    }
  };

  const nextSteps = getNextSteps();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        KrushiDoot Workflow Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Complete user journey visualization and management
      </Typography>

      {/* Current Status */}
      <Card sx={{ mb: 4, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Current Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip
              label={currentStep.replace(/_/g, ' ').toUpperCase()}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="body2" color="text.secondary">
              Step {workflowHistory.length} of user journey
            </Typography>
          </Box>
          
          {nextSteps.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Available Next Steps:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {nextSteps.map(step => (
                  <Button
                    key={step}
                    variant="outlined"
                    size="small"
                    onClick={() => transitionTo(step)}
                    sx={{ textTransform: 'none' }}
                  >
                    {step.replace(/_/g, ' ')}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Workflow Categories */}
      <Grid container spacing={3}>
        {Object.entries(workflowCategories).map(([category, steps]) => (
          <Grid item xs={12} md={6} lg={4} key={category}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {category}
                </Typography>
                
                <List dense>
                  {steps.map((stepInfo, index) => {
                    const status = getStepStatus(stepInfo.step);

                    return (
                      <ListItem key={stepInfo.step} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: getStatusColor(status),
                              border: status === 'current' ? `2px solid ${alpha(theme.palette.primary.main, 0.3)}` : 'none'
                            }}
                          >
                            {React.cloneElement(stepInfo.icon, { sx: { fontSize: 16 } })}
                          </Avatar>
                        </ListItemIcon>

                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: status === 'current' ? 600 : 400,
                                color: status === 'current' ? theme.palette.primary.main : 'text.primary'
                              }}
                            >
                              {stepInfo.label}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {status === 'current' ? 'Current' : status === 'completed' ? 'Completed' : 'Pending'}
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Workflow History */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Workflow History
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {workflowHistory.map((step, index) => (
              <Chip
                key={`${step}-${index}`}
                label={`${index + 1}. ${step.replace(/_/g, ' ')}`}
                variant={step === currentStep ? 'filled' : 'outlined'}
                color={step === currentStep ? 'primary' : 'default'}
                size="small"
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => transitionTo(WORKFLOW_STEPS.BROWSE_PRODUCTS)}
              disabled={!nextSteps.includes(WORKFLOW_STEPS.BROWSE_PRODUCTS)}
            >
              Browse Products
            </Button>
            <Button
              variant="contained"
              onClick={() => transitionTo(WORKFLOW_STEPS.CART_REVIEW)}
              disabled={!nextSteps.includes(WORKFLOW_STEPS.CART_REVIEW)}
            >
              View Cart
            </Button>
            <Button
              variant="contained"
              onClick={() => transitionTo(WORKFLOW_STEPS.LOGIN_REQUIRED)}
              disabled={!nextSteps.includes(WORKFLOW_STEPS.LOGIN_REQUIRED)}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => transitionTo(WORKFLOW_STEPS.ORDER_TRACKING)}
              disabled={!nextSteps.includes(WORKFLOW_STEPS.ORDER_TRACKING)}
            >
              Track Orders
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WorkflowDashboard;
