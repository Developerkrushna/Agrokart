const mongoose = require('mongoose');

const deliveryAssignmentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['assigned', 'accepted', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled'],
        default: 'assigned'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    pickupLocation: {
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String
        },
        coordinates: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: [Number] // [longitude, latitude]
        },
        contactPerson: String,
        contactPhone: String
    },
    deliveryLocation: {
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String
        },
        coordinates: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: [Number] // [longitude, latitude]
        },
        contactPerson: String,
        contactPhone: String
    },
    scheduledPickupTime: Date,
    actualPickupTime: Date,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    distance: {
        type: Number, // in kilometers
        default: 0
    },
    estimatedDuration: {
        type: Number, // in minutes
        default: 0
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    tips: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: function() {
            return this.deliveryFee + this.tips;
        }
    },
    route: {
        waypoints: [{
            coordinates: [Number],
            timestamp: Date,
            address: String
        }],
        optimizedRoute: String, // JSON string of optimized route
        totalDistance: Number,
        totalDuration: Number
    },
    proofOfPickup: {
        photos: [String],
        signature: String,
        timestamp: Date,
        notes: String
    },
    proofOfDelivery: {
        photos: [String],
        signature: String,
        timestamp: Date,
        notes: String,
        receivedBy: String,
        otp: String
    },
    tracking: {
        currentLocation: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: [Number]
        },
        lastUpdated: Date,
        speed: Number, // km/h
        heading: Number // degrees
    },
    issues: [{
        type: {
            type: String,
            enum: ['customer_unavailable', 'wrong_address', 'damaged_goods', 'payment_issue', 'vehicle_breakdown', 'other']
        },
        description: String,
        reportedAt: Date,
        resolvedAt: Date,
        resolution: String
    }],
    feedback: {
        customerRating: {
            type: Number,
            min: 1,
            max: 5
        },
        customerComments: String,
        vendorRating: {
            type: Number,
            min: 1,
            max: 5
        },
        vendorComments: String,
        deliveryPartnerComments: String
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    acceptedAt: Date,
    completedAt: Date
}, {
    timestamps: true
});

// Indexes for efficient queries
deliveryAssignmentSchema.index({ deliveryPartner: 1, status: 1 });
deliveryAssignmentSchema.index({ order: 1 });
deliveryAssignmentSchema.index({ vendor: 1, status: 1 });
deliveryAssignmentSchema.index({ customer: 1 });
deliveryAssignmentSchema.index({ 'pickupLocation.coordinates': '2dsphere' });
deliveryAssignmentSchema.index({ 'deliveryLocation.coordinates': '2dsphere' });
deliveryAssignmentSchema.index({ 'tracking.currentLocation': '2dsphere' });

// Virtual for delivery duration
deliveryAssignmentSchema.virtual('deliveryDuration').get(function() {
    if (this.actualPickupTime && this.actualDeliveryTime) {
        return Math.round((this.actualDeliveryTime - this.actualPickupTime) / (1000 * 60)); // in minutes
    }
    return null;
});

// Method to calculate distance between pickup and delivery
deliveryAssignmentSchema.methods.calculateDistance = function() {
    if (this.pickupLocation.coordinates.coordinates.length === 2 && 
        this.deliveryLocation.coordinates.coordinates.length === 2) {
        
        const [lon1, lat1] = this.pickupLocation.coordinates.coordinates;
        const [lon2, lat2] = this.deliveryLocation.coordinates.coordinates;
        
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        this.distance = R * c;
        return this.distance;
    }
    return 0;
};

// Method to update tracking location
deliveryAssignmentSchema.methods.updateLocation = function(coordinates, speed = 0, heading = 0) {
    this.tracking.currentLocation.coordinates = coordinates;
    this.tracking.lastUpdated = new Date();
    this.tracking.speed = speed;
    this.tracking.heading = heading;
};

// Method to check if delivery is overdue
deliveryAssignmentSchema.methods.isOverdue = function() {
    if (this.estimatedDeliveryTime && this.status !== 'delivered') {
        return new Date() > this.estimatedDeliveryTime;
    }
    return false;
};

const DeliveryAssignment = mongoose.model('DeliveryAssignment', deliveryAssignmentSchema);

module.exports = DeliveryAssignment;
