const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userType: {
        type: String,
        enum: ['vendor', 'delivery_partner'],
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    deliveryAssignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryAssignment'
    },
    transactionType: {
        type: String,
        enum: ['sale', 'delivery', 'commission', 'bonus', 'penalty', 'refund'],
        required: true
    },
    grossAmount: {
        type: Number,
        required: true
    },
    commissionRate: {
        type: Number,
        default: 0 // percentage
    },
    commissionAmount: {
        type: Number,
        default: 0
    },
    taxRate: {
        type: Number,
        default: 0 // percentage
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    deductions: {
        platformFee: { type: Number, default: 0 },
        processingFee: { type: Number, default: 0 },
        penalty: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    netAmount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['pending', 'processed', 'paid', 'failed', 'disputed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['bank_transfer', 'upi', 'wallet', 'cash'],
        default: 'bank_transfer'
    },
    paymentDetails: {
        transactionId: String,
        paymentDate: Date,
        bankReference: String,
        upiId: String
    },
    period: {
        year: Number,
        month: Number,
        week: Number,
        day: Number
    },
    description: String,
    metadata: {
        productsSold: Number,
        deliveriesCompleted: Number,
        customerRating: Number,
        bonusEligible: Boolean
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
earningsSchema.index({ user: 1, userType: 1 });
earningsSchema.index({ user: 1, status: 1 });
earningsSchema.index({ order: 1 });
earningsSchema.index({ 'period.year': 1, 'period.month': 1 });
earningsSchema.index({ transactionType: 1 });
earningsSchema.index({ createdAt: -1 });

// Virtual for total deductions
earningsSchema.virtual('totalDeductions').get(function() {
    return this.deductions.platformFee + 
           this.deductions.processingFee + 
           this.deductions.penalty + 
           this.deductions.other;
});

// Pre-save middleware to calculate net amount and period
earningsSchema.pre('save', function(next) {
    // Calculate commission amount
    this.commissionAmount = (this.grossAmount * this.commissionRate) / 100;
    
    // Calculate tax amount
    this.taxAmount = (this.grossAmount * this.taxRate) / 100;
    
    // Calculate net amount
    this.netAmount = this.grossAmount - 
                     this.commissionAmount - 
                     this.taxAmount - 
                     this.totalDeductions;
    
    // Set period information
    const date = this.createdAt || new Date();
    this.period.year = date.getFullYear();
    this.period.month = date.getMonth() + 1;
    this.period.week = Math.ceil(date.getDate() / 7);
    this.period.day = date.getDate();
    
    next();
});

// Static method to get earnings summary for a user
earningsSchema.statics.getEarningsSummary = async function(userId, userType, period = {}) {
    const matchQuery = { user: userId, userType: userType };
    
    if (period.year) matchQuery['period.year'] = period.year;
    if (period.month) matchQuery['period.month'] = period.month;
    
    const summary = await this.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: null,
                totalGross: { $sum: '$grossAmount' },
                totalNet: { $sum: '$netAmount' },
                totalCommission: { $sum: '$commissionAmount' },
                totalTax: { $sum: '$taxAmount' },
                totalDeductions: { $sum: '$totalDeductions' },
                transactionCount: { $sum: 1 },
                pendingAmount: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'pending'] }, '$netAmount', 0]
                    }
                },
                paidAmount: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'paid'] }, '$netAmount', 0]
                    }
                }
            }
        }
    ]);
    
    return summary[0] || {
        totalGross: 0,
        totalNet: 0,
        totalCommission: 0,
        totalTax: 0,
        totalDeductions: 0,
        transactionCount: 0,
        pendingAmount: 0,
        paidAmount: 0
    };
};

// Static method to get monthly earnings trend
earningsSchema.statics.getMonthlyTrend = async function(userId, userType, year) {
    return await this.aggregate([
        {
            $match: {
                user: userId,
                userType: userType,
                'period.year': year
            }
        },
        {
            $group: {
                _id: '$period.month',
                totalGross: { $sum: '$grossAmount' },
                totalNet: { $sum: '$netAmount' },
                transactionCount: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

// Method to mark as paid
earningsSchema.methods.markAsPaid = function(paymentDetails) {
    this.status = 'paid';
    this.paymentDetails = {
        ...this.paymentDetails,
        ...paymentDetails,
        paymentDate: new Date()
    };
};

const Earnings = mongoose.model('Earnings', earningsSchema);

module.exports = Earnings;
