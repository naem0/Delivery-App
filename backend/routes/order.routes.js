const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const { protect, authorize } = require('../middleware/auth.middleware');

// @route  POST /api/orders
// @desc   Place a new order
router.post('/', protect, async (req, res) => {
    try {
        const { items, deliveryAddress, addressId, paymentMethod, specialInstructions } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Order must have at least one item' });
        }

        // Calculate subtotal (estimate)
        let subtotal = 0;
        const processedItems = items.map(item => {
            subtotal += (item.priceEstimate || 0) * item.quantity;
            return {
                ...item,
                isCustom: !item.productId,
            };
        });

        const deliveryCharge = 40; // Base delivery charge (can be dynamic later)
        const total = subtotal + deliveryCharge;

        const order = await Order.create({
            userId: req.user._id,
            addressId,
            deliveryAddress,
            items: processedItems,
            subtotal,
            deliveryCharge,
            total,
            paymentMethod: paymentMethod || 'cod',
            specialInstructions,
            statusHistory: [{ status: 'placed', timestamp: new Date() }],
        });

        // Increment order count for products
        for (const item of items) {
            if (item.productId) {
                await Product.findByIdAndUpdate(item.productId, { $inc: { orderCount: 1 } });
            }
        }

        // Emit real-time event to admin
        const io = req.app.get('io');
        if (io) {
            io.emit('new_order', { orderId: order._id, orderNumber: order.orderNumber });
        }

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/orders
// @desc   Get user's orders
router.get('/', protect, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = { userId: req.user._id };
        if (status) query.status = status;

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('riderId', 'name phone currentLocation');

        const total = await Order.countDocuments(query);

        res.json({ success: true, orders, total, page: parseInt(page) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/orders/:id
// @desc   Get order by ID (with real-time tracking info)
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('riderId', 'name phone currentLocation vehicleType rating')
            .populate('userId', 'name phone');

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        // Only allow owner or admin to view
        if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  PUT /api/orders/:id/status
// @desc   Update order status (Admin/Rider only)
router.put('/:id/status', protect, authorize('admin', 'rider'), async (req, res) => {
    try {
        const { status, note } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.status = status;
        order.statusHistory.push({ status, timestamp: new Date(), note });

        if (status === 'delivered') {
            order.deliveredAt = new Date();
            order.paymentStatus = order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus;
        }

        await order.save();

        // Emit real-time status update to customer
        const io = req.app.get('io');
        if (io) {
            io.to(`order_${order._id}`).emit('order_status_update', {
                orderId: order._id,
                status: order.status,
                statusHistory: order.statusHistory,
            });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  PUT /api/orders/:id/cancel
// @desc   Cancel order
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (['delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
        }

        // Only owner or admin can cancel
        if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        order.status = 'cancelled';
        order.cancelReason = reason;
        order.statusHistory.push({ status: 'cancelled', timestamp: new Date(), note: reason });
        await order.save();

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
