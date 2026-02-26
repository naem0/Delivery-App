const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    productNameEn: { type: String, required: true },
    productNameBn: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true },
    unitBn: String,
    shopPreference: String,
    priceEstimate: { type: Number, default: 0 },
    isCustom: { type: Boolean, default: false }, // user typed custom product name
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    deliveryAddress: {
        text: String,
        lat: Number,
        lng: Number,
    },
    items: [orderItemSchema],
    status: {
        type: String,
        enum: ['placed', 'processing', 'on_the_way', 'almost_there', 'delivered', 'cancelled'],
        default: 'placed',
    },
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
    }],
    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rider',
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
    subtotal: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 40 },
    total: { type: Number, default: 0 },
    paymentMethod: {
        type: String,
        enum: ['cod', 'bkash', 'nagad', 'card'],
        default: 'cod',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending',
    },
    specialInstructions: String,
    cancelReason: String,
    estimatedDeliveryTime: Date,
    deliveredAt: Date,
    riderLocation: {
        lat: Number,
        lng: Number,
        updatedAt: Date,
    },
}, {
    timestamps: true,
});

// Auto-generate order number
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await this.constructor.countDocuments();
        this.orderNumber = `QD${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
