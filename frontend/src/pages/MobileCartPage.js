import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Divider,
  Paper,
  Chip,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingBag as EmptyCartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MobileCartPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          px: 3,
          textAlign: 'center'
        }}
      >
        <EmptyCartIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
        <Typography variant="h6" gutterBottom sx={{ color: '#666' }}>
          Your cart is empty
        </Typography>
        <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
          Add some fertilizers and farming supplies to get started
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/home')}
          sx={{
            bgcolor: '#4CAF50',
            '&:hover': { bgcolor: '#45a049' },
            borderRadius: 2,
            px: 4
          }}
        >
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pb: 2 }}>
      {/* Header */}
      <Box sx={{ px: 2, py: 2, bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" fontWeight="bold">
          My Cart ({cartCount} items)
        </Typography>
      </Box>

      {/* Cart Items */}
      <Box sx={{ px: 2, py: 1 }}>
        {cartItems.map((item) => (
          <Card key={item.id} sx={{ mb: 1.5, borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Product Image */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={item.image || '/api/placeholder/80/80'}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 4
                    }}
                  />
                </Box>

                {/* Product Details */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    fontWeight="500"
                    sx={{
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50', mb: 1 }}>
                    ₹{item.price}
                  </Typography>

                  {/* Quantity Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        sx={{
                          bgcolor: '#f5f5f5',
                          width: 32,
                          height: 32,
                          '&:hover': { bgcolor: '#e0e0e0' }
                        }}
                      >
                        <RemoveIcon sx={{ fontSize: 16 }} />
                      </IconButton>

                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{
                          minWidth: 24,
                          textAlign: 'center',
                          px: 1
                        }}
                      >
                        {item.quantity}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        sx={{
                          bgcolor: '#4CAF50',
                          color: 'white',
                          width: 32,
                          height: 32,
                          '&:hover': { bgcolor: '#45a049' }
                        }}
                      >
                        <AddIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>

                    <IconButton
                      onClick={() => removeFromCart(item.id)}
                      sx={{ color: '#f44336' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  {/* Subtotal */}
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                    Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Price Summary */}
      <Box sx={{ px: 2, mt: 2 }}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Price Details
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Price ({cartCount} items)</Typography>
            <Typography variant="body2">₹{getTotalPrice()}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Delivery Charges</Typography>
            <Typography variant="body2" sx={{ color: '#4CAF50' }}>
              FREE
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Total Amount
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50' }}>
              ₹{getTotalPrice()}
            </Typography>
          </Box>

          <Chip
            label="You will save ₹150 on this order"
            size="small"
            sx={{
              bgcolor: '#E8F5E8',
              color: '#4CAF50',
              fontWeight: 500,
              width: '100%'
            }}
          />
        </Paper>
      </Box>

      {/* Checkout Button */}
      <Box sx={{ px: 2, mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => navigate('/delivery-details')}
          sx={{
            bgcolor: '#FF9800',
            '&:hover': { bgcolor: '#F57C00' },
            borderRadius: 2,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'none'
          }}
        >
          Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default MobileCartPage;
