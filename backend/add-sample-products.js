const mongoose = require('mongoose');
const Product = require('./src/models/Product');

// MongoDB connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/krushidoot';

const sampleProducts = [
  {
    name: 'Premium Urea',
    description: 'High-quality nitrogen fertilizer for enhanced crop growth and yield. Suitable for all types of crops.',
    price: 850,
    category: 'urea',
    brand: 'KrushiDoot',
    image: '/images/urea.jpg',
    images: ['/images/urea.jpg'],
    stock: 100,
    unit: 'kg',
    specifications: {
      npk: { nitrogen: 46, phosphorus: 0, potassium: 0 },
      composition: ['46% Nitrogen'],
      usage: 'Apply 2-3 weeks before sowing or as top dressing',
      precautions: 'Store in dry place. Avoid direct contact with skin.'
    },
    recommendedCrops: ['Rice', 'Wheat', 'Sugarcane', 'Cotton']
  },
  {
    name: 'DAP Fertilizer',
    description: 'Diammonium Phosphate fertilizer rich in phosphorus and nitrogen for root development.',
    price: 1200,
    category: 'dap',
    brand: 'KrushiDoot',
    image: '/images/dap.jpg',
    images: ['/images/dap.jpg'],
    stock: 80,
    unit: 'kg',
    specifications: {
      npk: { nitrogen: 18, phosphorus: 46, potassium: 0 },
      composition: ['18% Nitrogen', '46% Phosphorus'],
      usage: 'Apply at the time of sowing or transplanting',
      precautions: 'Keep away from moisture. Use protective gear while handling.'
    },
    recommendedCrops: ['Tomato', 'Potato', 'Onion', 'Maize']
  },
  {
    name: 'NPK 20:20:20',
    description: 'Balanced fertilizer with equal proportions of nitrogen, phosphorus, and potassium.',
    price: 1100,
    category: 'npk',
    brand: 'KrushiDoot',
    image: '/images/npk.jpg',
    images: ['/images/npk.jpg'],
    stock: 120,
    unit: 'kg',
    specifications: {
      npk: { nitrogen: 20, phosphorus: 20, potassium: 20 },
      composition: ['20% Nitrogen', '20% Phosphorus', '20% Potassium'],
      usage: 'Apply during active growth period',
      precautions: 'Store in cool, dry place. Avoid mixing with other chemicals.'
    },
    recommendedCrops: ['Vegetables', 'Fruits', 'Flowers', 'Cereals']
  },
  {
    name: 'Organic Compost',
    description: 'Natural organic fertilizer made from decomposed organic matter. Eco-friendly and sustainable.',
    price: 450,
    category: 'organic',
    brand: 'ShetMitra',
    image: '/images/compost.jpg',
    images: ['/images/compost.jpg'],
    stock: 200,
    unit: 'kg',
    specifications: {
      composition: ['100% Organic Matter', 'Rich in Microorganisms'],
      usage: 'Mix with soil before planting or use as mulch',
      precautions: 'Completely safe for organic farming. No chemical residues.'
    },
    recommendedCrops: ['All Organic Crops', 'Vegetables', 'Fruits', 'Herbs']
  },
  {
    name: 'Potash MOP',
    description: 'Muriate of Potash fertilizer for improved fruit quality and disease resistance.',
    price: 950,
    category: 'other',
    brand: 'ShetMitra',
    image: '/images/potash.jpg',
    images: ['/images/potash.jpg'],
    stock: 90,
    unit: 'kg',
    specifications: {
      npk: { nitrogen: 0, phosphorus: 0, potassium: 60 },
      composition: ['60% Potassium', 'Chloride Source'],
      usage: 'Apply during fruit development stage',
      precautions: 'Avoid over-application. May cause salt buildup in soil.'
    },
    recommendedCrops: ['Banana', 'Grapes', 'Citrus', 'Mango']
  },
  {
    name: 'Zinc Sulphate',
    description: 'Essential micronutrient fertilizer for preventing zinc deficiency in crops.',
    price: 180,
    category: 'other',
    brand: 'ShetMitra',
    image: '/images/zinc.jpg',
    images: ['/images/zinc.jpg'],
    stock: 150,
    unit: 'kg',
    specifications: {
      composition: ['21% Zinc', '11% Sulphur'],
      usage: 'Soil application or foliar spray',
      precautions: 'Use recommended dosage. Excess zinc can be toxic.'
    },
    recommendedCrops: ['Rice', 'Wheat', 'Maize', 'Citrus']
  }
];

async function addSampleProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts > 0) {
      console.log(`📦 Found ${existingProducts} existing products in database`);
      console.log('🔄 Updating existing products with sample data...');
      
      // Clear existing products and add new ones
      await Product.deleteMany({});
      console.log('🗑️ Cleared existing products');
    }

    // Add sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    
    console.log('🎉 Sample products added successfully!');
    console.log(`📊 Total products in database: ${insertedProducts.length}`);
    
    // Display added products
    console.log('\n📋 Added Products:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price} (${product.category})`);
    });
    
    console.log('\n🔍 Search functionality is now ready!');
    console.log('🌐 You can search for products by:');
    console.log('   • Product name (e.g., "urea", "dap", "npk")');
    console.log('   • Category (e.g., "nitrogen", "organic", "micronutrient")');
    console.log('   • Description keywords');
    
  } catch (error) {
    console.error('❌ Error adding sample products:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the script
addSampleProducts();
