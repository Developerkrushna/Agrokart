/**
 * Products Service for Agrokart
 * Manages agricultural product data, categories, and inventory
 */

import productsData from '../data/products.json';
import imageService from './imageService';
import imagePreloader from '../utils/imagePreloader';

class ProductsService {
  constructor() {
    this.products = productsData.products || [];
    this.categories = productsData.categories || [];
    this.brands = productsData.brands || [];
    this.initialized = false;
    this.init();
  }

  init() {
    if (this.initialized) return;
    
    // Process and organize data
    this.processProducts();

    // Preload product images for better performance
    imagePreloader.preloadProductImages(this.products, 'visible');

    this.initialized = true;

    console.log('🌾 ProductsService initialized:', {
      products: this.products.length,
      categories: this.categories.length,
      brands: this.brands.length,
      imageStats: imagePreloader.getStats()
    });
  }

  processProducts() {
    // Add category icons and colors
    this.categoryConfig = {
      'Fertilizers': {
        icon: '🌱',
        color: '#4CAF50',
        description: 'Nutrient-rich fertilizers for healthy crop growth'
      },
      'Seeds': {
        icon: '🌾',
        color: '#FF9800',
        description: 'High-quality seeds for various crops'
      },
      'Pesticides': {
        icon: '🛡️',
        color: '#F44336',
        description: 'Crop protection solutions and pesticides'
      },
      'Farm Implements': {
        icon: '🚜',
        color: '#2196F3',
        description: 'Modern farming tools and equipment'
      },
      'Farm Equipment': {
        icon: '⚙️',
        color: '#FF5722',
        description: 'Advanced agricultural machinery and equipment'
      },
      'Organic': {
        icon: '🍃',
        color: '#8BC34A',
        description: 'Organic and eco-friendly farming products'
      }
    };

    // Process each product
    this.products = this.products.map(product => ({
      ...product,
      // Ensure price is formatted correctly
      price: this.formatPrice(product.price),
      originalPrice: product.original_price ? this.formatPrice(product.original_price) : null,
      // Add category config
      categoryConfig: this.categoryConfig[product.category] || this.categoryConfig['Fertilizers'],
      // Generate product slug for URLs
      slug: this.generateSlug(product.name),
      // Add discount percentage if applicable
      discountPercentage: this.calculateDiscount(product.price, product.original_price),
      // Ensure image URL is valid
      imageUrl: this.validateImageUrl(product.image_url, product),
      // Add search keywords
      searchKeywords: this.generateSearchKeywords(product)
    }));
  }

  formatPrice(price) {
    if (typeof price === 'number') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    if (typeof price === 'string' && price.includes('₹')) {
      return price;
    }
    return `₹${parseFloat(price || 0).toLocaleString('en-IN')}`;
  }

  calculateDiscount(currentPrice, originalPrice) {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    
    const current = parseFloat(currentPrice.toString().replace(/[₹,]/g, ''));
    const original = parseFloat(originalPrice.toString().replace(/[₹,]/g, ''));
    
    return Math.round(((original - current) / original) * 100);
  }

  validateImageUrl(imageUrl, product) {
    // Use imageService to get appropriate image
    if (!imageUrl || imageUrl.includes('example.com') || imageUrl.includes('placeholder')) {
      return imageService.getProductImage(product);
    }
    return imageUrl;
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  generateSearchKeywords(product) {
    const keywords = [
      product.name.toLowerCase(),
      product.category.toLowerCase(),
      product.brand.toLowerCase(),
      ...product.description.toLowerCase().split(' ')
    ];
    return [...new Set(keywords.filter(k => k.length > 2))];
  }

  // Public API methods

  /**
   * Get all products
   */
  getAllProducts() {
    return this.products;
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category) {
    return this.products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get all categories with product counts
   */
  getCategories() {
    const categoryCounts = this.products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(categoryCounts).map(category => ({
      name: category,
      count: categoryCounts[category],
      ...this.categoryConfig[category],
      products: this.getProductsByCategory(category).slice(0, 6) // Preview products
    }));
  }

  /**
   * Get all brands with product counts
   */
  getBrands() {
    const brandCounts = this.products.reduce((acc, product) => {
      if (product.brand) {
        acc[product.brand] = (acc[product.brand] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.keys(brandCounts).map(brand => ({
      name: brand,
      count: brandCounts[brand]
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Search products
   */
  searchProducts(query, filters = {}) {
    let results = this.products;

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(product =>
        product.searchKeywords.some(keyword => keyword.includes(searchTerm))
      );
    }

    // Category filter
    if (filters.category) {
      results = results.filter(product =>
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Brand filter
    if (filters.brand) {
      results = results.filter(product =>
        product.brand.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      results = results.filter(product => {
        const price = parseFloat(product.price.replace(/[₹,]/g, ''));
        const min = filters.minPrice || 0;
        const max = filters.maxPrice || Infinity;
        return price >= min && price <= max;
      });
    }

    // Rating filter
    if (filters.minRating) {
      results = results.filter(product =>
        product.rating >= filters.minRating
      );
    }

    // Availability filter
    if (filters.inStock) {
      results = results.filter(product =>
        product.availability === 'In Stock'
      );
    }

    // Sort results
    if (filters.sortBy) {
      results = this.sortProducts(results, filters.sortBy);
    }

    return results;
  }

  /**
   * Sort products
   */
  sortProducts(products, sortBy) {
    const sortedProducts = [...products];

    switch (sortBy) {
      case 'price-low':
        return sortedProducts.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[₹,]/g, ''));
          const priceB = parseFloat(b.price.replace(/[₹,]/g, ''));
          return priceA - priceB;
        });

      case 'price-high':
        return sortedProducts.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[₹,]/g, ''));
          const priceB = parseFloat(b.price.replace(/[₹,]/g, ''));
          return priceB - priceA;
        });

      case 'rating':
        return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      case 'name':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));

      case 'newest':
        return sortedProducts.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );

      default:
        return sortedProducts;
    }
  }

  /**
   * Get product by ID
   */
  getProductById(id) {
    return this.products.find(product => product.id === parseInt(id));
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit = 10) {
    return this.products
      .filter(product => product.rating >= 4.0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }

  /**
   * Get products on sale
   */
  getSaleProducts(limit = 10) {
    return this.products
      .filter(product => product.discountPercentage > 0)
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, limit);
  }

  /**
   * Get related products
   */
  getRelatedProducts(productId, limit = 6) {
    const product = this.getProductById(productId);
    if (!product) return [];

    return this.products
      .filter(p => 
        p.id !== productId && 
        (p.category === product.category || p.brand === product.brand)
      )
      .slice(0, limit);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const totalProducts = this.products.length;
    const categories = this.getCategories();
    const brands = this.getBrands();
    const avgRating = this.products.reduce((sum, p) => sum + (p.rating || 0), 0) / totalProducts;
    const inStockCount = this.products.filter(p => p.availability === 'In Stock').length;

    return {
      totalProducts,
      totalCategories: categories.length,
      totalBrands: brands.length,
      averageRating: Math.round(avgRating * 10) / 10,
      inStockPercentage: Math.round((inStockCount / totalProducts) * 100),
      categories: categories.map(c => ({ name: c.name, count: c.count })),
      topBrands: brands.slice(0, 5)
    };
  }
}

// Create singleton instance
const productsService = new ProductsService();

export default productsService;
