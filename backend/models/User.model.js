const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        match: [/^(\+880|880|0)?1[3-9]\d{8}$/, 'Please enter a valid Bangladeshi phone number'],
    },
    name: {
        type: String,
        trim: true,
        default: '',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: '',
    },
    password: {
        type: String,
        select: false,
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'rider'],
        default: 'customer',
    },
    otp: {
        code: String,
        expiresAt: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    preferredLanguage: {
        type: String,
        enum: ['bn', 'en'],
        default: 'bn',
    },
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
    },
    fcmToken: String,
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET || 'quickdeli_secret',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
};

// Generate OTP
userSchema.methods.generateOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = {
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    };
    return otp;
};

module.exports = mongoose.model('User', userSchema);
