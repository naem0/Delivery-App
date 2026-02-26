const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nameEn: {
        type: String,
        required: true,
        trim: true,
    },
    nameBn: {
        type: String,
        required: true,
        trim: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    // Common variations (e.g., Miniket, Nazirshail for Rice)
    variations: [{
        nameEn: String,
        nameBn: String,
    }],
    unit: {
        type: String,
        enum: ['kg', 'liter', 'piece', 'dozen', 'gram', 'ml', 'pack', 'strip', 'hali'],
        default: 'piece',
    },
    unitBn: {
        type: String,
        default: 'পিস',
    },
    priceGuide: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
    },
    image: String,
    isPopular: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isBangladeshCommon: {
        type: Boolean,
        default: false,
    },
    // How many times ordered (for auto-suggest popularity)
    orderCount: {
        type: Number,
        default: 0,
    },
    tags: [String],
}, {
    timestamps: true,
});

// Text index for fuzzy search
productSchema.index({ nameEn: 'text', nameBn: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
