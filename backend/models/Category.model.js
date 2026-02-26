const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
    icon: {
        type: String,
        default: '🛒',
    },
    image: String,
    sortOrder: {
        type: Number,
        default: 0,
    },
    isVisible: {
        type: Boolean,
        default: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: '#4F46E5',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Category', categorySchema);
