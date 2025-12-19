const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'rejected', 'preparing', 'ready'],
            default: 'pending'
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: {
            type: { type: String, default: 'Point' },
            coordinates: [Number] // [longitude, latitude]
        }
    },
    deliverySlot: {
        date: {
            type: Date,
            required: true
        },
        timeSlot: {
            type: String,
            required: true,
            enum: ['morning', 'afternoon', 'evening']
        }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'upi', 'card']
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    trackingNumber: {
        type: String,
        unique: true
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    notes: String
}, {
    timestamps: true
});

// Index for geospatial queries
orderSchema.index({ 'deliveryAddress.coordinates': '2dsphere' });

// Method to calculate total amount
orderSchema.methods.calculateTotal = function() {
    this.totalAmount = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    return this.save();
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
    return ['pending', 'confirmed', 'processing'].includes(this.orderStatus);
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 