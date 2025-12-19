import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Star as StarIcon,
  ShoppingCart as CartIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { 
  getProducts, 
  getAllCategories, 
  getProductsByCategory, 
  getFeaturedProducts,
  searchProducts 
} from '../services/api';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy, sortOrder, searchQuery, currentPage, minPrice, maxPrice]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load categories and featured products
      const [categoriesData, featuredData] = await Promise.all([
        getAllCategories(),
        getFeaturedProducts(6)
      ]);
      
      setCategories(categoriesData);
      setFeaturedProducts(featuredData);
      
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');

      let productsData;

      if (searchQuery) {
        // Search products
        productsData = await searchProducts(searchQuery, {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          page: currentPage,
          limit: 12
        });
      } else if (selectedCategory !== 'all') {
        // Get products by category
        const categoryData = await getProductsByCategory(selectedCategory, {
          page: currentPage,
          limit: 12,
          sortBy,
          sortOrder,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined
        });
        productsData = categoryData.products;
      } else {
        // Get all products
        productsData = await getProducts({
          page: currentPage,
          limit: 12,
          sortBy,
          sortOrder,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          search: searchQuery || undefined
        });
      }

      setProducts(Array.isArray(productsData) ? productsData : []);
      
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSortBy('name');
    setSortOrder('asc');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Product Catalog
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <CategoryIcon sx={{ mr: 1 }} />
          Categories
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="All Products"
            onClick={() => handleCategoryChange('all')}
            color={selectedCategory === 'all' ? 'primary' : 'default'}
            variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
          />
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={`${category.icon} ${category.name} (${category.count})`}
              onClick={() => handleCategoryChange(category.id)}
              color={selectedCategory === category.id ? 'primary' : 'default'}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search Products"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="averageRating">Rating</MenuItem>
            <MenuItem value="createdAt">Date Added</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Order</InputLabel>
          <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Min Price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          size="small"
          sx={{ width: 100 }}
        />

        <TextField
          label="Max Price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          size="small"
          sx={{ width: 100 }}
        />

        <Button onClick={resetFilters} variant="outlined" size="small">
          Reset Filters
        </Button>
      </Box>

      {/* Featured Products */}
      {featuredProducts.length > 0 && selectedCategory === 'all' && !searchQuery && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            ⭐ Featured Products
          </Typography>
          <Grid container spacing={2}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={product._id}>
                <ProductCard product={product} featured />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Products Grid */}
      <Typography variant="h6" gutterBottom>
        {searchQuery ? `Search Results for "${searchQuery}"` : 
         selectedCategory !== 'all' ? `${selectedCategory.toUpperCase()} Products` : 'All Products'}
        ({products.length} items)
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Alert severity="info">
          No products found. Try adjusting your filters.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {products.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={10} // This should come from API response
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

// Product Card Component
const ProductCard = ({ product, featured = false }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        border: featured ? '2px solid gold' : 'none',
        position: 'relative'
      }}
    >
      {featured && (
        <Chip
          label="Featured"
          color="warning"
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        />
      )}
      
      <CardMedia
        component="img"
        height="200"
        image={product.images?.[0] || product.image || '/api/placeholder/300/200'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom noWrap>
          {product.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.brand}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description?.substring(0, 100)}...
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            ₹{product.price}
          </Typography>
          <Typography variant="body2" sx={{ ml: 1 }}>
            /{product.unit}
          </Typography>
        </Box>
        
        {product.averageRating > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <StarIcon sx={{ color: 'gold', fontSize: 16 }} />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {product.averageRating.toFixed(1)}
            </Typography>
          </Box>
        )}
        
        <Button
          variant="contained"
          startIcon={<CartIcon />}
          fullWidth
          size="small"
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCatalog;
