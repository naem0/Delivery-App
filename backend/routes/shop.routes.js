const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop.model');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
    try {
        const shops = await Shop.find({ isActive: true }).populate('categories', 'nameEn nameBn');
        res.json({ success: true, shops });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const shop = await Shop.create(req.body);
        res.status(201).json({ success: true, shop });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, shop });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await Shop.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Shop deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
