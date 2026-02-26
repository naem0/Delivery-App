const express = require('express');
const router = express.Router();
const Category = require('../models/Category.model');
const { protect, authorize } = require('../middleware/auth.middleware');

// @route  GET /api/categories
// @desc   Get all visible categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isVisible: true }).sort('sortOrder');
        res.json({ success: true, count: categories.length, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/categories/:id
// @desc   Get single category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  POST /api/categories
// @desc   Create category (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  PUT /api/categories/:id
// @desc   Update category (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  DELETE /api/categories/:id
// @desc   Delete category (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
