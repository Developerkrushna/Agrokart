const mongoose = require('mongoose');

const vendorInventorySchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    reservedStock: {
        type: Number,
        default: 0,
        min: 0
    },
    availableStock: {
        type: Number,
        default: function() {
            return this.stock - this.reservedStock;
        }
    },
    minStockLevel: {
        type: Number,
        default: 10
    },
    maxStockLevel: {
        type: Number,
        default: 1000
    },
    costPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    finalPrice: {
        type: Number,
        default: function() {
            return this.sellingPrice * (1 - this.discountPercentage / 100);
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastRestocked: {
        type: Date,
        default: Date.now
    },
    expiryDate: Date,
    batchNumber: String,
    manufacturingDate: Date,
    supplier: {
        name: String,
        contact: String,
        address: String
    },
    location: {
        warehouse: String,
        section: String,
        shelf: String
    },
    alerts: {
        lowStock: {
            type: Boolean,
            default: false
        },
        nearExpiry: {
            type: Boolean,
            default: false
        },
        outOfStock: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

// Index for efficient queries
vendorInventorySchema.index({ vendor: 1, product: 1 }, { unique: true });
vendorInventorySchema.index({ vendor: 1, isActive: 1 });
vendorInventorySchema.index({ stock: 1 });

// Virtual for profit margin
vendorInventorySchema.virtual('profitMargin').get(function() {
    return ((this.sellingPrice - this.costPrice) / this.costPrice) * 100;
});

// Method to check if stock is low
vendorInventorySchema.methods.isLowStock = function() {
    return this.availableStock <= this.minStockLevel;
};

// Method to check if product is near expiry
vendorInventorySchema.methods.isNearExpiry = function() {
    if (!this.expiryDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return this.expiryDate <= thirtyDaysFromNow;
};

// Method to reserve stock for orders
vendorInventorySchema.methods.reserveStock = function(quantity) {
    if (this.availableStock >= quantity) {
        this.reservedStock += quantity;
        return true;
    }
    return false;
};

// Method to release reserved stock
vendorInventorySchema.methods.releaseStock = function(quantity) {
    this.reservedStock = Math.max(0, this.reservedStock - quantity);
};

// Method to confirm stock usage (after order fulfillment)
vendorInventorySchema.methods.confirmStockUsage = function(quantity) {
    this.stock -= quantity;
    this.reservedStock = Math.max(0, this.reservedStock - quantity);
};

// Pre-save middleware to update alerts
vendorInventorySchema.pre('save', function(next) {
    this.availableStock = this.stock - this.reservedStock;
    this.alerts.lowStock = this.isLowStock();
    this.alerts.nearExpiry = this.isNearExpiry();
    this.alerts.outOfStock = this.availableStock <= 0;
    next();
});

const VendorInventory = mongoose.model('VendorInventory', vendorInventorySchema);

module.exports = VendorInventory;
