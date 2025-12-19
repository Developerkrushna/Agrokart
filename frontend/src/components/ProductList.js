import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Container,
    Chip,
    Rating,
    IconButton,
    Snackbar,
    Alert,
    Skeleton,
    Stack,
    useTheme,
    alpha,
    keyframes
} from '@mui/material';
import {
    Add,
    Remove,
    ShoppingCart,
    Image,
    Favorite,
    FavoriteBorder,
    Visibility,
    FlashOn,
    LocalFireDepartment,
    Nature // Changed from Eco to Nature
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../services/api';

// Add pulse animation for featured products
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [favorites, setFavorites] = useState(new Set());
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { t } = useLanguage();
    const theme = useTheme();

    // Available product images for fallback
    const availableImages = [
        '/images/products/organic-fertilizer.jpg',
        '/images/products/npk.jpg',
        '/images/products/urea.jpg',
        '/images/products/dap.jpg',
        '/images/products/organic compost.jpeg'
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const productsData = await getProducts();
            // Filter to show only fertilizer products on home page
            const fertilizerProducts = productsData.filter(product =>
                product.category.includes('Fertilizers') ||
                product.category === 'Fertilizers'
            );
            setProducts(fertilizerProducts);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (productId, change) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + change)
        }));
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product._id] || 1;
        addToCart(product, quantity);
        setSnackbar({
            open: true,
            message: t('products.addToCart') + ' - ' + product.name,
            severity: 'success'
        });
    };

    const handleToggleFavorite = (productId) => {
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

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getDiscountPercentage = (originalPrice, currentPrice) => {
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    };

    const handleImageError = (event, productIndex) => {
        // Use a fallback image from available images
        const fallbackImage = availableImages[productIndex % availableImages.length];
        event.target.src = fallbackImage;
    };

    const getProductImage = (product, index) => {
        // Try to get image from product data, otherwise use fallback
        if (product.images && product.images.length > 0) {
            return `/uploads/${product.images[0]}`;
        }
        if (product.image) {
            return `/uploads/${product.image}`;
        }
        // Use fallback based on product category or index
        return availableImages[index % availableImages.length];
    };

    // Modern loading skeleton
    const ProductSkeleton = () => (
        <Card sx={{
            height: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            animation: `${pulse} 2s infinite`
        }}>
            <Skeleton variant="rectangular" height={240} />
            <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" height={32} width="80%" />
                <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Skeleton variant="rounded" width={60} height={24} />
                    <Skeleton variant="rounded" width={80} height={24} />
                </Box>
                <Skeleton variant="text" height={28} width="40%" sx={{ mt: 2 }} />
                <Skeleton variant="rectangular" height={40} sx={{ mt: 2, borderRadius: 2 }} />
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item}>
                            <ProductSkeleton />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button 
                    variant="contained" 
                    onClick={fetchProducts}
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Container>
        );
    }

    if (products.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Image sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No products available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Check back later for new products
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Stats */}
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {products.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Products Available
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                        24h
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Fast Delivery
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                        100%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Quality Assured
                    </Typography>
                </Box>
            </Stack>

            {localStorage.getItem('userRole') === 'admin' && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/admin/products/add')}
                    sx={{ mb: 2 }}
                >
                    Add New Product
                </Button>
            )}
            <Grid container spacing={3}>
                {products.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                }
                            }}
                        >
                            {/* Badges */}
                            <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                                <Stack direction="row" spacing={1}>
                                    {product.discount && (
                                        <Chip
                                            icon={<FlashOn sx={{ fontSize: 16 }} />}
                                            label={`-${getDiscountPercentage(product.originalPrice, product.price)}%`}
                                            size="small"
                                            sx={{
                                                bgcolor: theme.palette.error.main,
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    )}
                                    {product.isPopular && (
                                        <Chip
                                            icon={<LocalFireDepartment sx={{ fontSize: 16 }} />}
                                            label="Popular"
                                            size="small"
                                            sx={{
                                                bgcolor: theme.palette.warning.main,
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    )}
                                    {product.isOrganic && (
                                        <Chip
                                            icon={<Nature sx={{ fontSize: 16 }} />} // Changed from Eco to Nature
                                            label="Organic"
                                            size="small"
                                            sx={{
                                                bgcolor: theme.palette.success.main,
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    )}
                                </Stack>
                            </Box>

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
                                    },
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => handleToggleFavorite(product._id)}
                            >
                                {favorites.has(product._id) ? (
                                    <Favorite sx={{ color: theme.palette.error.main }} />
                                ) : (
                                    <FavoriteBorder sx={{ color: theme.palette.grey[600] }} />
                                )}
                            </IconButton>

                            <CardMedia
                                component="img"
                                height="240"
                                image={product.images?.[0] || getProductImage(product, index)}
                                alt={product.name}
                                onError={(e) => handleImageError(e, index)}
                                sx={{
                                    objectFit: 'cover',
                                    bgcolor: 'grey.100',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)'
                                    }
                                }}
                            />
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        color: theme.palette.text.primary,
                                        lineHeight: 1.3
                                    }}
                                >
                                    {product.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        lineHeight: 1.5,
                                        mb: 2,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {product.description}
                                </Typography>

                                {/* Category and Stock */}
                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                    <Chip
                                        label={product.category}
                                        size="small"
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            fontWeight: 500,
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                    <Chip
                                        label={`${product.stock} ${product.unit} in stock`}
                                        size="small"
                                        sx={{
                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                            color: theme.palette.success.main,
                                            fontWeight: 500,
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                </Stack>

                                {/* Price Section */}
                                <Box sx={{ mb: 2 }}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: theme.palette.primary.main
                                            }}
                                        >
                                            ₹{product.price}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            /{product.unit}
                                        </Typography>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    textDecoration: 'line-through',
                                                    color: theme.palette.text.disabled
                                                }}
                                            >
                                                ₹{product.originalPrice}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Box>

                                {/* Rating */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Rating
                                        value={product.averageRating || 0}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        ({product.ratings?.length || 0} reviews)
                                    </Typography>
                                </Box>

                                {/* Add to Cart Section */}
                                <Box sx={{ mt: 'auto' }}>
                                    {/* Quantity Selector */}
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                        bgcolor: alpha(theme.palette.grey[100], 0.5),
                                        borderRadius: 2,
                                        p: 0.5
                                    }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleQuantityChange(product._id, -1)}
                                            disabled={quantities[product._id] <= 1}
                                            sx={{
                                                bgcolor: quantities[product._id] <= 1 ? 'transparent' : 'white',
                                                '&:hover': {
                                                    bgcolor: quantities[product._id] <= 1 ? 'transparent' : alpha(theme.palette.primary.main, 0.1)
                                                }
                                            }}
                                        >
                                            <Remove fontSize="small" />
                                        </IconButton>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mx: 2,
                                                minWidth: '30px',
                                                textAlign: 'center',
                                                fontWeight: 600
                                            }}
                                        >
                                            {quantities[product._id] || 1}
                                        </Typography>

                                        <IconButton
                                            size="small"
                                            onClick={() => handleQuantityChange(product._id, 1)}
                                            disabled={quantities[product._id] >= product.stock}
                                            sx={{
                                                bgcolor: quantities[product._id] >= product.stock ? 'transparent' : 'white',
                                                '&:hover': {
                                                    bgcolor: quantities[product._id] >= product.stock ? 'transparent' : alpha(theme.palette.primary.main, 0.1)
                                                }
                                            }}
                                        >
                                            <Add fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    {/* Add to Cart Button */}
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<ShoppingCart />}
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock === 0}
                                        sx={{
                                            borderRadius: 2,
                                            py: 1.5,
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
                                            }
                                        }}
                                    >
                                        {product.stock === 0 ? 'Out of Stock' : t('products.addToCart')}
                                    </Button>

                                    {/* Quick View Button */}
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<Visibility />}
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        sx={{
                                            mt: 1,
                                            borderRadius: 2,
                                            py: 1,
                                            fontWeight: 500,
                                            fontSize: '0.8rem',
                                            textTransform: 'none',
                                            borderColor: alpha(theme.palette.primary.main, 0.3),
                                            color: theme.palette.primary.main,
                                            '&:hover': {
                                                borderColor: theme.palette.primary.main,
                                                bgcolor: alpha(theme.palette.primary.main, 0.04)
                                            }
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductList;