import React from 'react';
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  Tooltip
} from '@mui/material';
import {
  Home as HomeIcon,
  ShoppingCart as CartIcon,
  LocalShipping as DeliveryIcon,
  Payment as PaymentIcon,
  CheckCircle as ConfirmIcon,
  TrackChanges as TrackIcon,
  Star as FeedbackIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { useWorkflow } from './WorkflowManager';

const WorkflowIndicator = ({ variant = 'compact', showProgress = true }) => {
  const theme = useTheme();
  const { currentStep, workflowHistory, WORKFLOW_STEPS } = useWorkflow();

  // Define main journey steps for progress calculation
  const mainJourneySteps = [
    { key: WORKFLOW_STEPS.LANDING, label: 'Start', icon: <HomeIcon /> },
    { key: WORKFLOW_STEPS.BROWSE_PRODUCTS, label: 'Browse', icon: <HomeIcon /> },
    { key: WORKFLOW_STEPS.ADD_TO_CART, label: 'Add to Cart', icon: <CartIcon /> },
    { key: WORKFLOW_STEPS.CART_REVIEW, label: 'Review Cart', icon: <CartIcon /> },
    { key: WORKFLOW_STEPS.DELIVERY_DETAILS, label: 'Delivery', icon: <DeliveryIcon /> },
    { key: WORKFLOW_STEPS.PAYMENT_METHOD, label: 'Payment', icon: <PaymentIcon /> },
    { key: WORKFLOW_STEPS.ORDER_CONFIRMATION, label: 'Confirmed', icon: <ConfirmIcon /> },
    { key: WORKFLOW_STEPS.ORDER_TRACKING, label: 'Tracking', icon: <TrackIcon /> },
    { key: WORKFLOW_STEPS.FEEDBACK_RATING, label: 'Feedback', icon: <FeedbackIcon /> }
  ];

  // Get current step info
  const getCurrentStepInfo = () => {
    return mainJourneySteps.find(step => step.key === currentStep) || 
           { key: currentStep, label: currentStep.replace(/_/g, ' '), icon: <LoginIcon /> };
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const currentIndex = mainJourneySteps.findIndex(step => step.key === currentStep);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / mainJourneySteps.length) * 100;
  };

  // Get step color based on status
  const getStepColor = (stepKey) => {
    if (stepKey === currentStep) return theme.palette.primary.main;
    if (workflowHistory.includes(stepKey)) return theme.palette.success.main;
    return theme.palette.grey[400];
  };

  const currentStepInfo = getCurrentStepInfo();
  const progressPercentage = getProgressPercentage();

  // Minimal variant - just current step chip
  if (variant === 'minimal') {
    return (
      <Tooltip title={`Current: ${currentStepInfo.label}`}>
        <Chip
          icon={currentStepInfo.icon}
          label={currentStepInfo.label}
          color="primary"
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderColor: theme.palette.primary.main,
            '& .MuiChip-icon': {
              color: theme.palette.primary.main
            }
          }}
        />
      </Tooltip>
    );
  }

  // Compact variant - current step + progress
  if (variant === 'compact') {
    return (
      <Box sx={{ minWidth: 200 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip
            icon={currentStepInfo.icon}
            label={currentStepInfo.label}
            color="primary"
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderColor: theme.palette.primary.main,
              '& .MuiChip-icon': {
                color: theme.palette.primary.main
              }
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Step {workflowHistory.length}
          </Typography>
        </Box>
        
        {showProgress && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round(progressPercentage)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
                }
              }}
            />
          </Box>
        )}
      </Box>
    );
  }

  // Full variant - all steps with progress
  if (variant === 'full') {
    return (
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Order Journey
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progressPercentage)}% Complete
          </Typography>
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            mb: 3,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
            }
          }}
        />

        {/* Step Indicators */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          {mainJourneySteps.map((step, index) => {
            const isCompleted = workflowHistory.includes(step.key) && step.key !== currentStep;
            const isCurrent = step.key === currentStep;
            const isPending = !workflowHistory.includes(step.key);

            return (
              <Tooltip key={step.key} title={step.label}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 60
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: getStepColor(step.key),
                      color: '#fff',
                      mb: 0.5,
                      border: isCurrent ? `2px solid ${alpha(theme.palette.primary.main, 0.3)}` : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {React.cloneElement(step.icon, { sx: { fontSize: 16 } })}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      textAlign: 'center',
                      fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent ? theme.palette.primary.main : 'text.secondary'
                    }}
                  >
                    {step.label}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* Current Step Details */}
        <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Currently at: <strong>{currentStepInfo.label}</strong>
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
};

export default WorkflowIndicator;
