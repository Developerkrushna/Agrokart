const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const {
            category,
            page = 1,
            limit = 20,
            sortBy = 'name',
            sortOrder = 'asc',
            minPrice,
            maxPrice,
            search
        } = req.query;

        // Build filter object
        let filter = { isActive: true };

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const products = await Product.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit));

        // Get total count for pagination
        const total = await Product.countDocuments(filter);

        res.json({
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Search products
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json({ products: [] });
        }

        const searchQuery = q.trim();

        // Create search criteria
        const searchCriteria = {
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } }
            ]
        };

        const products = await Product.find(searchCriteria).limit(10);

        res.json({
            products: products.map(product => ({
                id: product._id,
                name: product.name,
                category: product.category,
                price: product.price,
                image: product.image,
                description: product.description
            })),
            query: searchQuery,
            count: products.length
        });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).send('Server Error');
    }
});

// Get all categories with product counts
router.get('/categories/all', async (req, res) => {
    try {
        const categories = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Add category icons and display names
        const categoryMap = {
            'urea': { name: 'Urea', icon: '🌱', description: 'Nitrogen-rich fertilizers' },
            'dap': { name: 'DAP', icon: '🌾', description: 'Phosphorus fertilizers' },
            'npk': { name: 'NPK', icon: '🌿', description: 'Balanced nutrition' },
            'organic': { name: 'Organic', icon: '🍃', description: 'Natural fertilizers' },
            'other': { name: 'Other', icon: '🔧', description: 'Specialized products' }
        };

        const enrichedCategories = categories.map(cat => ({
            id: cat._id,
            name: categoryMap[cat._id]?.name || cat._id,
            icon: categoryMap[cat._id]?.icon || '📦',
            description: categoryMap[cat._id]?.description || '',
            count: cat.count,
            avgPrice: Math.round(cat.avgPrice),
            priceRange: {
                min: cat.minPrice,
                max: cat.maxPrice
            }
        }));

        res.json(enrichedCategories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const {
            page = 1,
            limit = 20,
            sortBy = 'name',
            sortOrder = 'asc',
            minPrice,
            maxPrice
        } = req.query;

        // Build filter
        let filter = { category, isActive: true };

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Build sort
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query
        const skip = (page - 1) * limit;
        const products = await Product.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(filter);

        res.json({
            category,
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get featured/popular products
router.get('/featured/all', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Get products with high ratings or marked as featured
        const products = await Product.find({
            isActive: true,
            $or: [
                { averageRating: { $gte: 4.0 } },
                { isFeatured: true }
            ]
        })
        .sort({ averageRating: -1, createdAt: -1 })
        .limit(Number(limit));

        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

// Create product (admin only)
router.post('/', auth, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update product (admin only)
router.put('/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 