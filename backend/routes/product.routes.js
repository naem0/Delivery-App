const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const { protect, authorize } = require('../middleware/auth.middleware');

// @route  GET /api/products
// @desc   Get all active products (with search/filter)
router.get('/', async (req, res) => {
    try {
        const { search, category, popular, limit = 20, page = 1 } = req.query;
        const query = { isActive: true };

        if (category) query.categoryId = category;
        if (popular === 'true') query.isPopular = true;

        if (search) {
            query.$or = [
                { nameEn: { $regex: search, $options: 'i' } },
                { nameBn: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
                { 'variations.nameEn': { $regex: search, $options: 'i' } },
                { 'variations.nameBn': { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const products = await Product.find(query)
            .populate('categoryId', 'nameEn nameBn icon')
            .sort({ isPopular: -1, orderCount: -1, nameEn: 1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            count: products.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/products/suggestions
// @desc   Auto-suggest products by search query (for custom order)
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 1) return res.json({ success: true, suggestions: [] });

        const products = await Product.find({
            isActive: true,
            $or: [
                { nameEn: { $regex: q, $options: 'i' } },
                { nameBn: { $regex: q, $options: 'i' } },
                { 'variations.nameEn': { $regex: q, $options: 'i' } },
                { 'variations.nameBn': { $regex: q, $options: 'i' } },
                { tags: { $regex: q, $options: 'i' } },
            ],
        })
            .select('nameEn nameBn unit unitBn variations categoryId priceGuide')
            .populate('categoryId', 'nameEn nameBn')
            .limit(10)
            .sort({ orderCount: -1 });

        res.json({ success: true, suggestions: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/products/:id
// @desc   Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryId', 'nameEn nameBn');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  POST /api/products
// @desc   Create product (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  PUT /api/products/:id
// @desc   Update product (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  DELETE /api/products/:id
// @desc   Delete product (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
