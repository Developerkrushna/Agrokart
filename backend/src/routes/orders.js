const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        console.log('Order creation request received:', {
            user: req.user.id,
            body: req.body
        });

        const { items, deliveryAddress, deliverySlot, paymentMethod } = req.body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            console.log('Invalid items:', items);
            return res.status(400).json({ message: 'Items are required and must be an array' });
        }

        if (!deliveryAddress) {
            console.log('Missing delivery address');
            return res.status(400).json({ message: 'Delivery address is required' });
        }

        // Validate products and calculate total
        let totalAmount = 0;
        for (const item of items) {
            console.log('Processing item:', item);
            console.log('Product ID:', item.product, 'Type:', typeof item.product, 'Length:', item.product ? item.product.length : 'N/A');

            if (!item.product) {
                console.log('Item missing product ID:', item);
                return res.status(400).json({ message: 'Product ID is required for each item' });
            }

            let product = null;

            // Check if the product ID is a valid MongoDB ObjectId (24 hex characters)
            const isValidObjectId = item.product &&
                                  typeof item.product === 'string' &&
                                  item.product.length === 24 &&
                                  /^[0-9a-fA-F]{24}$/.test(item.product);

            console.log('Is valid ObjectId:', isValidObjectId);

            // Try to find product by MongoDB ObjectId first
            if (isValidObjectId) {
                try {
                    console.log('Attempting to find product by ObjectId:', item.product);
                    product = await Product.findById(item.product);
                    console.log('Found product in database:', product ? product.name : 'Not found');
                } catch (error) {
                    console.log('Error finding product by ObjectId:', error.message);
                }
            } else {
                console.log('Product ID is not a valid ObjectId, treating as mock product:', item.product);
            }

            // Validate quantity first
            if (!item.quantity || item.quantity < 1) {
                console.log('Invalid quantity for item:', item.product);
                return res.status(400).json({ message: `Invalid quantity for item ${item.product}` });
            }

            if (product) {
                // Real product from database
                console.log('Found product in database:', product.name);

                if (product.stock < item.quantity) {
                    console.log('Insufficient stock for product:', product.name);
                    return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
                }

                totalAmount += product.price * item.quantity;
                console.log('Item processed from database:', { name: product.name, quantity: item.quantity, price: product.price, total: product.price * item.quantity });
            } else {
                // Mock product - use price from cart item
                console.log('Using mock product with cart price');

                if (!item.price || item.price <= 0) {
                    return res.status(400).json({ message: `Invalid price for item: ${item.product}` });
                }

                totalAmount += item.price * item.quantity;
                console.log('Item processed as mock product:', { id: item.product, quantity: item.quantity, price: item.price, total: item.price * item.quantity });
            }
        }

        console.log('Total amount calculated:', totalAmount);

        // Create order
        const mongoose = require('mongoose');
        const crypto = require('crypto');

        const order = new Order({
            user: req.user.id,
            items: items.map(item => {
                let productId = item.product;

                // For mock products (non-ObjectId), generate a valid ObjectId
                const isValidObjectId = item.product &&
                                      typeof item.product === 'string' &&
                                      item.product.length === 24 &&
                                      /^[0-9a-fA-F]{24}$/.test(item.product);

                if (!isValidObjectId) {
                    // Generate a consistent ObjectId for mock products
                    const hash = crypto.createHash('md5').update(item.product.toString()).digest('hex');
                    productId = new mongoose.Types.ObjectId(hash.substring(0, 24));
                    console.log(`Generated ObjectId for mock product ${item.product}: ${productId}`);
                }

                return {
                    product: productId,
                    quantity: item.quantity,
                    price: item.price
                };
            }),
            totalAmount,
            deliveryAddress,
            deliverySlot,
            paymentMethod: paymentMethod || 'cod',
            orderStatus: 'pending'
        });

        console.log('Order object created with updated logic:', order);

        // Update product stock (only for real products with valid ObjectIds)
        for (const item of items) {
            const isValidObjectId = item.product &&
                                  typeof item.product === 'string' &&
                                  item.product.length === 24 &&
                                  /^[0-9a-fA-F]{24}$/.test(item.product);

            if (isValidObjectId) {
                try {
                    const updateResult = await Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: -item.quantity }
                    });
                    if (updateResult) {
                        console.log('Stock updated for product:', item.product);
                    } else {
                        console.log('Product not found for stock update:', item.product);
                    }
                } catch (error) {
                    console.log('Error updating stock for product:', item.product, error.message);
                }
            } else {
                console.log('Skipping stock update for mock product:', item.product);
            }
        }

        // Generate a unique tracking number before saving
        const tempId = new mongoose.Types.ObjectId();
        order.trackingNumber = `ORD${tempId.toString().slice(-6).toUpperCase()}`;
        console.log('Tracking number generated:', order.trackingNumber);

        await order.save();
        console.log('Order saved successfully:', order._id);

        res.status(201).json(order);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product')
            .populate('deliveryPartner', 'name phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this order
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status (admin only)
router.patch('/:id/status', [auth, admin], async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.orderStatus = status;

        // Update delivery time if order is delivered
        if (status === 'delivered') {
            order.actualDeliveryTime = new Date();
        }

        await order.save();
        res.json(order);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel order
router.post('/:id/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to cancel this order
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if order can be cancelled
        if (!order.canBeCancelled()) {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }

        // Update order status
        order.orderStatus = 'cancelled';

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        await order.save();
        res.json(order);
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Assign delivery partner (admin only)
router.post('/:id/assign-delivery', [auth, admin], async (req, res) => {
    try {
        const { deliveryPartnerId } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.deliveryPartner = deliveryPartnerId;
        order.orderStatus = 'out_for_delivery';
        await order.save();

        res.json(order);
    } catch (error) {
        console.error('Assign delivery error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders (admin only)
router.get('/admin/all', [auth, admin], async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name phone')
            .populate('items.product')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalOrders: total
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete order
router.delete('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Only the user who placed the order or an admin can delete
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this order' });
        }
        await order.deleteOne();
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 