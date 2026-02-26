const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Address = require('../models/Address.model');
const { protect } = require('../middleware/auth.middleware');

// @route  PUT /api/users/profile
// @desc   Update user profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, email, preferredLanguage, theme } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, preferredLanguage, theme },
            { new: true, runValidators: true }
        );
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/users/addresses
// @desc   Get user addresses
router.get('/addresses', protect, async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.user._id });
        res.json({ success: true, addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  POST /api/users/addresses
// @desc   Add new address
router.post('/addresses', protect, async (req, res) => {
    try {
        const { label, addressText, lat, lng, isDefault } = req.body;

        // If setting as default, unset other defaults
        if (isDefault) {
            await Address.updateMany({ userId: req.user._id }, { isDefault: false });
        }

        const address = await Address.create({
            userId: req.user._id,
            label,
            addressText,
            lat,
            lng,
            isDefault: isDefault || false,
        });
        res.status(201).json({ success: true, address });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  DELETE /api/users/addresses/:id
// @desc   Delete address
router.delete('/addresses/:id', protect, async (req, res) => {
    try {
        await Address.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ success: true, message: 'Address deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
