import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Badge,
  useTheme,
  Container,
  Skeleton
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import productsService from '../services/productsService';
import ProductImage from '../components/ProductImage';

const CategoriesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      const categoriesData = productsService.getCategories();
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading categories:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = (product, event) => {
    event.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace(/[₹,]/g, '')),
      image: product.imageUrl,
      category: product.category
    });
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category.name)}`);
  };

  const renderProductCard = (product) => (
    <Card
      key={product.id}
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
      onClick={() => handleProductClick(product)}
    >
      <Box sx={{ position: 'relative' }}>
        <ProductImage
          product={product}
          width="100%"
          height={200}
          alt={product.name}
          responsive={true}
          sx={{ borderRadius: 0 }}
        />
        
        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <Chip
            icon={<OfferIcon />}
            label={`${product.discountPercentage}% OFF`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
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
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,1)'
            }
          }}
          size="small"
          onClick={(e) => e.stopPropagation()}
        >
          <FavoriteIcon sx={{ color: '#ccc' }} />
        </IconButton>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              mr: 1
            }}
          >
            {product.price}
          </Typography>
          
          {product.originalPrice && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary'
              }}
            >
              {product.originalPrice}
            </Typography>
          )}
        </Box>

        {/* Rating */}
        {product.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <StarIcon sx={{ color: '#FFD700', fontSize: '1rem', mr: 0.5 }} />
            <Typography variant="body2" sx={{ mr: 1 }}>
              {product.rating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({product.reviews_count} reviews)
            </Typography>
          </Box>
        )}

        {/* Brand */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.brand}
        </Typography>

        {/* Add to Cart Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={product.availability}
            color={product.availability === 'In Stock' ? 'success' : 'default'}
            size="small"
          />
          
          <IconButton
            color="primary"
            onClick={(e) => handleAddToCart(product, e)}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}
          >
            <CartIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  const renderCategorySection = (category) => (
    <Box key={category.name} sx={{ mb: 6 }}>
      {/* Category Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          p: 3,
          background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}10 100%)`,
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}
        onClick={() => handleCategoryClick(category)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h2"
            sx={{ fontSize: '3rem', mr: 2 }}
          >
            {category.icon}
          </Typography>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: category.color,
                mb: 0.5
              }}
            >
              {category.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {category.description}
            </Typography>
          </Box>
        </Box>
        
        <Badge
          badgeContent={category.count}
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '1rem',
              minWidth: '24px',
              height: '24px'
            }
          }}
        >
          <Typography
            variant="button"
            sx={{
              color: category.color,
              fontWeight: 'bold',
              textDecoration: 'underline'
            }}
          >
            View All
          </Typography>
        </Badge>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={2}>
        {category.products.map(product => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
            {renderProductCard(product)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Product Categories
        </Typography>
        
        {[1, 2, 3].map(i => (
          <Box key={i} sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2, borderRadius: 2 }} />
            <Grid container spacing={2}>
              {[1, 2, 3, 4, 5, 6].map(j => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={j}>
                  <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: 'linear-gradient(135deg, #16A34A 0%, #8B5CF6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          🌾 Agricultural Products
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover quality fertilizers, seeds, and farming supplies
        </Typography>
      </Box>

      {/* Categories */}
      {categories.map(category => renderCategorySection(category))}

      {/* Statistics */}
      <Box
        sx={{
          mt: 6,
          p: 3,
          background: 'linear-gradient(135deg, #F0FDF4 0%, #E6F3FF 50%, #F3E8FF 100%)',
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          📊 Our Product Range
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#16A34A' }}>
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Products
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8B5CF6' }}>
              {categories.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Categories
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F59E0B' }}>
              {productsService.getBrands().length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Brands
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#EF4444' }}>
              4.2★
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Rating
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CategoriesPage;
