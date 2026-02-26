const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    label: {
        type: String,
        enum: ['home', 'office', 'other'],
        default: 'home',
    },
    addressText: {
        type: String,
        required: true,
    },
    lat: Number,
    lng: Number,
    isDefault: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Address', addressSchema);
