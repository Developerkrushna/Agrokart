import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  IconButton,

  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Skeleton,
  useTheme,
  alpha,
  Alert
} from '@mui/material';
import {
  FilterList as FilterIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as ViewIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWorkflow } from '../components/WorkflowManager';

import SearchSuggestions from '../components/SearchSuggestions';
import { mockProducts } from '../data/mockProducts';

const ProductsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { transitionTo, WORKFLOW_STEPS } = useWorkflow();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Fertilizers'); // Default to Fertilizers
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const [searchFromNav, setSearchFromNav] = useState('');

  const productsPerPage = 12;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle search and category from navigation
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const categoryFromUrl = searchParams.get('category');

    if (searchFromUrl) {
      setSearchFromNav(searchFromUrl);
      setSearchQuery(searchFromUrl);
      setCurrentPage(1); // Reset to first page when searching
    }

    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl);
      setCurrentPage(1); // Reset to first page when changing category
    }
  }, [searchParams]);

  // Clear search when component unmounts or search is cleared
  useEffect(() => {
    return () => {
      if (!searchParams.get('search')) {
        setSearchFromNav('');
        setSearchQuery('');
      }
    };
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Combine local search and navigation search
      const effectiveSearchQuery = searchFromNav || searchQuery;
      const matchesSearch = !effectiveSearchQuery ||
                           product.name.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
                           product.brand.toLowerCase().includes(effectiveSearchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' ||
                             product.category === categoryFilter ||
                             (categoryFilter === 'Fertilizers' && product.category.includes('Fertilizers'));
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Get unique categories
  const categories = [...new Set(products.map(product => product.category))];

  const handleAddToCart = (product) => {
    addToCart(product);
    transitionTo(WORKFLOW_STEPS.ADD_TO_CART, { product });
  };

  const handleProductView = (productId) => {
    transitionTo(WORKFLOW_STEPS.PRODUCT_DETAIL, { productId });
    navigate(`/product/${productId}`);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchFromNav('');
    setCurrentPage(1);
    // Remove search parameter from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('search');
    setSearchParams(newSearchParams);
  };



  const handleSuggestionClick = (term) => {
    setSearchQuery(term);
    setSearchFromNav(term);
    setCurrentPage(1);
    // Update URL with search parameter
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('search', term);
    setSearchParams(newSearchParams);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>


      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {searchFromNav && (
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Search Results
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Typography variant="h6" color="text.secondary">
                Showing results for: <strong>"{searchFromNav}"</strong>
              </Typography>
              <Chip
                label={`${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<ClearIcon />}
                onClick={clearSearch}
                sx={{ textTransform: 'none' }}
              >
                Clear Search
              </Button>
            </Box>
            {filteredProducts.length === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  No products found for "{searchFromNav}".
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try searching for: <strong>urea</strong>, <strong>dap</strong>, <strong>npk</strong>, <strong>organic</strong>, or <strong>potash</strong>
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </Box>

      {/* Filters and Search */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', height: 56 }}>
              {filteredProducts.length} products found
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {paginatedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                }
              }}
            >
              {/* Favorite Button */}
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 2,
                  bgcolor: alpha('#fff', 0.9),
                  '&:hover': {
                    bgcolor: '#fff',
                    transform: 'scale(1.1)'
                  }
                }}
                onClick={() => toggleFavorite(product._id)}
              >
                {favorites.has(product._id) ? (
                  <FavoriteIcon sx={{ color: theme.palette.error.main }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>

              {/* Product Image */}
              <CardMedia
                component="img"
                height="200"
                image={product.images?.[0] || '/api/placeholder/300/200'}
                alt={product.name}
                sx={{ cursor: 'pointer' }}
                onClick={() => handleProductView(product._id)}
              />

              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                {/* Category */}
                <Chip
                  label={product.category}
                  size="small"
                  sx={{
                    mb: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 500
                  }}
                />

                {/* Product Name */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main }
                  }}
                  onClick={() => handleProductView(product._id)}
                >
                  {product.name}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={product.averageRating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.ratings?.length || 0})
                  </Typography>
                </Box>

                {/* Price */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    ₹{product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    /{product.unit}
                  </Typography>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: 'line-through',
                        color: theme.palette.text.disabled,
                        ml: 1
                      }}
                    >
                      ₹{product.originalPrice}
                    </Typography>
                  )}
                </Box>

                {/* Stock Status */}
                <Typography
                  variant="body2"
                  sx={{
                    color: product.stock > 0 ? theme.palette.success.main : theme.palette.error.main,
                    fontWeight: 500,
                    mb: 2
                  }}
                >
                  {product.stock > 0 ? `${product.stock} ${product.unit} in stock` : 'Out of stock'}
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<CartIcon />}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    sx={{
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Add to Cart
                  </Button>
                  <IconButton
                    onClick={() => handleProductView(product._id)}
                    sx={{
                      border: `1px solid ${theme.palette.primary.main}`,
                      color: theme.palette.primary.main
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search Suggestions - Show when no products found or no search active */}
      {(filteredProducts.length === 0 || (!searchFromNav && !searchQuery)) && (
        <SearchSuggestions
          onSuggestionClick={handleSuggestionClick}
          currentSearch={searchFromNav || searchQuery}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductsPage;
