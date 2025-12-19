import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  Rating,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocationOn,
  LocalOffer
} from '@mui/icons-material';
import { useMobile } from '../context/MobileContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MobileProductCard = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  compact = false
}) => {
  const { vibrate, showToast, shareContent } = useMobile();
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = async () => {
    try {
      await vibrate('light');
      if (onAddToCart) {
        await onAddToCart(product, quantity);
        await showToast(`Added ${quantity} ${product.name} to cart`);
        await vibrate('success');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      await showToast('Failed to add item to cart');
      await vibrate('error');
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await vibrate('light');
      if (onToggleFavorite) {
        await onToggleFavorite(product);
        await showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites');
        await vibrate('success');
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      await vibrate('error');
    }
  };

  const handleShare = async () => {
    try {
      await vibrate('light');
      await shareContent({
        title: product.name,
        text: `Check out ${product.name} on AgriNet!`,
        url: window.location.href
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const isDiscounted = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = isDiscounted 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <Card
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
            transition: 'all 0.3s ease'
          }
        }}
      >
        {/* Discount Badge */}
        {isDiscounted && (
          <Chip
            label={`${discountPercentage}% OFF`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 1,
              fontWeight: 'bold'
            }}
          />
        )}

        {/* Favorite Button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)'
            }
          }}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>

        {/* Product Image */}
        <CardMedia
          component="img"
          height={compact ? 120 : 180}
          image={product.image || '/api/placeholder/300/300'}
          alt={product.name}
          onClick={() => setShowDetails(true)}
          sx={{ cursor: 'pointer' }}
        />

        <CardContent sx={{ pb: 1 }}>
          {/* Product Name */}
          <Typography
            variant={compact ? 'body2' : 'h6'}
            fontWeight="bold"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1
            }}
          >
            {product.name}
          </Typography>

          {/* Vendor Info */}
          {product.vendorName && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {product.vendorName}
              </Typography>
            </Box>
          )}

          {/* Rating */}
          {product.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating
                value={product.rating}
                precision={0.1}
                size="small"
                readOnly
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviewCount || 0})
              </Typography>
            </Box>
          )}

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatPrice(product.price)}
            </Typography>
            {isDiscounted && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through', ml: 1 }}
              >
                {formatPrice(product.originalPrice)}
              </Typography>
            )}
          </Box>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <Chip
              label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              color={product.stock > 0 ? 'success' : 'error'}
              size="small"
              variant="outlined"
            />
          )}
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2 }}>
          {/* Quantity Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <IconButton
              size="small"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Remove />
            </IconButton>
            <Typography sx={{ mx: 1, minWidth: 20, textAlign: 'center' }}>
              {quantity}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setQuantity(quantity + 1)}
              disabled={product.stock && quantity >= product.stock}
            >
              <Add />
            </IconButton>
          </Box>

          {/* Add to Cart Button */}
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={!product.stock || product.stock === 0}
            sx={{ flexGrow: 1, mr: 1 }}
            size={compact ? 'small' : 'medium'}
          >
            Add to Cart
          </Button>

          {/* Share Button */}
          <IconButton onClick={handleShare} size="small">
            <Share />
          </IconButton>
        </CardActions>
      </Card>

      {/* Product Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {product.name}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={product.image || '/api/placeholder/300/300'}
              alt={product.name}
              style={{
                width: '100%',
                maxWidth: 300,
                height: 'auto',
                borderRadius: 8
              }}
            />
          </Box>
          
          <Typography variant="body1" paragraph>
            {product.description || 'Fresh and high-quality agricultural product.'}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {formatPrice(product.price)}
            </Typography>
            {isDiscounted && (
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                {formatPrice(product.originalPrice)}
              </Typography>
            )}
          </Box>
          
          {product.specifications && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Specifications:
              </Typography>
              {Object.entries(product.specifications).map(([key, value]) => (
                <Typography key={key} variant="body2" color="text.secondary">
                  <strong>{key}:</strong> {value}
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => {
              handleAddToCart();
              setShowDetails(false);
            }}
            disabled={!product.stock || product.stock === 0}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MobileProductCard;