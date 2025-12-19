import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  useTheme,
  alpha,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Home as HomeIcon,
  ShoppingCart as CartIcon,
  LocalShipping as DeliveryIcon,
  Payment as PaymentIcon,
  CheckCircle as ConfirmIcon,
  TrackChanges as TrackIcon,
  Star as FeedbackIcon,
  Person as ProfileIcon
} from '@mui/icons-material';
import { useWorkflow } from './WorkflowManager';

const WorkflowProgress = ({ variant = 'stepper', showOnlyRelevant = true }) => {
  const theme = useTheme();
  const { currentStep, workflowHistory, WORKFLOW_STEPS } = useWorkflow();

  // Define the main user journey steps for progress display
  const mainJourneySteps = [
    {
      key: WORKFLOW_STEPS.BROWSE_PRODUCTS,
      label: 'Browse Products',
      icon: <HomeIcon />,
      description: 'Explore our fertilizer collection'
    },
    {
      key: WORKFLOW_STEPS.ADD_TO_CART,
      label: 'Add to Cart',
      icon: <CartIcon />,
      description: 'Select products for purchase'
    },
    {
      key: WORKFLOW_STEPS.CART_REVIEW,
      label: 'Review Cart',
      icon: <CartIcon />,
      description: 'Review selected items'
    },
    {
      key: WORKFLOW_STEPS.DELIVERY_DETAILS,
      label: 'Delivery Details',
      icon: <DeliveryIcon />,
      description: 'Enter delivery information'
    },
    {
      key: WORKFLOW_STEPS.PAYMENT_METHOD,
      label: 'Payment',
      icon: <PaymentIcon />,
      description: 'Complete payment process'
    },
    {
      key: WORKFLOW_STEPS.ORDER_CONFIRMATION,
      label: 'Order Confirmed',
      icon: <ConfirmIcon />,
      description: 'Order successfully placed'
    },
    {
      key: WORKFLOW_STEPS.ORDER_TRACKING,
      label: 'Track Order',
      icon: <TrackIcon />,
      description: 'Monitor delivery progress'
    },
    {
      key: WORKFLOW_STEPS.FEEDBACK_RATING,
      label: 'Feedback',
      icon: <FeedbackIcon />,
      description: 'Rate your experience'
    }
  ];

  // Get current step index
  const getCurrentStepIndex = () => {
    return mainJourneySteps.findIndex(step => step.key === currentStep);
  };

  // Get completed steps
  const getCompletedSteps = () => {
    return mainJourneySteps.filter(step => 
      workflowHistory.includes(step.key) && step.key !== currentStep
    );
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / mainJourneySteps.length) * 100;
  };

  // Compact progress bar variant
  if (variant === 'progress-bar') {
    return (
      <Box sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Order Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(getProgressPercentage())}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={getProgressPercentage()}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
            }
          }}
        />
      </Box>
    );
  }

  // Chip variant for compact display
  if (variant === 'chip') {
    const currentStepInfo = mainJourneySteps.find(step => step.key === currentStep);
    if (!currentStepInfo) return null;

    return (
      <Chip
        icon={currentStepInfo.icon}
        label={currentStepInfo.label}
        color="primary"
        variant="outlined"
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderColor: theme.palette.primary.main,
          '& .MuiChip-icon': {
            color: theme.palette.primary.main
          }
        }}
      />
    );
  }

  // Full stepper variant
  const activeStep = getCurrentStepIndex();
  const completedSteps = getCompletedSteps();

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
        Order Journey Progress
      </Typography>
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {mainJourneySteps.map((step, index) => {
          const isCompleted = completedSteps.some(completed => completed.key === step.key);
          const isActive = step.key === currentStep;
          
          return (
            <Step key={step.key} completed={isCompleted}>
              <StepLabel
                icon={
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isCompleted 
                        ? theme.palette.success.main 
                        : isActive 
                          ? theme.palette.primary.main 
                          : alpha(theme.palette.grey[400], 0.3),
                      color: isCompleted || isActive ? '#fff' : theme.palette.grey[600],
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {step.icon}
                  </Box>
                }
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? theme.palette.primary.main : 'text.primary'
                  }}
                >
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>

      {/* Progress Summary */}
      <Box sx={{ mt: 4, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          <strong>{completedSteps.length}</strong> of <strong>{mainJourneySteps.length}</strong> steps completed
        </Typography>
      </Box>
    </Box>
  );
};

export default WorkflowProgress;
