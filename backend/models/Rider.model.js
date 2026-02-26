const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    zone: { type: String, default: 'Dhaka' },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    totalDeliveries: { type: Number, default: 0 },
    onTimeDeliveries: { type: Number, default: 0 },
    currentLocation: {
        lat: Number,
        lng: Number,
        updatedAt: Date,
    },
    vehicleType: {
        type: String,
        enum: ['bicycle', 'motorbike', 'van'],
        default: 'motorbike',
    },
    profileImage: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Rider', riderSchema);
