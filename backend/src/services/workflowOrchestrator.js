const Order = require('../models/Order');
const User = require('../models/User');
const VendorInventory = require('../models/VendorInventory');
const DeliveryAssignment = require('../models/DeliveryAssignment');
const Earnings = require('../models/Earnings');
const notificationService = require('./notificationService');

class WorkflowOrchestrator {
    
    // Handle new order placement
    async handleOrderPlacement(order) {
        try {
            console.log(`🚀 Starting order workflow for order ${order.trackingNumber}`);

            // Step 1: Notify vendors about new order
            await this.notifyVendorsAboutNewOrder(order);

            // Step 2: Set order expiry for vendor response (24 hours)
            setTimeout(() => {
                this.handleOrderExpiry(order._id);
            }, 24 * 60 * 60 * 1000); // 24 hours

            console.log(`✅ Order placement workflow completed for ${order.trackingNumber}`);
        } catch (error) {
            console.error('Order placement workflow error:', error);
        }
    }

    // Notify vendors about new order
    async notifyVendorsAboutNewOrder(order) {
        try {
            // Get unique vendors from order items
            const vendorIds = [...new Set(
                order.items
                    .filter(item => item.vendor)
                    .map(item => item.vendor.toString())
            )];

            for (const vendorId of vendorIds) {
                await notificationService.createAndSendNotification({
                    recipient: vendorId,
                    recipientType: 'vendor',
                    type: 'order_placed',
                    title: 'New Order Received',
                    message: `You have received a new order #${order.trackingNumber} worth ₹${order.totalAmount}`,
                    data: {
                        orderId: order._id,
                        trackingNumber: order.trackingNumber,
                        amount: order.totalAmount,
                        actionUrl: `/vendor/orders/${order._id}`
                    },
                    priority: 'high',
                    channels: {
                        push: true,
                        email: true,
                        sms: false,
                        inApp: true
                    }
                });
            }
        } catch (error) {
            console.error('Vendor notification error:', error);
        }
    }

    // Handle vendor order acceptance
    async handleVendorAcceptance(order, vendorId) {
        try {
            console.log(`📦 Vendor ${vendorId} accepted order ${order.trackingNumber}`);

            // Step 1: Reserve inventory
            await this.reserveInventoryForOrder(order, vendorId);

            // Step 2: Create earnings record for vendor
            await this.createVendorEarnings(order, vendorId);

            // Step 3: Notify customer about order confirmation
            await notificationService.createAndSendNotification({
                recipient: order.user,
                recipientType: 'customer',
                type: 'order_confirmed',
                title: 'Order Confirmed',
                message: `Your order #${order.trackingNumber} has been confirmed and is being prepared`,
                data: {
                    orderId: order._id,
                    trackingNumber: order.trackingNumber,
                    actionUrl: `/orders/${order._id}`
                },
                priority: 'medium',
                channels: {
                    push: true,
                    email: true,
                    sms: true,
                    inApp: true
                }
            });

            // Step 4: Start preparation phase
            await this.startPreparationPhase(order, vendorId);

        } catch (error) {
            console.error('Vendor acceptance workflow error:', error);
        }
    }

    // Reserve inventory for order
    async reserveInventoryForOrder(order, vendorId) {
        try {
            for (const item of order.items) {
                if (item.vendor && item.vendor.toString() === vendorId.toString()) {
                    const inventoryItem = await VendorInventory.findOne({
                        vendor: vendorId,
                        product: item.product
                    });

                    if (inventoryItem) {
                        const reserved = inventoryItem.reserveStock(item.quantity);
                        if (!reserved) {
                            throw new Error(`Insufficient stock for product ${item.product}`);
                        }
                        await inventoryItem.save();

                        // Check for low stock and send alert
                        if (inventoryItem.isLowStock()) {
                            await this.sendLowStockAlert(vendorId, inventoryItem);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Inventory reservation error:', error);
            throw error;
        }
    }

    // Create vendor earnings record
    async createVendorEarnings(order, vendorId) {
        try {
            const vendor = await User.findById(vendorId);
            const vendorItems = order.items.filter(item => 
                item.vendor && item.vendor.toString() === vendorId.toString()
            );

            const totalAmount = vendorItems.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );

            await Earnings.create({
                user: vendorId,
                userType: 'vendor',
                order: order._id,
                transactionType: 'sale',
                grossAmount: totalAmount,
                commissionRate: vendor.vendorProfile?.commissionRate || 10,
                description: `Sale for order ${order.trackingNumber}`
            });
        } catch (error) {
            console.error('Vendor earnings creation error:', error);
        }
    }

    // Start preparation phase
    async startPreparationPhase(order, vendorId) {
        try {
            // Set estimated preparation time (2 hours)
            const preparationTime = new Date();
            preparationTime.setHours(preparationTime.getHours() + 2);

            // Schedule delivery assignment
            setTimeout(() => {
                this.assignDeliveryPartner(order._id, vendorId);
            }, 2 * 60 * 60 * 1000); // 2 hours

            console.log(`⏰ Preparation phase started for order ${order.trackingNumber}`);
        } catch (error) {
            console.error('Preparation phase error:', error);
        }
    }

    // Assign delivery partner
    async assignDeliveryPartner(orderId, vendorId) {
        try {
            const order = await Order.findById(orderId).populate('user');
            if (!order) return;

            console.log(`🚚 Assigning delivery partner for order ${order.trackingNumber}`);

            // Find available delivery partners near vendor location
            const availablePartners = await this.findAvailableDeliveryPartners(vendorId, order);

            if (availablePartners.length === 0) {
                console.log('No available delivery partners found');
                return;
            }

            // Select best delivery partner (closest, highest rated)
            const selectedPartner = this.selectBestDeliveryPartner(availablePartners);

            // Create delivery assignment
            const assignment = await this.createDeliveryAssignment(order, vendorId, selectedPartner._id);

            // Notify delivery partner
            await notificationService.createAndSendNotification({
                recipient: selectedPartner._id,
                recipientType: 'delivery_partner',
                type: 'delivery_assigned',
                title: 'New Delivery Assignment',
                message: `You have been assigned delivery for order #${order.trackingNumber}`,
                data: {
                    orderId: order._id,
                    assignmentId: assignment._id,
                    trackingNumber: order.trackingNumber,
                    deliveryFee: assignment.deliveryFee,
                    actionUrl: `/delivery/assignments/${assignment._id}`
                },
                priority: 'high',
                channels: {
                    push: true,
                    email: false,
                    sms: true,
                    inApp: true
                }
            });

            // Notify customer
            await notificationService.createAndSendNotification({
                recipient: order.user._id,
                recipientType: 'customer',
                type: 'delivery_assigned',
                title: 'Delivery Partner Assigned',
                message: `Your order #${order.trackingNumber} is now out for delivery`,
                data: {
                    orderId: order._id,
                    trackingNumber: order.trackingNumber,
                    deliveryPartner: selectedPartner.name,
                    actionUrl: `/orders/${order._id}/track`
                },
                priority: 'medium'
            });

        } catch (error) {
            console.error('Delivery assignment error:', error);
        }
    }

    // Find available delivery partners
    async findAvailableDeliveryPartners(vendorId, order) {
        try {
            // Get vendor location
            const vendor = await User.findById(vendorId);
            
            // Find delivery partners within service radius
            const deliveryPartners = await User.find({
                role: 'delivery_partner',
                'deliveryProfile.isAvailable': true,
                'deliveryProfile.isVerified': true
            });

            // Filter by distance and availability
            // For demo purposes, return all available partners
            return deliveryPartners;
        } catch (error) {
            console.error('Find delivery partners error:', error);
            return [];
        }
    }

    // Select best delivery partner
    selectBestDeliveryPartner(partners) {
        // Sort by rating and select the best one
        return partners.sort((a, b) => {
            const ratingA = a.deliveryProfile?.rating?.average || 0;
            const ratingB = b.deliveryProfile?.rating?.average || 0;
            return ratingB - ratingA;
        })[0];
    }

    // Create delivery assignment
    async createDeliveryAssignment(order, vendorId, deliveryPartnerId) {
        try {
            const vendor = await User.findById(vendorId);
            const customer = await User.findById(order.user);

            const assignment = new DeliveryAssignment({
                order: order._id,
                deliveryPartner: deliveryPartnerId,
                vendor: vendorId,
                customer: order.user,
                pickupLocation: {
                    address: vendor.address,
                    coordinates: vendor.address?.coordinates || { type: 'Point', coordinates: [0, 0] },
                    contactPerson: vendor.name,
                    contactPhone: vendor.phone
                },
                deliveryLocation: {
                    address: order.deliveryAddress,
                    coordinates: order.deliveryAddress?.coordinates || { type: 'Point', coordinates: [0, 0] },
                    contactPerson: customer.name,
                    contactPhone: customer.phone
                },
                deliveryFee: this.calculateDeliveryFee(order),
                estimatedDeliveryTime: this.calculateEstimatedDeliveryTime()
            });

            assignment.calculateDistance();
            await assignment.save();

            // Update order status
            order.orderStatus = 'out_for_delivery';
            order.deliveryPartner = deliveryPartnerId;
            await order.save();

            return assignment;
        } catch (error) {
            console.error('Create delivery assignment error:', error);
            throw error;
        }
    }

    // Calculate delivery fee
    calculateDeliveryFee(order) {
        const baseRate = 50; // Base delivery fee
        const distanceRate = 10; // Per km rate
        const distance = 5; // Default distance for demo
        
        return baseRate + (distance * distanceRate);
    }

    // Calculate estimated delivery time
    calculateEstimatedDeliveryTime() {
        const estimatedTime = new Date();
        estimatedTime.setHours(estimatedTime.getHours() + 2); // 2 hours from now
        return estimatedTime;
    }

    // Send low stock alert
    async sendLowStockAlert(vendorId, inventoryItem) {
        try {
            const product = await inventoryItem.populate('product');
            
            await notificationService.createAndSendNotification({
                recipient: vendorId,
                recipientType: 'vendor',
                type: 'low_stock',
                title: 'Low Stock Alert',
                message: `${product.product.name} is running low on stock (${inventoryItem.availableStock} units remaining)`,
                data: {
                    productId: product.product._id,
                    productName: product.product.name,
                    currentStock: inventoryItem.availableStock,
                    minStockLevel: inventoryItem.minStockLevel,
                    actionUrl: `/vendor/inventory/${inventoryItem._id}`
                },
                priority: 'medium'
            });
        } catch (error) {
            console.error('Low stock alert error:', error);
        }
    }

    // Handle order expiry (if vendor doesn't respond)
    async handleOrderExpiry(orderId) {
        try {
            const order = await Order.findById(orderId);
            if (!order || order.orderStatus !== 'pending') return;

            // Cancel order due to no vendor response
            order.orderStatus = 'cancelled';
            order.notes = 'Order cancelled due to no vendor response within 24 hours';
            await order.save();

            // Notify customer
            await notificationService.createAndSendNotification({
                recipient: order.user,
                recipientType: 'customer',
                type: 'order_cancelled',
                title: 'Order Cancelled',
                message: `Your order #${order.trackingNumber} has been cancelled due to vendor unavailability`,
                data: {
                    orderId: order._id,
                    trackingNumber: order.trackingNumber,
                    reason: 'Vendor unavailable'
                },
                priority: 'high'
            });

            console.log(`⏰ Order ${order.trackingNumber} expired and cancelled`);
        } catch (error) {
            console.error('Order expiry handling error:', error);
        }
    }

    // Handle delivery completion
    async handleDeliveryCompletion(assignment) {
        try {
            console.log(`✅ Delivery completed for assignment ${assignment._id}`);

            // Update order status
            const order = await Order.findById(assignment.order);
            if (order) {
                order.orderStatus = 'delivered';
                order.actualDeliveryTime = new Date();
                await order.save();
            }

            // Create delivery partner earnings
            await Earnings.create({
                user: assignment.deliveryPartner,
                userType: 'delivery_partner',
                order: assignment.order,
                deliveryAssignment: assignment._id,
                transactionType: 'delivery',
                grossAmount: assignment.deliveryFee + assignment.tips,
                description: `Delivery for order ${order.trackingNumber}`
            });

            // Confirm stock usage
            await this.confirmStockUsage(order, assignment.vendor);

            // Send completion notifications
            await this.sendDeliveryCompletionNotifications(assignment, order);

        } catch (error) {
            console.error('Delivery completion workflow error:', error);
        }
    }

    // Confirm stock usage after delivery
    async confirmStockUsage(order, vendorId) {
        try {
            for (const item of order.items) {
                if (item.vendor && item.vendor.toString() === vendorId.toString()) {
                    const inventoryItem = await VendorInventory.findOne({
                        vendor: vendorId,
                        product: item.product
                    });

                    if (inventoryItem) {
                        inventoryItem.confirmStockUsage(item.quantity);
                        await inventoryItem.save();
                    }
                }
            }
        } catch (error) {
            console.error('Stock confirmation error:', error);
        }
    }

    // Send delivery completion notifications
    async sendDeliveryCompletionNotifications(assignment, order) {
        try {
            // Notify customer
            await notificationService.createAndSendNotification({
                recipient: assignment.customer,
                recipientType: 'customer',
                type: 'order_delivered',
                title: 'Order Delivered',
                message: `Your order #${order.trackingNumber} has been delivered successfully`,
                data: {
                    orderId: order._id,
                    trackingNumber: order.trackingNumber,
                    actionUrl: `/orders/${order._id}`
                },
                priority: 'high'
            });

            // Notify vendor
            await notificationService.createAndSendNotification({
                recipient: assignment.vendor,
                recipientType: 'vendor',
                type: 'order_delivered',
                title: 'Order Delivered',
                message: `Order #${order.trackingNumber} has been delivered to the customer`,
                data: {
                    orderId: order._id,
                    trackingNumber: order.trackingNumber,
                    actionUrl: `/vendor/orders/${order._id}`
                },
                priority: 'medium'
            });
        } catch (error) {
            console.error('Delivery completion notification error:', error);
        }
    }
}

// Export singleton instance
module.exports = new WorkflowOrchestrator();
