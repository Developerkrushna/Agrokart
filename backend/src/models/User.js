const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false
    },
    firebaseUid: {
        type: String,
        sparse: true,
        index: true
    },
    role: {
        type: String,
        enum: ['customer', 'vendor', 'delivery_partner', 'admin'],
        default: 'customer'
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        }
    },
    landDetails: {
        totalArea: Number, // in acres
        crops: [{
            name: String,
            area: Number // in acres
        }]
    },
    vendorProfile: {
        businessName: String,
        businessType: {
            type: String,
            enum: ['fertilizer_supplier', 'seed_supplier', 'equipment_supplier', 'general_agriculture']
        },
        gstNumber: String,
        businessLicense: String,
        bankDetails: {
            accountNumber: String,
            ifscCode: String,
            accountHolderName: String,
            bankName: String
        },
        serviceAreas: [{
            state: String,
            districts: [String],
            pincodes: [String]
        }],
        documents: {
            gstCertificate: String,
            businessLicense: String,
            panCard: String,
            addressProof: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationStatus: {
            type: String,
            enum: ['pending', 'under_review', 'verified', 'rejected'],
            default: 'pending'
        },
        rating: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        },
        commissionRate: {
            type: Number,
            default: 10 // percentage
        }
    },
    deliveryProfile: {
        vehicleType: {
            type: String,
            enum: ['bike', 'auto', 'van', 'truck']
        },
        vehicleNumber: String,
        licenseNumber: String,
        aadharNumber: String,
        serviceRadius: {
            type: Number,
            default: 10 // in kilometers
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        currentLocation: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        },
        documents: {
            drivingLicense: String,
            vehicleRC: String,
            aadharCard: String,
            photo: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationStatus: {
            type: String,
            enum: ['pending', 'under_review', 'verified', 'rejected'],
            default: 'pending'
        },
        rating: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        },
        earnings: {
            total: { type: Number, default: 0 },
            thisMonth: { type: Number, default: 0 },
            lastPayout: Date
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for geospatial queries
userSchema.index({ 'address.coordinates': '2dsphere' });

// Method to check if user is admin
userSchema.methods.isAdmin = function() {
    return this.role === 'admin';
};

// Method to check if user is vendor
userSchema.methods.isVendor = function() {
    return this.role === 'vendor';
};

// Method to check if user is delivery partner
userSchema.methods.isDeliveryPartner = function() {
    return this.role === 'delivery_partner';
};

// Method to check if user is customer
userSchema.methods.isCustomer = function() {
    return this.role === 'customer';
};

const User = mongoose.model('User', userSchema);

module.exports = User;