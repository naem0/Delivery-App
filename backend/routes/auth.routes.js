const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { protect } = require('../middleware/auth.middleware');

// @route  POST /api/auth/register
// @desc   Register new user with phone, password, name (email optional)
// @access Public
router.post('/register', async (req, res) => {
    try {
        const { phone, password, name, email } = req.body;
        if (!phone) return res.status(400).json({ success: false, message: 'Phone number is required' });
        if (!password || password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        if (!name || name.trim().length < 2) return res.status(400).json({ success: false, message: 'Name is required (min 2 characters)' });

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'This phone number is already registered. Please login.' });
        }

        const user = await User.create({
            phone,
            password,
            name: name.trim(),
            email: email ? email.trim().toLowerCase() : '',
            isVerified: true, // auto-verified on registration
        });

        const token = user.getSignedToken();

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                _id: user._id,
                phone: user.phone,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                preferredLanguage: user.preferredLanguage,
                theme: user.theme,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  POST /api/auth/login
// @desc   Login with phone + password
// @access Public
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).json({ success: false, message: 'Phone and password are required' });
        }

        const user = await User.findOne({ phone }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid phone number or password' });
        }

        if (!user.password) {
            return res.status(401).json({ success: false, message: 'No password set. Please register first.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid phone number or password' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' });
        }

        const token = user.getSignedToken();

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                phone: user.phone,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                preferredLanguage: user.preferredLanguage,
                theme: user.theme,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route  GET /api/auth/me
// @desc   Get current logged-in user
// @access Private
router.get('/me', protect, async (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = router;
