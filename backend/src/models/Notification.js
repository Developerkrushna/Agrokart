const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow null for admin notifications
    },
    recipientType: {
        type: String,
        enum: ['customer', 'vendor', 'delivery_partner', 'admin'],
        required: true
    },
    type: {
        type: String,
        enum: [
            'order_placed', 'order_confirmed', 'order_cancelled', 'order_delivered',
            'payment_received', 'payment_failed', 'low_stock', 'new_product',
            'delivery_assigned', 'delivery_completed', 'delivery_failed',
            'earnings_update', 'rating_received', 'document_verified',
            'document_rejected', 'promotion', 'system_update',
            'new_vendor_registration', 'new_delivery_partner_registration',
            'vendor_verification_required', 'delivery_partner_verification_required'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        orderId: mongoose.Schema.Types.ObjectId,
        productId: mongoose.Schema.Types.ObjectId,
        deliveryId: mongoose.Schema.Types.ObjectId,
        amount: Number,
        actionUrl: String,
        metadata: mongoose.Schema.Types.Mixed
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
        default: 'pending'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    sentAt: Date,
    deliveredAt: Date,
    expiresAt: Date,
    retryCount: {
        type: Number,
        default: 0
    },
    maxRetries: {
        type: Number,
        default: 3
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create and send notification
notificationSchema.statics.createNotification = async function(notificationData) {
    const notification = new this(notificationData);
    await notification.save();
    
    // Here you would integrate with your notification service
    // For now, we'll just mark it as sent
    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();
    
    return notification;
};

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
    this.isRead = true;
    this.readAt = new Date();
    this.status = 'read';
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
    return await this.countDocuments({
        recipient: userId,
        isRead: false,
        status: { $in: ['sent', 'delivered'] }
    });
};

// Static method to mark all as read for a user
notificationSchema.statics.markAllAsRead = async function(userId) {
    return await this.updateMany(
        { recipient: userId, isRead: false },
        { 
            isRead: true, 
            readAt: new Date(),
            status: 'read'
        }
    );
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
