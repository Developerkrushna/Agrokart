import React, { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import imageService from '../services/imageService';

const ProductImage = ({ 
  product, 
  width = 300, 
  height = 200, 
  alt, 
  sx = {},
  responsive = false,
  ...props 
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (product) {
      // Get the appropriate image URL
      const url = imageService.getProductImage(product);
      setImageUrl(url);
    }
  }, [product]);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
    
    // Try fallback image
    if (product && !imageUrl.includes('placeholder')) {
      const fallbackUrl = imageService.getPlaceholderImage(product, width, height);
      setImageUrl(fallbackUrl);
    }
  };

  const getResponsiveSrcSet = () => {
    if (!responsive || !product) return undefined;
    
    const responsiveImages = imageService.getResponsiveImages(product);
    return `
      ${responsiveImages.small} 300w,
      ${responsiveImages.medium} 600w,
      ${responsiveImages.large} 1200w
    `;
  };

  const getSizes = () => {
    if (!responsive) return undefined;
    
    return `
      (max-width: 600px) 300px,
      (max-width: 1200px) 600px,
      1200px
    `;
  };

  if (!product || !imageUrl) {
    return (
      <Skeleton
        variant="rectangular"
        width={width}
        height={height}
        sx={{
          borderRadius: 1,
          ...sx
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        backgroundColor: '#f5f5f5',
        ...sx
      }}
    >
      {loading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
        />
      )}
      
      <img
        src={imageUrl}
        alt={alt || product.name}
        srcSet={getResponsiveSrcSet()}
        sizes={getSizes()}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: loading ? 'none' : 'block',
          transition: 'opacity 0.3s ease'
        }}
        {...props}
      />
      
      {error && !loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#666',
            fontSize: '0.8rem',
            textAlign: 'center',
            padding: 1
          }}
        >
          🌾<br />
          {product.category}
        </Box>
      )}
    </Box>
  );
};

export default ProductImage;
