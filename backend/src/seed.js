const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'NPK Fertilizer',
    description: 'Balanced nutrition for all crops with optimal NPK ratio',
    category: 'npk',
    brand: 'AgroTech',
    price: 1200,
    stock: 100,
    unit: 'kg',
    images: ['https://example.com/npk.jpg'],
    image: 'https://example.com/npk.jpg',
    specifications: {
      npk: {
        nitrogen: 20,
        phosphorus: 20,
        potassium: 20
      },
      composition: ['Nitrogen 20%', 'Phosphorus 20%', 'Potassium 20%'],
      usage: 'Apply 50-100 kg per acre',
      precautions: 'Store in dry place, keep away from children'
    },
    recommendedCrops: ['Wheat', 'Rice', 'Corn'],
    rating: 4.5,
    numReviews: 12
  },
  {
    name: 'Organic Manure',
    description: '100% natural organic manure for sustainable farming',
    category: 'organic',
    brand: 'OrganicPlus',
    price: 800,
    stock: 50,
    unit: 'kg',
    images: ['https://example.com/manure.jpg'],
    image: 'https://example.com/manure.jpg',
    specifications: {
      composition: ['Organic matter 60%', 'Nitrogen 2%', 'Phosphorus 1%'],
      usage: 'Apply 200-300 kg per acre',
      precautions: 'Use within 6 months of purchase'
    },
    recommendedCrops: ['Vegetables', 'Fruits', 'Herbs'],
    rating: 4.0,
    numReviews: 8
  },
  {
    name: 'Urea Fertilizer',
    description: 'High nitrogen content for leafy growth',
    category: 'urea',
    brand: 'FertiMax',
    price: 600,
    stock: 75,
    unit: 'kg',
    images: ['https://example.com/urea.jpg'],
    image: 'https://example.com/urea.jpg',
    specifications: {
      npk: {
        nitrogen: 46,
        phosphorus: 0,
        potassium: 0
      },
      composition: ['Nitrogen 46%'],
      usage: 'Apply 25-50 kg per acre',
      precautions: 'Apply in split doses, avoid direct contact'
    },
    recommendedCrops: ['Wheat', 'Rice', 'Sugarcane'],
    rating: 4.2,
    numReviews: 10
  }
];

// Local MongoDB connection string
const MONGODB_URI = 'mongodb://127.0.0.1:27017/krushidoot';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  try {
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: hashedPassword,
      role: 'user',
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        coordinates: {
          type: 'Point',
          coordinates: [77.2090, 28.6139] // Delhi coordinates
        }
      },
      landDetails: {
        totalArea: 10,
        crops: [
          { name: 'Wheat', area: 5 },
          { name: 'Rice', area: 5 }
        ]
      },
      isVerified: true
    });
    
    await testUser.save();
    console.log('Test user created successfully:', testUser.email, testUser._id);
    
    // Add products
    await Product.insertMany(products);
    console.log('Sample products added successfully');
    
    console.log('Database seeded successfully!');
    console.log('Test user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 