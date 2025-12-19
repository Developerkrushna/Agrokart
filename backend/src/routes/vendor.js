const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const User = require('../models/User');
const VendorInventory = require('../models/VendorInventory');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Earnings = require('../models/Earnings');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const { auth: firebaseAuth } = require('../config/firebase');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/vendor-documents/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed'));
        }
    }
});

// Vendor login with role validation
router.post('/login', async (req, res) => {
    try {
        const { email, password, firebaseUid } = req.body;
        
        console.log('🔄 Vendor login attempt:', { email, firebaseUid: firebaseUid ? 'Present' : 'Missing' });
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        // Find user in database
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials. No account found with this email.' });
        }
        
        // Validate user role
        if (user.role !== 'vendor') {
            console.log('❌ Role mismatch - Expected: vendor, Found:', user.role);
            return res.status(403).json({ 
                message: `Access denied. This account is registered as ${user.role}, not vendor. Please use the correct login page for your account type.`,
                userRole: user.role
            });
        }
        
        console.log('✅ Vendor login successful:', { id: user._id, email: user.email, role: user.role });
        
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                businessName: user.vendorProfile?.businessName,
                businessType: user.vendorProfile?.businessType,
                isVerified: user.vendorProfile?.isVerified || false
            },
            token: 'vendor-jwt-token' // In a real app, generate a proper JWT
        });
        
    } catch (error) {
        console.error('Vendor login error:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Vendor registration with Firebase UID
router.post('/register', async (req, res) => {
    try {
        const {
            firebaseUid, name, email, phone,
            businessName, businessType, gstNumber,
            serviceAreas, bankDetails
        } = req.body;

        if (!firebaseUid) {
            return res.status(400).json({ 
                message: 'Firebase UID is required' 
            });
        }

        // Check if user already exists
        let existingUser = await User.findOne({ 
            $or: [{ email }, { phone }, { firebaseUid }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email, phone, or Firebase UID already exists' 
            });
        }

        // Create new vendor user
        const vendor = new User({
            firebaseUid,
            name,
            email,
            phone,
            role: 'vendor',
            vendorProfile: {
                businessName,
                businessType,
                gstNumber,
                serviceAreas,
                bankDetails,
                isVerified: false,
                verificationStatus: 'pending'
            }
        });

        await vendor.save();

        // Create notification for admin
        await Notification.createNotification({
            recipient: null, // Admin notification
            recipientType: 'admin',
            type: 'new_vendor_registration',
            title: 'New Vendor Registration',
            message: `New vendor ${businessName} has registered and needs verification`,
            data: {
                vendorId: vendor._id,
                businessName,
                actionUrl: `/admin/vendors/${vendor._id}`
            },
            priority: 'medium'
        });

        res.status(201).json({
            message: 'Vendor registered successfully',
            user: {
                id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                role: vendor.role,
                firebaseUid: vendor.firebaseUid,
                vendorProfile: vendor.vendorProfile
            }
        });

    } catch (error) {
        console.error('Vendor registration error:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Upload vendor documents
router.post('/upload-documents', auth, upload.fields([
    { name: 'gstCertificate', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 }
]), async (req, res) => {
    try {
        const vendor = await User.findById(req.user.id);
        
        if (!vendor || vendor.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update document paths
        if (req.files) {
            const documents = {};
            Object.keys(req.files).forEach(key => {
                if (req.files[key][0]) {
                    documents[key] = req.files[key][0].path;
                }
            });

            vendor.vendorProfile.documents = {
                ...vendor.vendorProfile.documents,
                ...documents
            };
            
            vendor.vendorProfile.verificationStatus = 'under_review';
            await vendor.save();

            // Notify admin about document upload
            await Notification.createNotification({
                recipient: null,
                recipientType: 'admin',
                type: 'document_uploaded',
                title: 'Vendor Documents Uploaded',
                message: `${vendor.vendorProfile.businessName} has uploaded verification documents`,
                data: {
                    vendorId: vendor._id,
                    actionUrl: `/admin/vendors/${vendor._id}/verify`
                },
                priority: 'medium'
            });
        }

        res.json({
            message: 'Documents uploaded successfully',
            documents: vendor.vendorProfile.documents
        });

    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Get vendor dashboard data
router.get('/dashboard', auth, async (req, res) => {
    try {
        const vendor = await User.findById(req.user.id);
        
        if (!vendor || vendor.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // Get earnings summary
        const earningsSummary = await Earnings.getEarningsSummary(
            vendor._id, 
            'vendor', 
            { year: currentYear, month: currentMonth }
        );

        // Get total products
        const totalProducts = await VendorInventory.countDocuments({ 
            vendor: vendor._id, 
            isActive: true 
        });

        // Get low stock alerts
        const lowStockProducts = await VendorInventory.find({
            vendor: vendor._id,
            'alerts.lowStock': true,
            isActive: true
        }).populate('product', 'name').limit(5);

        // Get recent orders
        const recentOrders = await Order.find({
            'items.vendor': vendor._id
        })
        .populate('user', 'name phone')
        .populate('items.product', 'name')
        .sort({ createdAt: -1 })
        .limit(10);

        // Get monthly earnings trend
        const monthlyTrend = await Earnings.getMonthlyTrend(
            vendor._id, 
            'vendor', 
            currentYear
        );

        res.json({
            vendor: {
                name: vendor.name,
                businessName: vendor.vendorProfile.businessName,
                isVerified: vendor.vendorProfile.isVerified,
                verificationStatus: vendor.vendorProfile.verificationStatus,
                rating: vendor.vendorProfile.rating
            },
            stats: {
                totalProducts,
                totalEarnings: earningsSummary.totalNet,
                pendingEarnings: earningsSummary.pendingAmount,
                ordersThisMonth: earningsSummary.transactionCount,
                lowStockCount: lowStockProducts.length
            },
            earningsSummary,
            lowStockProducts,
            recentOrders,
            monthlyTrend
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Get vendor inventory
router.get('/inventory', auth, async (req, res) => {
    try {
        const vendor = await User.findById(req.user.id);

        if (!vendor || vendor.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { page = 1, limit = 20, search, category, lowStock } = req.query;

        let query = { vendor: vendor._id, isActive: true };

        if (lowStock === 'true') {
            query['alerts.lowStock'] = true;
        }

        const inventory = await VendorInventory.find(query)
            .populate('product', 'name category brand images')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await VendorInventory.countDocuments(query);

        res.json({
            inventory,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });

    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Add product to inventory
router.post('/inventory', auth, async (req, res) => {
    try {
        const vendor = await User.findById(req.user.id);

        if (!vendor || vendor.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const {
            productId, stock, costPrice, sellingPrice,
            minStockLevel, maxStockLevel, discountPercentage,
            expiryDate, batchNumber, manufacturingDate
        } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if vendor already has this product
        const existingInventory = await VendorInventory.findOne({
            vendor: vendor._id,
            product: productId
        });

        if (existingInventory) {
            return res.status(400).json({
                message: 'Product already exists in inventory. Use update instead.'
            });
        }

        const inventoryItem = new VendorInventory({
            vendor: vendor._id,
            product: productId,
            stock,
            costPrice,
            sellingPrice,
            minStockLevel,
            maxStockLevel,
            discountPercentage,
            expiryDate,
            batchNumber,
            manufacturingDate
        });

        await inventoryItem.save();

        res.status(201).json({
            message: 'Product added to inventory successfully',
            inventoryItem
        });

    } catch (error) {
        console.error('Add inventory error:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Update inventory item
router.put('/inventory/:id', auth, async (req, res) => {
    try {
        const vendor = await User.findById(req.user.id);

        if (!vendor || vendor.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const inventoryItem = await VendorInventory.findOne({
            _id: req.params.id,
            vendor: vendor._id
        });

        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        const updateFields = [
            'stock', 'costPrice', 'sellingPrice', 'minStockLevel',
            'maxStockLevel', 'discountPercentage', 'expiryDate',
            'batchNumber', 'manufacturingDate', 'isActive'
        ];

        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                inventoryItem[field] = req.body[field];
            }
        });

        await inventoryItem.save();

        res.json({
            message: 'Inventory updated successfully',
            inventoryItem
        });

    } catch (error) {
        console.error('Update inventory error:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Get vendor orders
router.get('/orders', auth, async (req, res) => {
    try {
        const vendor = await User.findById(req.user.id);

        if (!vendor || vendor.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { page = 1, limit = 20, status } = req.query;

        let query = { 'items.vendor': vendor._id };

        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name phone address')
            .populate('items.product', 'name images')
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
        console.error('Get vendor orders error:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Accept/Reject order
router.post('/orders/:orderId/respond', auth, async (req, res) => {
    try {
        const vendor = await User.findById(req.user.id);

        if (!vendor || vendor.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { action, reason } = req.body; // action: 'accept' or 'reject'

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if vendor has items in this order
        const hasVendorItems = order.items.some(item =>
            item.vendor && item.vendor.toString() === vendor._id.toString()
        );

        if (!hasVendorItems) {
            return res.status(403).json({ message: 'Order does not belong to this vendor' });
        }

        if (action === 'accept') {
            order.orderStatus = 'confirmed';

            // Reserve stock for order items
            for (const item of order.items) {
                if (item.vendor && item.vendor.toString() === vendor._id.toString()) {
                    const inventoryItem = await VendorInventory.findOne({
                        vendor: vendor._id,
                        product: item.product
                    });

                    if (inventoryItem) {
                        const reserved = inventoryItem.reserveStock(item.quantity);
                        if (!reserved) {
                            return res.status(400).json({
                                message: `Insufficient stock for ${item.product.name}`
                            });
                        }
                        await inventoryItem.save();
                    }
                }
            }

            // Create earnings record
            const totalAmount = order.items
                .filter(item => item.vendor && item.vendor.toString() === vendor._id.toString())
                .reduce((sum, item) => sum + (item.price * item.quantity), 0);

            await Earnings.create({
                user: vendor._id,
                userType: 'vendor',
                order: order._id,
                transactionType: 'sale',
                grossAmount: totalAmount,
                commissionRate: vendor.vendorProfile.commissionRate || 10,
                description: `Sale for order ${order.trackingNumber}`
            });

        } else if (action === 'reject') {
            order.orderStatus = 'cancelled';
            order.notes = reason || 'Rejected by vendor';
        }

        await order.save();

        // Notify customer
        await Notification.createNotification({
            recipient: order.user,
            recipientType: 'customer',
            type: action === 'accept' ? 'order_confirmed' : 'order_cancelled',
            title: action === 'accept' ? 'Order Confirmed' : 'Order Cancelled',
            message: action === 'accept'
                ? `Your order ${order.trackingNumber} has been confirmed by the vendor`
                : `Your order ${order.trackingNumber} has been cancelled. Reason: ${reason}`,
            data: {
                orderId: order._id,
                trackingNumber: order.trackingNumber,
                actionUrl: `/orders/${order._id}`
            },
            priority: 'high'
        });

        res.json({
            message: `Order ${action}ed successfully`,
            order
        });

    } catch (error) {
        console.error('Order response error:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

module.exports = router;
