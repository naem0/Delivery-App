const express = require('express');
const router = express.Router();
const Rider = require('../models/Rider.model');
const Order = require('../models/Order.model');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const riders = await Rider.find().sort({ isAvailable: -1, name: 1 });
        res.json({ success: true, riders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const rider = await Rider.create(req.body);
        res.status(201).json({ success: true, rider });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', protect, authorize('admin', 'rider'), async (req, res) => {
    try {
        const rider = await Rider.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, rider });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  PUT /api/riders/:id/location
// @desc   Update rider location in real-time
router.put('/:id/location', protect, async (req, res) => {
    try {
        const { lat, lng, orderId } = req.body;
        const rider = await Rider.findByIdAndUpdate(
            req.params.id,
            { currentLocation: { lat, lng, updatedAt: new Date() } },
            { new: true }
        );

        // Broadcast location to customers tracking this order
        const io = req.app.get('io');
        if (io && orderId) {
            io.to(`order_${orderId}`).emit('rider_location', { lat, lng, riderId: req.params.id });
        }

        res.json({ success: true, rider });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
