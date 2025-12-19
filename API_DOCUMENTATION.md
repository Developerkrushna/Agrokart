# AgriNet Product API Documentation

## Overview
This document provides comprehensive information about the AgriNet product APIs for getting category data with images and prices.

## Base URL
- **Web**: `http://localhost:5000/api`
- **Mobile**: `http://192.168.43.196:5000/api` (replace with your IP)

## Authentication
Most endpoints require authentication using the `x-auth-token` header.

---

## 📦 **Product Endpoints**

### 1. Get All Products (with filtering)
```javascript
GET /products?category=urea&page=1&limit=20&sortBy=price&sortOrder=asc&minPrice=100&maxPrice=1000&search=fertilizer
```

**Parameters:**
- `category` (optional): Filter by category (urea, dap, npk, organic, other)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sortBy` (optional): Sort field (name, price, averageRating, createdAt)
- `sortOrder` (optional): Sort direction (asc, desc)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `search` (optional): Search in name, description, brand

**Response:**
```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "Premium Urea",
      "description": "High-quality nitrogen fertilizer",
      "category": "urea",
      "brand": "AgriNet",
      "price": 850,
      "originalPrice": 950,
      "stock": 100,
      "unit": "kg",
      "images": ["image1.jpg", "image2.jpg"],
      "averageRating": 4.5,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Get All Categories
```javascript
GET /products/categories/all
```

**Response:**
```json
[
  {
    "id": "urea",
    "name": "Urea",
    "icon": "🌱",
    "description": "Nitrogen-rich fertilizers",
    "count": 15,
    "avgPrice": 850,
    "priceRange": {
      "min": 500,
      "max": 1200
    }
  }
]
```

### 3. Get Products by Category
```javascript
GET /products/category/urea?page=1&limit=20&sortBy=price&sortOrder=asc
```

**Response:**
```json
{
  "category": "urea",
  "products": [...],
  "pagination": {...}
}
```

### 4. Get Featured Products
```javascript
GET /products/featured/all?limit=10
```

**Response:**
```json
[
  {
    "_id": "product_id",
    "name": "Premium NPK",
    "price": 1200,
    "images": ["image.jpg"],
    "averageRating": 4.8,
    "isFeatured": true
  }
]
```

### 5. Search Products
```javascript
GET /products?search=fertilizer&category=urea&page=1&limit=10
```

### 6. Get Single Product
```javascript
GET /products/:id
```

**Response:**
```json
{
  "_id": "product_id",
  "name": "Premium Urea",
  "description": "Detailed description...",
  "category": "urea",
  "brand": "AgriNet",
  "price": 850,
  "stock": 100,
  "unit": "kg",
  "images": ["image1.jpg", "image2.jpg"],
  "specifications": {
    "npk": {
      "nitrogen": 46,
      "phosphorus": 0,
      "potassium": 0
    },
    "composition": ["46% Nitrogen"],
    "usage": "Apply 2-3 weeks before sowing",
    "precautions": "Store in dry place"
  },
  "recommendedCrops": ["Rice", "Wheat", "Cotton"],
  "averageRating": 4.5,
  "ratings": [
    {
      "rating": 5,
      "review": "Excellent quality!",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 🔧 **Frontend API Usage**

### Import the API functions:
```javascript
import { 
  getProducts, 
  getAllCategories, 
  getProductsByCategory, 
  getFeaturedProducts,
  searchProducts,
  getProduct
} from '../services/api';
```

### Examples:

#### 1. Get All Products
```javascript
const products = await getProducts({
  category: 'urea',
  page: 1,
  limit: 20,
  sortBy: 'price',
  sortOrder: 'asc',
  minPrice: 100,
  maxPrice: 1000,
  search: 'fertilizer'
});
```

#### 2. Get Categories
```javascript
const categories = await getAllCategories();
console.log(categories); // Array of category objects with counts
```

#### 3. Get Products by Category
```javascript
const categoryData = await getProductsByCategory('urea', {
  page: 1,
  limit: 20,
  sortBy: 'price',
  sortOrder: 'asc'
});
console.log(categoryData.products); // Products array
console.log(categoryData.pagination); // Pagination info
```

#### 4. Get Featured Products
```javascript
const featured = await getFeaturedProducts(6);
console.log(featured); // Array of top-rated products
```

#### 5. Search Products
```javascript
const results = await searchProducts('organic fertilizer', {
  category: 'organic',
  page: 1,
  limit: 10
});
```

#### 6. Get Single Product
```javascript
const product = await getProduct('product_id');
console.log(product); // Complete product details
```

---

## 📱 **React Component Example**

```javascript
import React, { useState, useEffect } from 'react';
import { getProducts, getAllCategories } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await getProducts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        limit: 20,
        sortBy: 'name'
      });
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  return (
    <div>
      {/* Category Filter */}
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="all">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name} ({cat.count})
          </option>
        ))}
      </select>

      {/* Products Grid */}
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.images[0]} alt={product.name} />
            <h3>{product.name}</h3>
            <p>₹{product.price}/{product.unit}</p>
            <p>Rating: {product.averageRating}⭐</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🎯 **Key Features**

✅ **Complete Product Data**: Name, description, images, prices, ratings
✅ **Category Management**: Get all categories with product counts
✅ **Advanced Filtering**: By category, price range, search terms
✅ **Sorting Options**: By name, price, rating, date
✅ **Pagination Support**: Handle large product catalogs
✅ **Search Functionality**: Search across name, description, brand
✅ **Featured Products**: Get top-rated/featured items
✅ **Offline Support**: Fallback to mock data when backend unavailable
✅ **Mobile Compatible**: Works on both web and mobile apps

---

## 🔄 **Data Flow**

1. **Categories** → Load all available categories with counts
2. **Products** → Filter by category, search, price range
3. **Sorting** → Sort by price, name, rating, date
4. **Pagination** → Handle large datasets efficiently
5. **Details** → Get complete product information
6. **Images** → Multiple product images support
7. **Ratings** → Average ratings and individual reviews

This API provides everything needed for a complete e-commerce product catalog with images, prices, categories, and advanced filtering capabilities!
