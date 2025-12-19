import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  IconButton,
  Button,
  BottomSheet,
  Drawer,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Slider,
  useTheme
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Star as StarIcon,
  Add as AddIcon,
  Sort as SortIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import productsService from '../services/productsService';
import ProductImage from '../components/ProductImage';

const MobileProductsPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: [0, 2000],
    rating: 0,
    inStock: false
  });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    // Load real scraped products data
    try {
      const allProducts = productsService.getAllProducts();
      setProducts(allProducts);

      console.log('🌾 Loaded products for products page:', allProducts.length);
    } catch (error) {
      console.error('Error loading products:', error);

      // Fallback to mock data
      const mockProducts = [
      {
        id: 1,
        name: 'NPK Fertilizer Premium 50kg',
        price: 850,
        originalPrice: 1200,
        discount: 29,
        rating: 4.5,
        reviews: 234,
        image: '/api/placeholder/200/200',
        category: 'Fertilizers',
        inStock: true,
        brand: 'AgroTech'
      },
      {
        id: 2,
        name: 'Organic Compost 25kg',
        price: 450,
        originalPrice: 600,
        discount: 25,
        rating: 4.3,
        reviews: 156,
        image: '/api/placeholder/200/200',
        category: 'Organic',
        inStock: true,
        brand: 'EcoFarm'
      },
      {
        id: 3,
        name: 'Wheat Seeds Premium Quality',
        price: 320,
        originalPrice: 400,
        discount: 20,
        rating: 4.7,
        reviews: 89,
        image: '/api/placeholder/200/200',
        category: 'Seeds',
        inStock: true,
        brand: 'SeedMaster'
      },
      {
        id: 4,
        name: 'Plant Growth Booster 1L',
        price: 280,
        originalPrice: 350,
        discount: 20,
        rating: 4.4,
        reviews: 67,
        image: '/api/placeholder/200/200',
        category: 'Fertilizers',
        inStock: false,
        brand: 'GrowFast'
      },
      {
        id: 5,
        name: 'Organic Pesticide 500ml',
        price: 380,
        originalPrice: 450,
        discount: 16,
        rating: 4.2,
        reviews: 123,
        image: '/api/placeholder/200/200',
        category: 'Pesticides',
        inStock: true,
        brand: 'BioShield'
      },
      {
        id: 6,
        name: 'Drip Irrigation Kit',
        price: 1200,
        originalPrice: 1500,
        discount: 20,
        rating: 4.6,
        reviews: 45,
        image: '/api/placeholder/200/200',
        category: 'Equipment',
        inStock: true,
        brand: 'WaterSave'
      }
    ];
      setProducts(mockProducts);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, sortBy, products]);

  const applyFilters = () => {
    let filtered = [...products];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = typeof product.price === 'string' ?
        parseFloat(product.price.replace(/[₹,]/g, '')) :
        product.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product =>
        product.inStock || product.availability === 'In Stock'
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[₹,]/g, '')) : a.price;
          const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[₹,]/g, '')) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price_high':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[₹,]/g, '')) : a.price;
          const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[₹,]/g, '')) : b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discountPercentage || b.discount || 0) - (a.discountPercentage || a.discount || 0));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  const categories = ['Fertilizers', 'Seeds', 'Pesticides', 'Equipment', 'Organic', 'Tools'];
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'discount', label: 'Discount' }
  ];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header with Filter and Sort */}
      <Box sx={{ 
        px: 2, 
        py: 1.5, 
        bgcolor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold">
          Products ({filteredProducts.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SortIcon />}
            onClick={() => setSortOpen(true)}
            sx={{ borderColor: '#4CAF50', color: '#4CAF50', textTransform: 'none' }}
          >
            Sort
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterIcon />}
            onClick={() => setFilterOpen(true)}
            sx={{ borderColor: '#4CAF50', color: '#4CAF50', textTransform: 'none' }}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {/* Active Filters */}
      {(filters.category || filters.rating > 0 || filters.inStock) && (
        <Box sx={{ px: 2, py: 1, bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.category && (
              <Chip
                label={filters.category}
                size="small"
                onDelete={() => setFilters(prev => ({ ...prev, category: '' }))}
                sx={{ bgcolor: '#E8F5E8', color: '#4CAF50' }}
              />
            )}
            {filters.rating > 0 && (
              <Chip
                label={`${filters.rating}+ Rating`}
                size="small"
                onDelete={() => setFilters(prev => ({ ...prev, rating: 0 }))}
                sx={{ bgcolor: '#E8F5E8', color: '#4CAF50' }}
              />
            )}
            {filters.inStock && (
              <Chip
                label="In Stock"
                size="small"
                onDelete={() => setFilters(prev => ({ ...prev, inStock: false }))}
                sx={{ bgcolor: '#E8F5E8', color: '#4CAF50' }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* Products Grid */}
      <Box sx={{ px: 2, py: 2 }}>
        <Grid container spacing={1.5}>
          {filteredProducts.map((product) => (
            <Grid item xs={6} key={product.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <ProductImage
                  product={product}
                  width="100%"
                  height={140}
                  alt={product.name}
                  responsive={true}
                  sx={{ borderRadius: 0 }}
                />
                <CardContent sx={{ p: 1.5 }}>
                  <Typography 
                    variant="body2" 
                    fontWeight="500" 
                    sx={{ 
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '2.4em'
                    }}
                  >
                    {product.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                      ₹{product.price}
                    </Typography>
                    {product.originalPrice > product.price && (
                      <>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            textDecoration: 'line-through', 
                            color: '#999', 
                            ml: 0.5 
                          }}
                        >
                          ₹{product.originalPrice}
                        </Typography>
                        <Chip
                          label={`${product.discount}% OFF`}
                          size="small"
                          sx={{
                            ml: 0.5,
                            bgcolor: '#FF5722',
                            color: 'white',
                            fontSize: '0.6rem',
                            height: 16
                          }}
                        />
                      </>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ fontSize: 14, color: '#FF9800' }} />
                      <Typography variant="caption" sx={{ ml: 0.5, color: '#666' }}>
                        {product.rating}
                      </Typography>
                    </Box>
                    {product.inStock ? (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        sx={{
                          bgcolor: '#4CAF50',
                          color: 'white',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            bgcolor: '#45a049'
                          }
                        }}
                      >
                        <AddIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    ) : (
                      <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 500 }}>
                        Out of Stock
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '80vh'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Filters
            </Typography>
            <IconButton onClick={() => setFilterOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Category Filter */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Category
          </Typography>
          <Box sx={{ mb: 3 }}>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={filters.category === category}
                    onChange={(e) => 
                      setFilters(prev => ({ 
                        ...prev, 
                        category: e.target.checked ? category : '' 
                      }))
                    }
                    sx={{ color: '#4CAF50', '&.Mui-checked': { color: '#4CAF50' } }}
                  />
                }
                label={category}
              />
            ))}
          </Box>

          {/* Price Range */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Price Range
          </Typography>
          <Box sx={{ px: 2, mb: 3 }}>
            <Slider
              value={filters.priceRange}
              onChange={(e, newValue) => setFilters(prev => ({ ...prev, priceRange: newValue }))}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
              sx={{ color: '#4CAF50' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">₹{filters.priceRange[0]}</Typography>
              <Typography variant="caption">₹{filters.priceRange[1]}</Typography>
            </Box>
          </Box>

          {/* Other Filters */}
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.inStock}
                onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                sx={{ color: '#4CAF50', '&.Mui-checked': { color: '#4CAF50' } }}
              />
            }
            label="In Stock Only"
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setFilters({ category: '', priceRange: [0, 2000], rating: 0, inStock: false });
                setFilterOpen(false);
              }}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setFilterOpen(false)}
              sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' } }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Sort Drawer */}
      <Drawer
        anchor="bottom"
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Sort By
            </Typography>
            <IconButton onClick={() => setSortOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {sortOptions.map((option) => (
              <ListItem
                key={option.value}
                button
                onClick={() => {
                  setSortBy(option.value);
                  setSortOpen(false);
                }}
                sx={{
                  bgcolor: sortBy === option.value ? '#E8F5E8' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                <ListItemText 
                  primary={option.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: sortBy === option.value ? '#4CAF50' : 'inherit',
                      fontWeight: sortBy === option.value ? 600 : 400
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MobileProductsPage;
