import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Divider,
  Chip,
  Rating,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
  Support as SupportIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { getProduct } from '../services/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProduct(id);
        
        if (response._id) {
          setProduct(response);
        } else {
          setError(response.message || 'Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const relatedProducts = [
    {
      id: 1,
      name: 'Bio Fertilizer',
      price: 750,
      image: 'https://placehold.co/400x300/4CAF50/FFFFFF?text=Bio+Fertilizer'
    },
    {
      id: 2,
      name: 'Soil Amendment',
      price: 650,
      image: 'https://placehold.co/400x300/81C784/FFFFFF?text=Soil+Amendment'
    },
    {
      id: 3,
      name: 'Micronutrient Mix',
      price: 950,
      image: 'https://placehold.co/400x300/A5D6A7/FFFFFF?text=Micronutrient+Mix'
    }
  ];

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setSnackbar({
        open: true,
        message: 'Product added to cart successfully!',
        severity: 'success'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Product not found'}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              component="img"
              src={product.image ? `/uploads/${product.image}` : 'https://placehold.co/600x400/2E7D32/FFFFFF?text=No+Image'}
              alt={product.name}
              sx={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'contain'
              }}
            />
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating || 0} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.numReviews || 0} reviews)
              </Typography>
            </Box>
            <Typography variant="h5" color="primary" gutterBottom>
              ₹{product.price}
            </Typography>
            <Chip
              label={product.category}
              color="primary"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
          </Box>

          {/* Quantity and Add to Cart */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: product.stock }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={8}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Product Details Tabs */}
          <Paper sx={{ mt: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
            >
              <Tab label="Specifications" />
              <Tab label="Usage" />
              <Tab label="Benefits" />
              <Tab label="Precautions" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <List>
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemIcon>
                        <InfoIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={key.charAt(0).toUpperCase() + key.slice(1)}
                        secondary={typeof value === 'object' ? JSON.stringify(value) : value}
                      />
                    </ListItem>
                  ))}
                  <ListItem>
                    <ListItemIcon>
                      <InfoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Brand"
                      secondary={product.brand}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <InfoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Unit"
                      secondary={product.unit}
                    />
                  </ListItem>
                </List>
              )}

              {activeTab === 1 && (
                <List>
                  {product.specifications?.usage ? (
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={product.specifications.usage} />
                    </ListItem>
                  ) : (
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText primary="Usage information not available" />
                    </ListItem>
                  )}
                </List>
              )}

              {activeTab === 2 && (
                <List>
                  {product.recommendedCrops && product.recommendedCrops.length > 0 ? (
                    product.recommendedCrops.map((crop, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <VerifiedIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={`Recommended for ${crop}`} />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText primary="Recommended crops information not available" />
                    </ListItem>
                  )}
                </List>
              )}

              {activeTab === 3 && (
                <List>
                  {product.specifications?.precautions ? (
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={product.specifications.precautions} />
                    </ListItem>
                  ) : (
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText primary="Precautions information not available" />
                    </ListItem>
                  )}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Related Products */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Related Products
        </Typography>
        <Grid container spacing={3}>
          {relatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetailPage; 