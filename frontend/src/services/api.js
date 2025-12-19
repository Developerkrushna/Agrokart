import { mockProducts, mockCategories } from '../data/mockProducts';

// Detect if running on mobile device (Capacitor)
const isMobile = () => {
  return window.Capacitor && window.Capacitor.isNativePlatform();
};

// Get the appropriate API base URL
const getApiBaseUrl = () => {
  if (isMobile()) {
    // Use your computer's IP address for mobile devices
    // Replace with your actual IP address from the network your phone is connected to
    return 'http://192.168.43.196:5000/api'; // Update this IP if needed
  }
  return 'http://localhost:5000/api'; // For web browser
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to check if backend is available
const isBackendAvailable = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      timeout: 3000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }
    
    // Validate user role if specified
    if (credentials.expectedRole) {
      if (result.user && result.user.role !== credentials.expectedRole) {
        throw new Error(`Access denied. This account is registered as ${result.user.role}, not ${credentials.expectedRole}.`);
      }
    }
    
    return result;
  } catch (error) {
    // Mock login for demo purposes
    if (credentials.email === 'demo@shetmitra.com' && credentials.password === 'demo123') {
      return {
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: 'demo-user',
          name: 'Demo Farmer',
          email: 'demo@shetmitra.com',
          phone: '+91 9876543210',
          role: 'customer'
        }
      };
    }
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    // Mock registration for demo purposes
    return {
      success: true,
      message: 'Registration successful',
      user: {
        id: 'new-user',
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      }
    };
  }
};

export const vendorLogin = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Vendor login failed');
    }
    
    // Validate that the user is actually a vendor
    if (result.user && result.user.role !== 'vendor') {
      throw new Error(`Access denied. This account is registered as ${result.user.role}, not vendor. Please use the correct login page for your account type.`);
    }
    
    return result;
  } catch (error) {
    throw new Error(error.message || 'Vendor login failed. Please check your credentials.');
  }
};

export const deliveryLogin = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delivery/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Delivery partner login failed');
    }
    
    // Validate that the user is actually a delivery partner
    if (result.user && result.user.role !== 'delivery_partner') {
      throw new Error(`Access denied. This account is registered as ${result.user.role}, not delivery partner. Please use the correct login page for your account type.`);
    }
    
    return result;
  } catch (error) {
    throw new Error(error.message || 'Delivery partner login failed. Please check your credentials.');
  }
};

export const getProducts = async (params = {}) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    if (params.category) queryParams.append('category', params.category);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;

    // Try to check backend availability with a shorter timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const healthResponse = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (healthResponse.ok) {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('Products loaded from backend:', data.products?.length || data.length);
        return data.products || data; // Handle both paginated and simple responses
      }
    }
  } catch (error) {
    console.log('Backend not available, using mock data:', error.message);
  }

  // Filter mock data based on parameters
  let filteredProducts = [...mockProducts];

  if (params.category && params.category !== 'all') {
    filteredProducts = filteredProducts.filter(p =>
      p.category.toLowerCase().includes(params.category.toLowerCase())
    );
  }

  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm)
    );
  }

  if (params.minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice);
  }

  if (params.maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice);
  }

  // Sort products
  if (params.sortBy) {
    filteredProducts.sort((a, b) => {
      const aVal = a[params.sortBy];
      const bVal = b[params.sortBy];
      const order = params.sortOrder === 'desc' ? -1 : 1;

      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * order;
      }
      return (aVal - bVal) * order;
    });
  }

  console.log('Using filtered mock products data:', filteredProducts.length);
  return filteredProducts;
};

export const getProduct = async (id) => {
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      return response.json();
    }
  } catch (error) {
    console.log('Backend not available, using mock data');
  }

  // Return mock data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p._id === id);
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Product not found'));
      }
    }, 300);
  });
};

export const getCategories = async () => {
  try {
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      const response = await fetch(`${API_BASE_URL}/categories`);
      return response.json();
    }
  } catch (error) {
    console.log('Backend not available, using mock data');
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCategories);
    }, 300);
  });
};

export const getUserProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: {
      'x-auth-token': token,
    },
  });
  return response.json();
};

export const getUserOrders = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: {
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  } catch (error) {
    // Mock orders data for demo purposes
    console.log('Using mock orders data');
    return [
      {
        _id: 'ORD89454E',
        orderStatus: 'pending',
        totalAmount: 850,
        createdAt: new Date().toISOString(),
        items: [
          {
            product: {
              name: 'Premium Urea',
              images: ['/api/placeholder/60/60']
            },
            quantity: 1,
            price: 850
          }
        ]
      },
      {
        _id: 'ORD89455F',
        orderStatus: 'delivered',
        totalAmount: 1200,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            product: {
              name: 'DAP Fertilizer',
              images: ['/api/placeholder/60/60']
            },
            quantity: 1,
            price: 1200
          }
        ]
      },
      {
        _id: 'ORD89456G',
        orderStatus: 'out_for_delivery',
        totalAmount: 2500,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            product: {
              name: 'NPK 20:20:20',
              images: ['/api/placeholder/60/60']
            },
            quantity: 2,
            price: 1100
          },
          {
            product: {
              name: 'Organic Compost',
              images: ['/api/placeholder/60/60']
            },
            quantity: 1,
            price: 450
          }
        ]
      }
    ];
  }
};

export const getOrderById = async (orderId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order details');
    }

    return response.json();
  } catch (error) {
    // Mock order data for demo purposes
    console.log('Using mock order data for order:', orderId);
    return {
      data: {
        _id: orderId,
        orderStatus: 'shipped',
        status: 'shipped', // Keep both for compatibility
        totalAmount: 2500,
        deliveryFee: 50,
        paymentMethod: 'Cash on Delivery',
        createdAt: new Date().toISOString(),
        items: [
          {
            product: {
              name: 'Premium Urea',
              images: ['/api/placeholder/60/60'],
              unit: 'kg'
            },
            quantity: 2,
            price: 850
          },
          {
            product: {
              name: 'DAP Fertilizer',
              images: ['/api/placeholder/60/60'],
              unit: 'kg'
            },
            quantity: 1,
            price: 1200
          }
        ],
        deliveryAddress: {
          street: '123 Farm Road, Village Name',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001'
        }
      }
    };
  }
};

export const createOrder = async (orderData, token) => {
  console.log('API: Creating order with data:', orderData);
  console.log('API: Using token:', token ? 'Present' : 'Missing');

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(orderData),
  });

  console.log('API: Response status:', response.status);
  console.log('API: Response ok:', response.ok);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API: Error response:', errorData);
    throw new Error(errorData.message || 'Failed to create order');
  }

  const result = await response.json();
  console.log('API: Success response:', result);
  return result;
};

export const deleteOrder = async (orderId, token) => {
  console.log('API: Deleting order with ID:', orderId);
  console.log('API: Using token:', token ? 'Present' : 'Missing');

  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': token,
    },
  });

  console.log('API: Delete response status:', response.status);
  console.log('API: Delete response ok:', response.ok);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API: Delete error response:', errorData);
    throw new Error(errorData.message || 'Failed to delete order');
  }

  const result = await response.json();
  console.log('API: Delete success response:', result);
  return result;
};

// Cancel order
export const cancelOrder = async (orderId, token) => {
  try {
    console.log('API: Canceling order:', orderId);
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API: Cancel order error response:', errorData);
      throw new Error(errorData.message || 'Failed to cancel order');
    }

    const result = await response.json();
    console.log('API: Cancel order success response:', result);
    return result;
  } catch (error) {
    console.error('API: Cancel order error:', error);

    // Fallback for offline mode - simulate successful cancellation
    console.log('API: Using offline cancel order fallback');
    return {
      success: true,
      message: 'Order cancelled successfully (offline mode)',
      order: {
        _id: orderId,
        orderStatus: 'cancelled'
      }
    };
  }
};

// Get all categories with product counts
export const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories/all`);
    if (response.ok) {
      const data = await response.json();
      console.log('Categories loaded from backend:', data.length);
      return data;
    }
  } catch (error) {
    console.log('Backend not available, using mock categories:', error.message);
  }

  // Return mock categories
  return [
    { id: 'urea', name: 'Urea', icon: '🌱', description: 'Nitrogen-rich fertilizers', count: 15 },
    { id: 'dap', name: 'DAP', icon: '🌾', description: 'Phosphorus fertilizers', count: 12 },
    { id: 'npk', name: 'NPK', icon: '🌿', description: 'Balanced nutrition', count: 18 },
    { id: 'organic', name: 'Organic', icon: '🍃', description: 'Natural fertilizers', count: 10 },
    { id: 'other', name: 'Other', icon: '🔧', description: 'Specialized products', count: 8 }
  ];
};

// Get products by category
export const getProductsByCategory = async (category, params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/products/category/${category}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(`Products for category ${category} loaded from backend:`, data.products.length);
      return data;
    }
  } catch (error) {
    console.log('Backend not available, using mock data:', error.message);
  }

  // Filter mock data by category
  const filteredProducts = mockProducts.filter(p =>
    p.category.toLowerCase().includes(category.toLowerCase())
  );

  return {
    category,
    products: filteredProducts,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalProducts: filteredProducts.length,
      hasNext: false,
      hasPrev: false
    }
  };
};

// Get featured products
export const getFeaturedProducts = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/featured/all?limit=${limit}`);
    if (response.ok) {
      const data = await response.json();
      console.log('Featured products loaded from backend:', data.length);
      return data;
    }
  } catch (error) {
    console.log('Backend not available, using mock featured products:', error.message);
  }

  // Return mock featured products (high-rated ones)
  return mockProducts
    .filter(p => p.averageRating >= 4.0)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, limit);
};

// Search products
export const searchProducts = async (query, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('search', query);

    if (params.category) queryParams.append('category', params.category);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `${API_BASE_URL}/products?${queryParams.toString()}`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log('Search results from backend:', data.products?.length || data.length);
      return data.products || data;
    }
  } catch (error) {
    console.log('Backend not available, using mock search:', error.message);
  }

  // Mock search in products
  const searchTerm = query.toLowerCase();
  return mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm) ||
    p.brand.toLowerCase().includes(searchTerm)
  );
};

// Vendor API functions
export const vendorRegister = async (data) => {
  const response = await fetch(`${API_BASE_URL}/vendor/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Vendor registration failed');
  }

  return response.json();
};

export const vendorUploadDocuments = async (formData, firebaseToken) => {
  const response = await fetch(`${API_BASE_URL}/vendor/upload-documents`, {
    method: 'POST',
    headers: {
      'firebase-auth-token': firebaseToken,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Document upload failed');
  }

  return response.json();
};

export const getVendorDashboard = async (firebaseToken) => {
  const response = await fetch(`${API_BASE_URL}/vendor/dashboard`, {
    headers: {
      'firebase-auth-token': firebaseToken,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch vendor dashboard');
  }

  return response.json();
};

export const getVendorInventory = async (params, token) => {
  const queryParams = new URLSearchParams(params);
  const response = await fetch(`${API_BASE_URL}/vendor/inventory?${queryParams}`, {
    headers: {
      'x-auth-token': token,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch inventory');
  }

  return response.json();
};

export const addToVendorInventory = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/vendor/inventory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add to inventory');
  }

  return response.json();
};

export const updateVendorInventory = async (id, data, token) => {
  const response = await fetch(`${API_BASE_URL}/vendor/inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update inventory');
  }

  return response.json();
};

export const getVendorOrders = async (params, token) => {
  const queryParams = new URLSearchParams(params);
  const response = await fetch(`${API_BASE_URL}/vendor/orders?${queryParams}`, {
    headers: {
      'x-auth-token': token,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch vendor orders');
  }

  return response.json();
};

export const respondToVendorOrder = async (orderId, data, token) => {
  const response = await fetch(`${API_BASE_URL}/vendor/orders/${orderId}/respond`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to respond to order');
  }

  return response.json();
};

// Delivery API functions
export const deliveryRegister = async (data) => {
  const response = await fetch(`${API_BASE_URL}/delivery/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Delivery partner registration failed');
  }

  return response.json();
};

export const deliveryUploadDocuments = async (formData, firebaseToken) => {
  const response = await fetch(`${API_BASE_URL}/delivery/upload-documents`, {
    method: 'POST',
    headers: {
      'firebase-auth-token': firebaseToken,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Document upload failed');
  }

  return response.json();
};

export const getDeliveryDashboard = async (firebaseToken) => {
  const response = await fetch(`${API_BASE_URL}/delivery/dashboard`, {
    headers: {
      'firebase-auth-token': firebaseToken,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch delivery dashboard');
  }

  return response.json();
};

export const getAvailableAssignments = async (token) => {
  const response = await fetch(`${API_BASE_URL}/delivery/assignments/available`, {
    headers: {
      'x-auth-token': token,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch available assignments');
  }

  return response.json();
};

export const acceptAssignment = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/delivery/assignments/${id}/accept`, {
    method: 'POST',
    headers: {
      'x-auth-token': token,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to accept assignment');
  }

  return response.json();
};

export const updateDeliveryStatus = async (id, data, token) => {
  const response = await fetch(`${API_BASE_URL}/delivery/assignments/${id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update delivery status');
  }

  return response.json();
};

export const updateDeliveryAvailability = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/delivery/availability`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update availability');
  }

  return response.json();
};

// Default export object with all API functions
const api = {
  // Auth
  login,
  register,
  vendorLogin,
  deliveryLogin,

  // Products
  getProducts,
  getAllCategories,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  getProduct,

  // Orders
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  deleteOrder,

  // Users
  getUserProfile,

  // Vendor
  vendorRegister,
  vendorUploadDocuments,
  getVendorDashboard,
  getVendorInventory,
  addToVendorInventory,
  updateVendorInventory,
  getVendorOrders,
  respondToVendorOrder,

  // Delivery
  deliveryRegister,
  deliveryUploadDocuments,
  getDeliveryDashboard,
  getAvailableAssignments,
  acceptAssignment,
  updateDeliveryStatus,
  updateDeliveryAvailability
};

export default api;