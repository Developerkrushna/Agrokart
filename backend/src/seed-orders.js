const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');

// Local MongoDB connection string
const MONGODB_URI = 'mongodb://127.0.0.1:27017/krushidoot';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  try {
    console.log('Connected to MongoDB');
    
    // Find test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('Test user not found. Please run the main seed file first.');
      process.exit(1);
    }
    
    // Find products
    const products = await Product.find({});
    if (products.length === 0) {
      console.log('No products found. Please run the main seed file first.');
      process.exit(1);
    }
    
    // Clear existing orders
    await Order.deleteMany({});
    console.log('Cleared existing orders');
    
    // Create sample orders
    const sampleOrders = [
      {
        user: testUser._id,
        items: [
          {
            product: products[0]._id, // NPK Fertilizer
            quantity: 2,
            price: products[0].price
          },
          {
            product: products[1]._id, // Organic Manure
            quantity: 1,
            price: products[1].price
          }
        ],
        totalAmount: (products[0].price * 2) + products[1].price,
        deliveryAddress: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          coordinates: {
            type: 'Point',
            coordinates: [77.2090, 28.6139]
          }
        },
        deliverySlot: {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          timeSlot: 'morning'
        },
        paymentMethod: 'cod',
        paymentStatus: 'completed',
        orderStatus: 'delivered',
        trackingNumber: 'ORD123456',
        actualDeliveryTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        notes: 'Delivered successfully'
      },
      {
        user: testUser._id,
        items: [
          {
            product: products[2]._id, // Urea Fertilizer
            quantity: 3,
            price: products[2].price
          }
        ],
        totalAmount: products[2].price * 3,
        deliveryAddress: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          coordinates: {
            type: 'Point',
            coordinates: [77.2090, 28.6139]
          }
        },
        deliverySlot: {
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
          timeSlot: 'afternoon'
        },
        paymentMethod: 'upi',
        paymentStatus: 'completed',
        orderStatus: 'out_for_delivery',
        trackingNumber: 'ORD789012',
        estimatedDeliveryTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        notes: 'Out for delivery'
      },
      {
        user: testUser._id,
        items: [
          {
            product: products[0]._id, // NPK Fertilizer
            quantity: 1,
            price: products[0].price
          },
          {
            product: products[1]._id, // Organic Manure
            quantity: 2,
            price: products[1].price
          }
        ],
        totalAmount: products[0].price + (products[1].price * 2),
        deliveryAddress: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          coordinates: {
            type: 'Point',
            coordinates: [77.2090, 28.6139]
          }
        },
        deliverySlot: {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          timeSlot: 'evening'
        },
        paymentMethod: 'card',
        paymentStatus: 'pending',
        orderStatus: 'processing',
        trackingNumber: 'ORD345678',
        estimatedDeliveryTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        notes: 'Processing order'
      }
    ];
    
    // Save orders
    for (const orderData of sampleOrders) {
      const order = new Order(orderData);
      await order.save();
    }
    
    console.log('Sample orders created successfully!');
    console.log('Created orders:');
    sampleOrders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.trackingNumber} - ${order.orderStatus} - ₹${order.totalAmount}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 