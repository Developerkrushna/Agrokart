/**
 * Image Preloader Utility for Agrokart
 * Preloads critical agricultural product images for smooth user experience
 */

class ImagePreloader {
  constructor() {
    this.cache = new Map();
    this.loading = new Set();
    this.failed = new Set();
  }

  /**
   * Preload a single image
   */
  preloadImage(url) {
    return new Promise((resolve, reject) => {
      // Check if already cached
      if (this.cache.has(url)) {
        resolve(url);
        return;
      }

      // Check if already loading
      if (this.loading.has(url)) {
        // Wait for existing load to complete
        const checkLoading = () => {
          if (!this.loading.has(url)) {
            if (this.cache.has(url)) {
              resolve(url);
            } else {
              reject(new Error('Image failed to load'));
            }
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
        return;
      }

      // Check if previously failed
      if (this.failed.has(url)) {
        reject(new Error('Image previously failed to load'));
        return;
      }

      // Start loading
      this.loading.add(url);
      
      const img = new Image();
      
      img.onload = () => {
        this.loading.delete(url);
        this.cache.set(url, img);
        resolve(url);
      };
      
      img.onerror = () => {
        this.loading.delete(url);
        this.failed.add(url);
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.src = url;
    });
  }

  /**
   * Preload multiple images
   */
  preloadImages(urls) {
    const promises = urls.map(url => 
      this.preloadImage(url).catch(error => {
        console.warn('Image preload failed:', error.message);
        return null;
      })
    );
    
    return Promise.allSettled(promises);
  }

  /**
   * Preload product images
   */
  preloadProductImages(products, priority = 'visible') {
    const imageUrls = products
      .map(product => product.imageUrl || product.image_url)
      .filter(url => url && !url.includes('placeholder'));

    if (priority === 'visible') {
      // Preload first 10 images immediately
      const visibleUrls = imageUrls.slice(0, 10);
      const backgroundUrls = imageUrls.slice(10);
      
      // Load visible images first
      this.preloadImages(visibleUrls).then(() => {
        // Then load background images with delay
        setTimeout(() => {
          this.preloadImages(backgroundUrls);
        }, 1000);
      });
    } else {
      // Load all images
      return this.preloadImages(imageUrls);
    }
  }

  /**
   * Check if image is cached
   */
  isCached(url) {
    return this.cache.has(url);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      cached: this.cache.size,
      loading: this.loading.size,
      failed: this.failed.size
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    this.failed.clear();
  }

  /**
   * Remove failed URLs to retry
   */
  retryFailed() {
    this.failed.clear();
  }
}

// Create singleton instance
const imagePreloader = new ImagePreloader();

export default imagePreloader;
