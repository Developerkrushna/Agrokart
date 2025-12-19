import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Snackbar, 
  Alert, 
  IconButton, 
  Box, 
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Close, 
  NotificationsActive,
  ShoppingCart,
  LocalShipping,
  Info,
  Warning,
  Error as ErrorIcon,
  CheckCircle
} from '@mui/icons-material';
import { useMobile } from './MobileContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { 
    isNative, 
    requestNotificationPermission, 
    showLocalNotification,
    vibrate,
    showToast 
  } = useMobile();
  
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 6000
  });
  const [permissionDialog, setPermissionDialog] = useState(false);

  useEffect(() => {
    // Initialize notification system
    initializeNotifications();
    
    // Listen for push notifications if native
    if (isNative) {
      setupPushNotificationListeners();
    }
  }, [isNative]);

  const initializeNotifications = async () => {
    try {
      // Check if notifications are supported
      if (isNative || 'Notification' in window) {
        // Request permission if not already granted
        const permission = await requestNotificationPermission();
        if (permission !== 'granted') {
          setPermissionDialog(true);
        }
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  };

  const setupPushNotificationListeners = () => {
    // This would be implemented with actual Capacitor push notification listeners
    // For now, we'll simulate with local notifications
    console.log('Push notification listeners set up');
  };

  const showNotification = async (notification) => {
    const {
      title,
      body,
      type = 'info',
      action = null,
      persistent = false,
      vibrationPattern = 'light'
    } = notification;

    try {
      // Add to notification list
      const newNotification = {
        id: Date.now(),
        title,
        body,
        type,
        action,
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50

      // Show as snackbar
      setSnackbar({
        open: true,
        message: `${title}: ${body}`,
        severity: type,
        autoHideDuration: persistent ? null : 6000
      });

      // Vibrate device
      await vibrate(vibrationPattern);

      // Show native notification if available
      if (isNative) {
        await showLocalNotification({
          title,
          body,
          id: newNotification.id
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          tag: newNotification.id.toString()
        });
      }

      return newNotification.id;
    } catch (error) {
      console.error('Failed to show notification:', error);
      await showToast('Failed to show notification');
    }
  };

  const showOrderNotification = async (order) => {
    const getOrderMessage = (status) => {
      switch (status) {
        case 'confirmed':
          return `Order #${order.id} has been confirmed!`;
        case 'preparing':
          return `Your order #${order.id} is being prepared`;
        case 'shipped':
          return `Order #${order.id} has been shipped`;
        case 'delivered':
          return `Order #${order.id} has been delivered`;
        case 'cancelled':
          return `Order #${order.id} has been cancelled`;
        default:
          return `Order #${order.id} status updated`;
      }
    };

    await showNotification({
      title: 'Order Update',
      body: getOrderMessage(order.status),
      type: order.status === 'delivered' ? 'success' : 'info',
      action: {
        type: 'navigate',
        path: `/orders/${order.id}`
      },
      vibrationPattern: order.status === 'delivered' ? 'success' : 'light'
    });
  };

  const showDeliveryNotification = async (delivery) => {
    await showNotification({
      title: 'Delivery Update',
      body: `Your delivery partner ${delivery.partner} is ${delivery.status}`,
      type: 'info',
      action: {
        type: 'navigate',
        path: '/track-delivery'
      },
      vibrationPattern: 'light'
    });
  };

  const showPromotionNotification = async (promotion) => {
    await showNotification({
      title: promotion.title,
      body: promotion.description,
      type: 'info',
      action: {
        type: 'navigate',
        path: promotion.link || '/promotions'
      },
      persistent: true,
      vibrationPattern: 'light'
    });
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handlePermissionRequest = async () => {
    try {
      const permission = await requestNotificationPermission();
      setPermissionDialog(false);
      
      if (permission === 'granted') {
        await showToast('Notifications enabled successfully!');
      } else {
        await showToast('Notifications were not enabled');
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      await showToast('Failed to request notification permission');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <ErrorIcon />;
      case 'order':
        return <ShoppingCart />;
      case 'delivery':
        return <LocalShipping />;
      default:
        return <Info />;
    }
  };

  const contextValue = {
    notifications,
    showNotification,
    showOrderNotification,
    showDeliveryNotification,
    showPromotionNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getUnreadCount
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.autoHideDuration}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          icon={getNotificationIcon(snackbar.severity)}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <Close fontSize="small" />
            </IconButton>
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Permission Request Dialog */}
      <Dialog
        open={permissionDialog}
        onClose={() => setPermissionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsActive color="primary" />
            <Typography variant="h6">Enable Notifications</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" paragraph>
            Stay updated with your orders, deliveries, and special offers! 
            Enable notifications to receive important updates about your Agrokart experience.
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              You'll receive notifications about:
            </Typography>
            <Box component="ul" sx={{ mt: 1, pl: 2 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Order confirmations and updates
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Delivery status and tracking
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Special offers and promotions
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setPermissionDialog(false)}>
            Maybe Later
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePermissionRequest}
            startIcon={<NotificationsActive />}
          >
            Enable Notifications
          </Button>
        </DialogActions>
      </Dialog>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;