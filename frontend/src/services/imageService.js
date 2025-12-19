/**
 * Image Service for AgriNet
 * Handles image optimization, compression, and CDN delivery
 */

class ImageService {
  constructor() {
    this.imageCache = new Map();
    this.fallbackImages = this.initializeFallbackImages();
  }

  initializeFallbackImages() {
    return {
      // Fertilizers
      'fertilizer': [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop&auto=format'
      ],
      
      // Seeds
      'seeds': [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop&auto=format'
      ],
      
      // Pesticides
      'pesticides': [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop&auto=format'
      ],
      
      // Farm Equipment
      'equipment': [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format'
      ]
    };
  }

  /**
   * Get category-specific images
   */
  getCategoryImages(category) {
    const categoryKey = category.toLowerCase();
    
    if (categoryKey.includes('fertilizer')) return this.fallbackImages.fertilizer;
    if (categoryKey.includes('seed')) return this.fallbackImages.seeds;
    if (categoryKey.includes('pesticide')) return this.fallbackImages.pesticides;
    if (categoryKey.includes('equipment') || categoryKey.includes('implement')) return this.fallbackImages.equipment;
    
    // Default to fertilizer images
    return this.fallbackImages.fertilizer;
  }

  /**
   * Get product-specific image based on name and category
   */
  getProductImage(product) {
    const cacheKey = `${product.id}_${product.name}`;
    
    // Check cache first
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey);
    }

    let imageUrl = this.selectImageByProduct(product);
    
    // Cache the result
    this.imageCache.set(cacheKey, imageUrl);
    
    return imageUrl;
  }

  /**
   * Select appropriate image based on product details
   */
  selectImageByProduct(product) {
    const name = product.name.toLowerCase();
    const category = product.category.toLowerCase();
    
    // Specific product type mapping
    if (name.includes('npk') || name.includes('nitrogen') || name.includes('urea')) {
      return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&auto=format';
    }
    
    if (name.includes('organic') || name.includes('compost') || name.includes('manure')) {
      return 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=300&fit=crop&auto=format';
    }
    
    if (name.includes('wheat') || name.includes('rice') || name.includes('corn')) {
      return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format';
    }
    
    if (name.includes('tomato') || name.includes('vegetable')) {
      return 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop&auto=format';
    }
    
    if (name.includes('spray') || name.includes('pesticide') || name.includes('herbicide')) {
      return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&auto=format';
    }
    
    if (name.includes('tractor') || name.includes('pump') || name.includes('machine')) {
      return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&auto=format';
    }
    
    if (name.includes('irrigation') || name.includes('drip') || name.includes('sprinkler')) {
      return 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop&auto=format';
    }
    
    // Fallback to category-based selection
    const categoryImages = this.getCategoryImages(category);
    const hash = this.hashCode(product.name);
    const index = Math.abs(hash) % categoryImages.length;
    
    return categoryImages[index];
  }

  /**
   * Generate hash code for consistent image selection
   */
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * Get placeholder image with product info
   */
  getPlaceholderImage(product, width = 400, height = 300) {
    const category = product.category || 'Product';
    const color = this.getCategoryColor(category);
    
    return `https://via.placeholder.com/${width}x${height}/${color}/white?text=${encodeURIComponent(category)}`;
  }

  /**
   * Get category color for placeholders
   */
  getCategoryColor(category) {
    const categoryColors = {
      'fertilizers': '4CAF50',
      'seeds': 'FF9800', 
      'pesticides': 'F44336',
      'farm equipment': 'FF5722',
      'farm implements': '2196F3'
    };
    
    return categoryColors[category.toLowerCase()] || '4CAF50';
  }

  /**
   * Preload images for better performance
   */
  preloadImages(products) {
    products.forEach(product => {
      const img = new Image();
      img.src = this.getProductImage(product);
    });
  }

  /**
   * Handle image loading errors
   */
  handleImageError(product, imgElement) {
    // Try placeholder image
    const placeholderUrl = this.getPlaceholderImage(product);
    
    if (imgElement.src !== placeholderUrl) {
      imgElement.src = placeholderUrl;
    }
  }

  /**
   * Get optimized image URL with parameters
   */
  getOptimizedImageUrl(baseUrl, options = {}) {
    const {
      width = 400,
      height = 300,
      quality = 80,
      format = 'webp'
    } = options;

    // For Unsplash images, add optimization parameters
    if (baseUrl.includes('unsplash.com')) {
      const url = new URL(baseUrl);
      url.searchParams.set('w', width);
      url.searchParams.set('h', height);
      url.searchParams.set('q', quality);
      url.searchParams.set('fm', format);
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('auto', 'format');
      return url.toString();
    }

    return baseUrl;
  }

  /**
   * Get responsive image URLs for different screen sizes
   */
  getResponsiveImages(product) {
    const baseImage = this.getProductImage(product);
    
    return {
      thumbnail: this.getOptimizedImageUrl(baseImage, { width: 150, height: 150 }),
      small: this.getOptimizedImageUrl(baseImage, { width: 300, height: 200 }),
      medium: this.getOptimizedImageUrl(baseImage, { width: 600, height: 400 }),
      large: this.getOptimizedImageUrl(baseImage, { width: 1200, height: 800 })
    };
  }
}

// Create singleton instance
const imageService = new ImageService();

export default imageService;
