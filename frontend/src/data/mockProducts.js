// Mock product data for KrushiDoot fertilizer delivery app
export const mockProducts = [
  // ELECTRONICS CATEGORY
  {
    _id: 'elec1',
    name: 'Smart Irrigation Controller',
    description: 'WiFi-enabled irrigation system controller with smartphone app control and weather monitoring.',
    category: 'Electronics',
    brand: 'AgroTech',
    price: 8500,
    originalPrice: 9500,
    stock: 25,
    unit: 'piece',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop'
    ],
    averageRating: 4.6,
    ratings: [
      { rating: 5, review: 'Excellent automation for my farm!' },
      { rating: 4, review: 'Easy to install and use' }
    ],
    specifications: {
      features: ['WiFi Connectivity', 'Weather Monitoring', 'Mobile App Control'],
      powerSupply: '12V DC',
      coverage: 'Up to 10 zones',
      warranty: '2 years'
    },
    recommendedCrops: ['All Crops'],
    features: ['Smart Control', 'Water Saving', 'Remote Access'],
    discount: 11,
    isPopular: true,
    isFeatured: false
  },
  {
    _id: 'elec2',
    name: 'Soil pH Meter Digital',
    description: 'Digital soil pH and moisture meter for accurate soil testing and monitoring.',
    category: 'Electronics',
    brand: 'FarmSense',
    price: 2500,
    originalPrice: 3000,
    stock: 50,
    unit: 'piece',
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop'
    ],
    averageRating: 4.4,
    ratings: [
      { rating: 5, review: 'Very accurate readings!' },
      { rating: 4, review: 'Essential tool for farming' }
    ],
    specifications: {
      features: ['Digital Display', 'pH Range 3-8', 'Moisture Detection'],
      accuracy: '±0.1 pH',
      battery: 'AAA x 2',
      warranty: '1 year'
    },
    recommendedCrops: ['All Crops'],
    features: ['Accurate Testing', 'Easy Reading', 'Portable'],
    discount: 17,
    isPopular: false,
    isFeatured: true
  },
  {
    _id: 'elec3',
    name: 'Solar Water Pump',
    description: 'Efficient solar-powered water pump for irrigation with built-in battery backup.',
    category: 'Electronics',
    brand: 'SolarAgri',
    price: 15000,
    originalPrice: 18000,
    stock: 15,
    unit: 'piece',
    images: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop'
    ],
    averageRating: 4.8,
    ratings: [
      { rating: 5, review: 'Amazing solar efficiency!' },
      { rating: 5, review: 'No electricity bills anymore!' }
    ],
    specifications: {
      features: ['Solar Powered', 'Battery Backup', 'Weather Resistant'],
      power: '500W Solar Panel',
      flow: '2000 L/hour',
      warranty: '3 years'
    },
    recommendedCrops: ['All Crops'],
    features: ['Eco Friendly', 'Cost Effective', 'Reliable'],
    discount: 17,
    isPopular: true,
    isFeatured: true
  },

  // FERTILIZERS CATEGORY
  {
    _id: '1',
    name: 'Premium Urea',
    description: 'High-quality nitrogen fertilizer for enhanced crop growth. Promotes healthy green foliage and increases yield significantly.',
    category: 'Nitrogen Fertilizers',
    brand: 'KrushiDoot Premium',
    price: 850,
    originalPrice: 950,
    stock: 150,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'
    ],
    averageRating: 4.5,
    ratings: [
      { rating: 5, review: 'Excellent quality, great results!' },
      { rating: 4, review: 'Good product, fast delivery' }
    ],
    specifications: {
      npk: { nitrogen: 46, phosphorus: 0, potassium: 0 },
      composition: ['Nitrogen 46%', 'Moisture max 0.5%'],
      usage: 'Apply 2-3 bags per acre during sowing',
      precautions: 'Store in dry place, avoid direct sunlight'
    },
    recommendedCrops: ['Wheat', 'Rice', 'Cotton', 'Sugarcane'],
    features: ['Fast Acting', 'High Purity', 'Weather Resistant'],
    discount: 11,
    isPopular: true,
    isFeatured: true
  },
  {
    _id: '2',
    name: 'DAP Fertilizer',
    description: 'Di-ammonium phosphate for strong root development and early plant growth. Perfect for all types of crops.',
    category: 'Phosphorus Fertilizers',
    brand: 'KrushiDoot Premium',
    price: 1200,
    originalPrice: 1350,
    stock: 200,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
    ],
    averageRating: 4.7,
    ratings: [
      { rating: 5, review: 'Amazing results on my cotton crop!' },
      { rating: 5, review: 'Best DAP in the market' },
      { rating: 4, review: 'Good quality, reasonable price' }
    ],
    specifications: {
      npk: { nitrogen: 18, phosphorus: 46, potassium: 0 },
      composition: ['Nitrogen 18%', 'Phosphorus 46%', 'Sulphur 2%'],
      usage: 'Apply 1-2 bags per acre as basal dose',
      precautions: 'Mix well with soil, avoid contact with seeds'
    },
    recommendedCrops: ['Cotton', 'Soybean', 'Maize', 'Vegetables'],
    features: ['Root Development', 'Early Growth', 'High Phosphorus'],
    discount: 11,
    isPopular: true
  },
  {
    _id: '3',
    name: 'NPK 20:20:20',
    description: 'Balanced nutrition fertilizer with equal proportions of nitrogen, phosphorus, and potassium for overall plant health.',
    category: 'Complex Fertilizers',
    brand: 'ShetMitra Premium',
    price: 1100,
    originalPrice: 1200,
    stock: 180,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop'
    ],
    averageRating: 4.6,
    ratings: [
      { rating: 5, review: 'Perfect balanced nutrition' },
      { rating: 4, review: 'Great for vegetable farming' }
    ],
    specifications: {
      npk: { nitrogen: 20, phosphorus: 20, potassium: 20 },
      composition: ['Nitrogen 20%', 'Phosphorus 20%', 'Potassium 20%'],
      usage: 'Apply 2-3 bags per acre in 2-3 splits',
      precautions: 'Apply with adequate moisture'
    },
    recommendedCrops: ['Vegetables', 'Fruits', 'Flowers', 'Cereals'],
    features: ['Balanced Nutrition', 'All Crops', 'Water Soluble'],
    discount: 8,
    isFeatured: true
  },
  {
    _id: '4',
    name: 'Organic Compost',
    description: 'Premium organic compost made from farm waste. Improves soil health and provides natural nutrition to plants.',
    category: 'Organic Fertilizers',
    brand: 'ShetMitra Organic',
    price: 450,
    originalPrice: 500,
    stock: 300,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=300&fit=crop'
    ],
    averageRating: 4.8,
    ratings: [
      { rating: 5, review: 'Best organic fertilizer!' },
      { rating: 5, review: 'Excellent soil improvement' },
      { rating: 5, review: 'Natural and effective' }
    ],
    specifications: {
      npk: { nitrogen: 2, phosphorus: 1, potassium: 1 },
      composition: ['Organic Matter 85%', 'Nitrogen 2%', 'Phosphorus 1%', 'Potassium 1%'],
      usage: 'Apply 5-10 bags per acre before sowing',
      precautions: 'Store in cool, dry place'
    },
    recommendedCrops: ['All Crops', 'Vegetables', 'Fruits', 'Cereals'],
    features: ['100% Organic', 'Soil Health', 'Eco-Friendly'],
    discount: 10,
    isPopular: true,
    isOrganic: true
  },
  {
    _id: '5',
    name: 'Potash (MOP)',
    description: 'Muriate of Potash for improved fruit quality, disease resistance, and water use efficiency in crops.',
    category: 'Potassium Fertilizers',
    brand: 'ShetMitra Premium',
    price: 950,
    originalPrice: 1050,
    stock: 120,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop'
    ],
    averageRating: 4.4,
    ratings: [
      { rating: 4, review: 'Good for fruit crops' },
      { rating: 5, review: 'Improved fruit quality' }
    ],
    specifications: {
      npk: { nitrogen: 0, phosphorus: 0, potassium: 60 },
      composition: ['Potassium 60%', 'Chloride 47%'],
      usage: 'Apply 1-2 bags per acre during flowering',
      precautions: 'Avoid over-application'
    },
    recommendedCrops: ['Fruits', 'Vegetables', 'Sugarcane', 'Potato'],
    features: ['High Potassium', 'Fruit Quality', 'Disease Resistance'],
    discount: 10
  },
  {
    _id: '6',
    name: 'Zinc Sulphate',
    description: 'Essential micronutrient fertilizer for preventing zinc deficiency and improving crop yield and quality.',
    category: 'Micronutrients',
    brand: 'ShetMitra Micro',
    price: 180,
    originalPrice: 200,
    stock: 250,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'
    ],
    averageRating: 4.3,
    ratings: [
      { rating: 4, review: 'Good micronutrient supplement' },
      { rating: 4, review: 'Effective for zinc deficiency' }
    ],
    specifications: {
      npk: { nitrogen: 0, phosphorus: 0, potassium: 0 },
      composition: ['Zinc 21%', 'Sulphur 10%'],
      usage: 'Apply 25-50 kg per acre',
      precautions: 'Do not exceed recommended dose'
    },
    recommendedCrops: ['Rice', 'Wheat', 'Maize', 'Cotton'],
    features: ['Micronutrient', 'Zinc Deficiency', 'Yield Booster'],
    discount: 10
  },

  // SEEDS CATEGORY
  {
    _id: 'seed1',
    name: 'Hybrid Wheat Seeds',
    description: 'High-yielding hybrid wheat seeds with disease resistance and excellent grain quality.',
    category: 'Seeds',
    brand: 'KrushiDoot Seeds',
    price: 1200,
    originalPrice: 1400,
    stock: 100,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'
    ],
    averageRating: 4.5,
    ratings: [
      { rating: 5, review: 'Excellent germination rate!' },
      { rating: 4, review: 'Good quality seeds' }
    ],
    specifications: {
      variety: 'HD-3086',
      germination: '95%',
      maturity: '120-125 days',
      yield: '45-50 quintals/hectare'
    },
    recommendedCrops: ['Wheat'],
    features: ['High Yield', 'Disease Resistant', 'Premium Quality'],
    discount: 14,
    isPopular: true,
    isFeatured: true
  },
  {
    _id: 'seed2',
    name: 'Basmati Rice Seeds',
    description: 'Premium basmati rice seeds with aromatic grains and excellent cooking quality.',
    category: 'Seeds',
    brand: 'KrushiDoot Seeds',
    price: 2500,
    originalPrice: 3000,
    stock: 75,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'
    ],
    averageRating: 4.7,
    ratings: [
      { rating: 5, review: 'Best basmati variety!' },
      { rating: 5, review: 'Excellent aroma and taste' }
    ],
    specifications: {
      variety: 'Pusa Basmati-1121',
      germination: '90%',
      maturity: '140-145 days',
      yield: '40-45 quintals/hectare'
    },
    recommendedCrops: ['Rice'],
    features: ['Aromatic', 'Long Grain', 'Premium Quality'],
    discount: 17,
    isPopular: true,
    isFeatured: false
  },
  {
    _id: 'seed3',
    name: 'Hybrid Tomato Seeds',
    description: 'High-yielding hybrid tomato seeds suitable for both greenhouse and open field cultivation.',
    category: 'Seeds',
    brand: 'VeggiePro',
    price: 850,
    originalPrice: 1000,
    stock: 120,
    unit: 'packet',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'
    ],
    averageRating: 4.4,
    ratings: [
      { rating: 5, review: 'Great yield and quality!' },
      { rating: 4, review: 'Good disease resistance' }
    ],
    specifications: {
      variety: 'Arka Rakshak',
      germination: '85%',
      maturity: '70-75 days',
      yield: '80-90 tons/hectare'
    },
    recommendedCrops: ['Tomato'],
    features: ['High Yield', 'Disease Resistant', 'Uniform Size'],
    discount: 15,
    isPopular: false,
    isFeatured: true
  },

  // PESTICIDES CATEGORY
  {
    _id: 'pest1',
    name: 'Organic Neem Oil',
    description: 'Natural neem oil pesticide for effective pest control without harmful chemicals.',
    category: 'Pesticides',
    brand: 'BioShield',
    price: 450,
    originalPrice: 550,
    stock: 200,
    unit: 'liter',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
    ],
    averageRating: 4.6,
    ratings: [
      { rating: 5, review: 'Excellent organic solution!' },
      { rating: 4, review: 'Safe and effective' }
    ],
    specifications: {
      activeIngredient: 'Azadirachtin 1500 ppm',
      application: 'Foliar spray',
      dosage: '3-5 ml per liter',
      safetyPeriod: '3 days'
    },
    recommendedCrops: ['All Crops'],
    features: ['Organic', 'Safe', 'Broad Spectrum'],
    discount: 18,
    isPopular: true,
    isFeatured: true
  },
  {
    _id: 'pest2',
    name: 'Fungicide Spray',
    description: 'Broad-spectrum fungicide for prevention and control of fungal diseases in crops.',
    category: 'Pesticides',
    brand: 'CropGuard',
    price: 650,
    originalPrice: 750,
    stock: 150,
    unit: 'liter',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
    ],
    averageRating: 4.3,
    ratings: [
      { rating: 5, review: 'Very effective against fungus!' },
      { rating: 4, review: 'Good preventive action' }
    ],
    specifications: {
      activeIngredient: 'Mancozeb 75% WP',
      application: 'Foliar spray',
      dosage: '2-3 gm per liter',
      safetyPeriod: '7 days'
    },
    recommendedCrops: ['Vegetables', 'Fruits', 'Cereals'],
    features: ['Broad Spectrum', 'Preventive', 'Curative'],
    discount: 13,
    isPopular: false,
    isFeatured: false
  },

  // TOOLS CATEGORY
  {
    _id: 'tool1',
    name: 'Garden Hand Tiller',
    description: 'Lightweight hand tiller for soil cultivation and weed removal in small gardens.',
    category: 'Tools',
    brand: 'FarmTools Pro',
    price: 850,
    originalPrice: 1000,
    stock: 80,
    unit: 'piece',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
    ],
    averageRating: 4.2,
    ratings: [
      { rating: 4, review: 'Good quality tool!' },
      { rating: 4, review: 'Easy to use and durable' }
    ],
    specifications: {
      material: 'High Carbon Steel',
      weight: '1.2 kg',
      length: '35 cm',
      warranty: '1 year'
    },
    recommendedCrops: ['All Garden Crops'],
    features: ['Lightweight', 'Durable', 'Ergonomic Handle'],
    discount: 15,
    isPopular: true,
    isFeatured: false
  },
  {
    _id: 'tool2',
    name: 'Pruning Shears',
    description: 'Professional pruning shears for trimming branches and maintaining fruit trees.',
    category: 'Tools',
    brand: 'GardenMaster',
    price: 1200,
    originalPrice: 1400,
    stock: 60,
    unit: 'piece',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
    ],
    averageRating: 4.7,
    ratings: [
      { rating: 5, review: 'Excellent cutting performance!' },
      { rating: 5, review: 'Very sharp and precise' }
    ],
    specifications: {
      material: 'Stainless Steel Blades',
      cutting: 'Up to 25mm diameter',
      weight: '250g',
      warranty: '2 years'
    },
    recommendedCrops: ['Fruit Trees', 'Ornamental Plants'],
    features: ['Sharp Blades', 'Comfortable Grip', 'Rust Resistant'],
    discount: 14,
    isPopular: true,
    isFeatured: true
  },

  // SOIL CATEGORY
  {
    _id: 'soil1',
    name: 'Premium Potting Mix',
    description: 'Nutrient-rich potting mix perfect for container gardening and seedling growth.',
    category: 'Soil',
    brand: 'SoilCraft',
    price: 350,
    originalPrice: 400,
    stock: 250,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
    ],
    averageRating: 4.5,
    ratings: [
      { rating: 5, review: 'Plants love this soil!' },
      { rating: 4, review: 'Great for container gardening' }
    ],
    specifications: {
      composition: 'Peat, Vermiculite, Perlite, Compost',
      pH: '6.0-7.0',
      drainage: 'Excellent',
      nutrients: 'Balanced NPK'
    },
    recommendedCrops: ['Container Plants', 'Seedlings'],
    features: ['Well Draining', 'Nutrient Rich', 'pH Balanced'],
    discount: 13,
    isPopular: true,
    isFeatured: false
  },
  {
    _id: 'soil2',
    name: 'Organic Garden Soil',
    description: 'Premium organic garden soil enriched with compost and natural minerals.',
    category: 'Soil',
    brand: 'EarthGrow',
    price: 280,
    originalPrice: 320,
    stock: 300,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
    ],
    averageRating: 4.4,
    ratings: [
      { rating: 5, review: 'Excellent organic quality!' },
      { rating: 4, review: 'Good for vegetable gardens' }
    ],
    specifications: {
      composition: 'Organic Compost, Loam, Sand',
      pH: '6.5-7.5',
      organic: '100% Organic',
      certification: 'Organic Certified'
    },
    recommendedCrops: ['Vegetables', 'Herbs', 'Flowers'],
    features: ['100% Organic', 'Rich in Nutrients', 'Improves Soil Health'],
    discount: 13,
    isPopular: false,
    isFeatured: true
  },

  // BIO CATEGORY
  {
    _id: 'bio1',
    name: 'Bio Fertilizer Rhizobium',
    description: 'Nitrogen-fixing bio fertilizer containing Rhizobium bacteria for legume crops.',
    category: 'Bio',
    brand: 'BioAgri',
    price: 180,
    originalPrice: 220,
    stock: 150,
    unit: 'packet',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
    ],
    averageRating: 4.3,
    ratings: [
      { rating: 5, review: 'Great for legume crops!' },
      { rating: 4, review: 'Natural nitrogen fixation' }
    ],
    specifications: {
      bacteria: 'Rhizobium species',
      count: '10^8 CFU/g',
      application: 'Seed treatment',
      shelfLife: '12 months'
    },
    recommendedCrops: ['Pulses', 'Legumes', 'Groundnut'],
    features: ['Nitrogen Fixing', 'Eco Friendly', 'Cost Effective'],
    discount: 18,
    isPopular: true,
    isFeatured: false
  },
  {
    _id: 'bio2',
    name: 'Trichoderma Bio Fungicide',
    description: 'Biological fungicide containing Trichoderma for soil-borne disease control.',
    category: 'Bio',
    brand: 'BioShield',
    price: 250,
    originalPrice: 300,
    stock: 120,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
    ],
    averageRating: 4.6,
    ratings: [
      { rating: 5, review: 'Excellent disease control!' },
      { rating: 5, review: 'Safe biological solution' }
    ],
    specifications: {
      organism: 'Trichoderma viride',
      count: '10^6 CFU/g',
      application: 'Soil application',
      shelfLife: '18 months'
    },
    recommendedCrops: ['All Crops'],
    features: ['Biological Control', 'Safe', 'Soil Health'],
    discount: 17,
    isPopular: true,
    isFeatured: true
  },

  // ORGANIC CATEGORY
  {
    _id: 'org1',
    name: 'Organic Vermicompost',
    description: 'Premium vermicompost made from earthworms for natural soil enrichment.',
    category: 'Organic',
    brand: 'NatureGrow',
    price: 320,
    originalPrice: 380,
    stock: 200,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
    ],
    averageRating: 4.7,
    ratings: [
      { rating: 5, review: 'Best organic fertilizer!' },
      { rating: 5, review: 'Amazing results on vegetables' }
    ],
    specifications: {
      type: 'Vermicompost',
      npk: 'N:1.5%, P:1.0%, K:1.2%',
      organic: '100% Organic',
      certification: 'Organic India Certified'
    },
    recommendedCrops: ['All Crops'],
    features: ['100% Organic', 'Slow Release', 'Soil Conditioner'],
    discount: 16,
    isPopular: true,
    isFeatured: true
  },
  {
    _id: 'org2',
    name: 'Organic Bone Meal',
    description: 'Natural bone meal fertilizer rich in phosphorus for strong root development.',
    category: 'Organic',
    brand: 'OrganicPlus',
    price: 450,
    originalPrice: 520,
    stock: 100,
    unit: 'kg',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
    ],
    averageRating: 4.4,
    ratings: [
      { rating: 5, review: 'Great for flowering plants!' },
      { rating: 4, review: 'Natural phosphorus source' }
    ],
    specifications: {
      type: 'Bone Meal',
      npk: 'N:4%, P:12%, K:0%',
      organic: '100% Natural',
      application: 'Soil mixing'
    },
    recommendedCrops: ['Flowering Plants', 'Fruit Trees'],
    features: ['High Phosphorus', 'Natural', 'Long Lasting'],
    discount: 13,
    isPopular: false,
    isFeatured: false
  }
];

// Mock categories
export const mockCategories = [
  { id: 1, name: 'Electronics', count: 3, icon: '💻' },
  { id: 2, name: 'Fertilizers', count: 6, icon: '🌱' },
  { id: 3, name: 'Seeds', count: 3, icon: '🌾' },
  { id: 4, name: 'Pesticides', count: 2, icon: '🐛' },
  { id: 5, name: 'Tools', count: 2, icon: '🔧' },
  { id: 6, name: 'Soil', count: 2, icon: '🌍' },
  { id: 7, name: 'Bio', count: 2, icon: '🍃' },
  { id: 8, name: 'Organic', count: 2, icon: '🌿' }
];

// Mock featured products
export const mockFeaturedProducts = mockProducts.filter(product => product.isFeatured);

// Mock popular products
export const mockPopularProducts = mockProducts.filter(product => product.isPopular);
