import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Stack,
  useTheme,
  alpha,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  Home as HomeIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Print as PrintIcon,
  LocalShipping as LocalShippingIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { cart, getCartTotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const [orderId, setOrderId] = useState('');
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderedItems, setOrderedItems] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [orderDate, setOrderDate] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const billRef = useRef(null);

  // Calculate order totals from order data or ordered items
  const calculateTotals = () => {
    if (orderData && orderData.totalAmount) {
      // Use backend order data if available
      const orderTotal = orderData.totalAmount;
      const deliveryFee = orderTotal > 5000 ? 0 : 200;
      return {
        subtotal: orderTotal - deliveryFee,
        deliveryFee,
        total: orderTotal
      };
    } else if (orderedItems && orderedItems.length > 0) {
      // Calculate from ordered items
      const subtotal = orderedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const deliveryFee = subtotal > 5000 ? 0 : 200;
      return {
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee
      };
    } else {
      // Fallback to cart total (for initial load)
      const subtotal = getCartTotal();
      const deliveryFee = subtotal > 5000 ? 0 : 200;
      return {
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee
      };
    }
  };

  const { subtotal, deliveryFee, total } = calculateTotals();

  useEffect(() => {
    console.log('OrderConfirmationPage: useEffect triggered');
    console.log('Cart length:', cart.length);
    console.log('Cart items:', cart);
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('Stored delivery details:', localStorage.getItem('deliveryDetails'));
    console.log('Stored payment method:', localStorage.getItem('paymentMethod'));
    console.log('Stored cart items:', localStorage.getItem('orderCartItems'));

    const createOrderInBackend = async () => {
      console.log('OrderConfirmationPage: Starting order creation process');
      console.log('Cart items:', cart);
      console.log('Token:', token ? 'Present' : 'Missing');



      if (!token) {
        console.log('OrderConfirmationPage: No authentication token');
        setOrderError('Authentication required to create order');
        return;
      }

      try {
        // Get stored data
        const storedDeliveryDetails = localStorage.getItem('deliveryDetails');
        const storedPaymentMethod = localStorage.getItem('paymentMethod');

        console.log('Stored delivery details:', storedDeliveryDetails);
        console.log('Stored payment method:', storedPaymentMethod);

        if (!storedDeliveryDetails) {
          console.log('OrderConfirmationPage: No delivery details found');
          setOrderError('Delivery details not found');
          return;
        }

        const deliveryDetails = JSON.parse(storedDeliveryDetails);
        setDeliveryDetails(deliveryDetails);
        setPaymentMethod(storedPaymentMethod);

        // Try to get cart items from current cart or localStorage
        let cartItems = cart;
        if (!cartItems || cartItems.length === 0) {
          const storedCartItems = localStorage.getItem('orderCartItems');
          if (storedCartItems) {
            cartItems = JSON.parse(storedCartItems);
            console.log('OrderConfirmationPage: Using stored cart items:', cartItems);
          }
        }

        // Save a copy of the cart before clearing it
        setOrderedItems(cartItems);
        console.log('OrderConfirmationPage: Cart items saved:', cartItems);

        // Prepare order data for backend
        const orderData = {
          items: cartItems.map(item => ({
            product: item.id || item._id, // Product ID from backend
            quantity: item.quantity,
            price: item.price
          })),
          deliveryAddress: {
            street: deliveryDetails.address,
            city: deliveryDetails.city,
            state: deliveryDetails.state,
            pincode: deliveryDetails.pincode,
            coordinates: {
              type: 'Point',
              coordinates: [77.2090, 28.6139] // Default coordinates (Delhi)
            }
          },
          deliverySlot: {
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            timeSlot: 'morning'
          },
          paymentMethod: storedPaymentMethod || 'cod'
        };

        console.log('OrderConfirmationPage: Prepared order data:', orderData);

        // Send order to backend
        console.log('OrderConfirmationPage: Sending order to backend...');
        const response = await createOrder(orderData, token);
        console.log('OrderConfirmationPage: Backend response:', response);
        
        console.log('OrderConfirmationPage: Checking response for _id:', response._id);
        console.log('OrderConfirmationPage: Response keys:', Object.keys(response));



        if (response._id) {
          console.log('OrderConfirmationPage: Order created successfully, setting success state');
          setOrderId(response.trackingNumber || response._id);
          setOrderSuccess(true);
          setOrderData(response);
          setOrderDate(new Date(response.createdAt || Date.now()));

          console.log('OrderConfirmationPage: Order success state set to true');
          console.log('OrderConfirmationPage: Order ID set to:', response.trackingNumber || response._id);

          // Clear cart after successful order
          clearCart();

          // Clear stored data
          localStorage.removeItem('deliveryDetails');
          localStorage.removeItem('paymentMethod');
          localStorage.removeItem('orderCartItems');

          // Reset processing flag
          setIsProcessing(false);
        } else {
          console.error('Order creation failed - no _id in response:', response);
          console.error('Response type:', typeof response);
          console.error('Response is array:', Array.isArray(response));
          setOrderError(response.message || 'Failed to create order');
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Error creating order:', error);
        console.error('Error type:', typeof error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        if (error.response && error.response.data && error.response.data.message) {
          setOrderError(error.response.data.message);
        } else if (error.message) {
          setOrderError(error.message);
        } else {
          setOrderError('Failed to create order. Please try again.');
        }
        setIsProcessing(false);
      }
    };

    // Check if we have cart items either in current cart or stored
    const hasCartItems = cart.length > 0 || localStorage.getItem('orderCartItems');

    if (hasCartItems && !isProcessing && !orderSuccess && !orderError) {
      setIsProcessing(true);
      createOrderInBackend();
    } else if (!hasCartItems && !isProcessing && !orderSuccess && !orderError) {
      setOrderError('No items in cart');
    }
  }, [cart, token, isProcessing, orderSuccess, orderError]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      // Simple download using browser's print to PDF functionality
      window.print();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleShare = () => {
    const shareData = {
      title: 'KrushiDoot Order Confirmation',
      text: `Order ${orderId} confirmed! Total: ₹${total}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `Order ${orderId} confirmed! Total: ₹${total}\n${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Order details copied to clipboard!');
      });
    }
  };

  const handleWhatsAppShare = () => {
    const message = `🌾 KrushiDoot Order Confirmed!\n\nOrder ID: ${orderId}\nTotal Amount: ₹${total}\nDelivery: 2-3 business days\n\nThank you for choosing KrushiDoot for your fertilizer needs!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (orderError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {orderError}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </Container>
    );
  }

  if (!orderSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5">Processing your order...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Success Message */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'success.main' }}>
          Order Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Thank you for choosing KrushiDoot
        </Typography>
        <Chip 
          label={`Order ID: ${orderId}`} 
          color="primary" 
          size="large"
          sx={{ fontSize: '1rem', py: 2, px: 1 }}
        />
      </Box>

      {/* Action Buttons */}
      <Box className="no-print" sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ minWidth: 150 }}
        >
          Download Bill
        </Button>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ minWidth: 150 }}
        >
          Print Bill
        </Button>
        <Button
          variant="outlined"
          startIcon={<WhatsAppIcon />}
          onClick={handleWhatsAppShare}
          sx={{ minWidth: 150, color: '#25D366', borderColor: '#25D366' }}
        >
          Share
        </Button>
      </Box>

      {/* Invoice/Bill */}
      <Paper 
        ref={billRef}
        className="print-content"
        sx={{ 
          p: 4,
          mb: 4,
          '@media print': {
            boxShadow: 'none',
            p: 2
          }
        }}
      >
        {/* Invoice Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              🌾 <Box component="span" sx={{ color: '#CE93D8' }}>Krushi</Box><Box component="span" sx={{ color: '#FFE500' }}>Doot</Box>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Premium Fertilizer Delivery Service
            </Typography>
            <Typography variant="body2" color="text.secondary">
              📧 support@krushidoot.com | 📞 1800-XXX-XXXX
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              INVOICE
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Invoice #: {orderId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {orderDate.toLocaleDateString('en-IN')}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Customer & Delivery Details */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Bill To:
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user?.name || 'Customer'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'customer@email.com'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.phone || '+91 XXXXXXXXXX'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Deliver To:
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              {deliveryDetails && (
                <>
                  <Typography variant="body2">
                    {deliveryDetails.address}
                  </Typography>
                  <Typography variant="body2">
                    {deliveryDetails.city}, {deliveryDetails.state}
                  </Typography>
                  <Typography variant="body2">
                    PIN: {deliveryDetails.pincode}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Order Items Table */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Order Details:
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Product</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Quantity</TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Unit Price</TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderedItems.map((item, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.name || `Product ${item.id || item.product || index + 1}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.category || 'Fertilizer'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={`${item.quantity} ${item.unit || 'kg'}`} size="small" />
                  </TableCell>
                  <TableCell align="right">₹{item.price}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Billing Summary */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: 'info.light', p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Payment & Delivery Info:
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Payment Method:</Typography>
                  <Chip
                    label={paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod?.toUpperCase()}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Delivery:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>2-3 Business Days</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Status:</Typography>
                  <Chip label="Confirmed" color="success" size="small" />
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Bill Summary:
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">₹{subtotal.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Delivery Fee:</Typography>
                  <Typography variant="body2" color={deliveryFee === 0 ? 'success.main' : 'text.primary'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Total Amount:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    ₹{total.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'grey.300', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Thank you for choosing KrushiDoot! Your order will be processed within 24 hours.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            For any queries, contact us at support@krushidoot.com or call 1800-XXX-XXXX
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              🌾 KrushiDoot - Empowering Farmers with Quality Fertilizers
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Navigation Buttons */}
      <Box className="no-print" sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          size="large"
        >
          Continue Shopping
        </Button>
        <Button
          variant="contained"
          startIcon={<LocalShippingIcon />}
          onClick={() => navigate('/orders')}
          size="large"
        >
          Track Order
        </Button>
      </Box>

      {/* Contact Support */}
      <Card className="no-print" sx={{ mt: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Need Help?
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Our customer support team is here to help you 24/7
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<PhoneIcon />}
              onClick={() => window.open('tel:1800-XXX-XXXX')}
              sx={{ bgcolor: 'white', color: 'primary.main' }}
            >
              Call Us
            </Button>
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={() => window.open('https://wa.me/1234567890')}
              sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' } }}
            >
              WhatsApp
            </Button>
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={() => window.open('mailto:support@krushidoot.com')}
              sx={{ bgcolor: 'white', color: 'primary.main' }}
            >
              Email
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      `}</style>
    </Container>
  );
};

export default OrderConfirmationPage;
