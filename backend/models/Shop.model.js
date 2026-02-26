const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nameBn: { type: String },
    area: { type: String, required: true },
    phone: String,
    address: String,
    location: { lat: Number, lng: Number },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    isActive: { type: Boolean, default: true },
    openTime: { type: String, default: '08:00' },
    closeTime: { type: String, default: '22:00' },
    image: String,
    rating: { type: Number, default: 5 },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Shop', shopSchema);
