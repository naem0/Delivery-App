const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Rider = require('../models/Rider.model');
const { protect, authorize } = require('../middleware/auth.middleware');

// All admin routes require admin role
router.use(protect, authorize('admin'));

// @route  GET /api/admin/dashboard
// @desc   Get dashboard summary stats
router.get('/dashboard', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            totalOrders,
            todayOrders,
            activeOrders,
            totalCustomers,
            totalRiders,
            availableRiders,
            recentOrders,
        ] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ createdAt: { $gte: today } }),
            Order.countDocuments({ status: { $in: ['placed', 'processing', 'on_the_way', 'almost_there'] } }),
            User.countDocuments({ role: 'customer' }),
            Rider.countDocuments(),
            Rider.countDocuments({ isAvailable: true }),
            Order.find().sort({ createdAt: -1 }).limit(10)
                .populate('userId', 'name phone')
                .populate('riderId', 'name'),
        ]);

        // Revenue calculation
        const revenueResult = await Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        res.json({
            success: true,
            stats: {
                totalOrders,
                todayOrders,
                activeOrders,
                totalCustomers,
                totalRiders,
                availableRiders,
                totalRevenue,
                deliveredOrders: revenueResult[0]?.count || 0,
            },
            recentOrders,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/admin/orders
// @desc   Get all orders (Admin)
router.get('/orders', async (req, res) => {
    try {
        const { status, page = 1, limit = 20, search } = req.query;
        const query = {};
        if (status) query.status = status;

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('userId', 'name phone')
            .populate('riderId', 'name phone');

        const total = await Order.countDocuments(query);
        res.json({ success: true, orders, total });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/admin/customers
// @desc   Get all customers
router.get('/customers', async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
        res.json({ success: true, customers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  PATCH /api/admin/customers/:id/toggle
// @desc   Block/unblock customer
router.patch('/customers/:id/toggle', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.isActive = !user.isActive;
        await user.save();
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/admin/categories
// @desc   Get all categories (Admin)
router.get('/categories', async (req, res) => {
    try {
        const categories = await require('../models/Category.model').find().sort('sortOrder');
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/admin/products
// @desc   Get all products (Admin)
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().populate('categoryId', 'nameBn nameEn').sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/admin/shops
// @desc   Get all shops (Admin)
router.get('/shops', async (req, res) => {
    try {
        const shops = await require('../models/Shop.model').find().populate('categories', 'nameEn nameBn');
        res.json({ success: true, shops });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/admin/reports/popular-products
// @desc   Get most popular products
router.get('/reports/popular-products', async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .sort({ orderCount: -1 })
            .limit(20)
            .populate('categoryId', 'nameEn nameBn');
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
