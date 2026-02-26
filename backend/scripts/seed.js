const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Category = require('../models/Category.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');

const categories = [
    { nameEn: 'Grocery', nameBn: 'মুদি দোকান', icon: '🛒', sortOrder: 1, isDefault: true, color: '#4F46E5', isVisible: true },
    { nameEn: 'Vegetables', nameBn: 'সবজি', icon: '🥦', sortOrder: 2, isDefault: true, color: '#16A34A', isVisible: true },
    { nameEn: 'Fruits', nameBn: 'ফল', icon: '🍎', sortOrder: 3, isDefault: true, color: '#EA580C', isVisible: true },
    { nameEn: 'Dairy & Eggs', nameBn: 'দুধ ও ডিম', icon: '🥛', sortOrder: 4, isDefault: true, color: '#CA8A04', isVisible: true },
    { nameEn: 'Pharmacy', nameBn: 'ফার্মেসি', icon: '💊', sortOrder: 5, isDefault: true, color: '#DC2626', isVisible: true },
    { nameEn: 'Daily Essentials', nameBn: 'দৈনন্দিন প্রয়োজনীয়', icon: '🏠', sortOrder: 6, isDefault: true, color: '#7C3AED', isVisible: true },
    { nameEn: 'Cleaning', nameBn: 'পরিষ্কার', icon: '🧹', sortOrder: 7, color: '#0891B2', isVisible: true },
    { nameEn: 'Bakery', nameBn: 'বেকারি', icon: '🍞', sortOrder: 8, color: '#B45309', isVisible: true },
    { nameEn: 'Beverages', nameBn: 'পানীয়', icon: '☕', sortOrder: 9, color: '#065F46', isVisible: true },
    { nameEn: 'Personal Care', nameBn: 'ব্যক্তিগত যত্ন', icon: '🧴', sortOrder: 10, color: '#BE185D', isVisible: true },
];

const getProducts = (cats) => {
    const grocery = cats.find(c => c.nameEn === 'Grocery')._id;
    const veg = cats.find(c => c.nameEn === 'Vegetables')._id;
    const fruit = cats.find(c => c.nameEn === 'Fruits')._id;
    const dairy = cats.find(c => c.nameEn === 'Dairy & Eggs')._id;
    const pharma = cats.find(c => c.nameEn === 'Pharmacy')._id;
    const essentials = cats.find(c => c.nameEn === 'Daily Essentials')._id;
    const cleaning = cats.find(c => c.nameEn === 'Cleaning')._id;
    const bakery = cats.find(c => c.nameEn === 'Bakery')._id;
    const bev = cats.find(c => c.nameEn === 'Beverages')._id;
    const care = cats.find(c => c.nameEn === 'Personal Care')._id;

    return [
        // Grains & Rice
        { nameEn: 'Rice', nameBn: 'চাল', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 55, max: 120 }, variations: [{ nameEn: 'Miniket Rice', nameBn: 'মিনিকেট চাল' }, { nameEn: 'Nazirshail Rice', nameBn: 'নাজিরশাইল চাল' }, { nameEn: 'Chinigura Rice', nameBn: 'চিনিগুড়া চাল' }, { nameEn: 'BR28 Rice', nameBn: 'বিআর২৮ চাল' }], tags: ['চাউল', 'rice', 'grain', 'shail'] },
        { nameEn: 'Wheat Flour', nameBn: 'আটা', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 40, max: 65 }, tags: ['flour', 'ata', 'bread flour'] },
        { nameEn: 'All Purpose Flour', nameBn: 'ময়দা', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isBangladeshCommon: true, priceGuide: { min: 45, max: 70 }, tags: ['maida', 'flour', 'moida'] },
        { nameEn: 'Semolina', nameBn: 'সুজি', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isBangladeshCommon: true, priceGuide: { min: 50, max: 80 }, tags: ['suji', 'rava'] },
        { nameEn: 'Flattened Rice', nameBn: 'চিড়া', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isBangladeshCommon: true, priceGuide: { min: 60, max: 90 }, tags: ['chira', 'poha'] },
        { nameEn: 'Puffed Rice', nameBn: 'মুড়ি', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isBangladeshCommon: true, priceGuide: { min: 40, max: 70 }, tags: ['muri', 'murmure'] },

        // Pulses
        { nameEn: 'Red Lentil', nameBn: 'মসুর ডাল', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 100, max: 150 }, tags: ['dal', 'masoor', 'lentil', 'mosur'] },
        { nameEn: 'Green Gram', nameBn: 'মুগ ডাল', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isBangladeshCommon: true, priceGuide: { min: 110, max: 160 }, tags: ['mung', 'moong', 'moog'] },
        { nameEn: 'Chickpeas', nameBn: 'ছোলা', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isBangladeshCommon: true, priceGuide: { min: 90, max: 140 }, tags: ['chola', 'chana'] },
        { nameEn: 'Pea Lentil', nameBn: 'মটর ডাল', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isBangladeshCommon: true, priceGuide: { min: 80, max: 130 }, tags: ['motor dal', 'pea'] },

        // Oils & Spices
        { nameEn: 'Mustard Oil', nameBn: 'সরিষার তেল', categoryId: grocery, unit: 'liter', unitBn: 'লিটার', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 150, max: 250 }, tags: ['shorisha tel', 'oil', 'mustard'] },
        { nameEn: 'Soybean Oil', nameBn: 'সয়াবিন তেল', categoryId: grocery, unit: 'liter', unitBn: 'লিটার', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 160, max: 220 }, tags: ['teel', 'shoyabin', 'cooking oil', 'tel'] },
        { nameEn: 'Turmeric Powder', nameBn: 'হলুদ', categoryId: grocery, unit: 'gram', unitBn: 'গ্রাম', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 20, max: 50 }, tags: ['holud', 'spice', 'haldi'] },
        { nameEn: 'Red Chili Powder', nameBn: 'মরিচের গুঁড়া', categoryId: grocery, unit: 'gram', unitBn: 'গ্রাম', isBangladeshCommon: true, priceGuide: { min: 25, max: 60 }, tags: ['morich', 'chili', 'mirch'] },
        { nameEn: 'Cumin', nameBn: 'জিরা', categoryId: grocery, unit: 'gram', unitBn: 'গ্রাম', isBangladeshCommon: true, priceGuide: { min: 30, max: 80 }, tags: ['jira', 'jeera', 'spice'] },
        { nameEn: 'Salt', nameBn: 'লবণ', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 25, max: 45 }, tags: ['lobon', 'noon', 'namak'] },
        { nameEn: 'Sugar', nameBn: 'চিনি', categoryId: grocery, unit: 'kg', unitBn: 'কেজি', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 110, max: 140 }, tags: ['chini', 'mishti', 'shakkor'] },

        // Vegetables
        { nameEn: 'Potato', nameBn: 'আলু', categoryId: veg, unit: 'kg', unitBn: 'কেজি', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 25, max: 60 }, tags: ['alu', 'batata'] },
        { nameEn: 'Onion', nameBn: 'পেঁয়াজ', categoryId: veg, unit: 'kg', unitBn: 'কেজি', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 30, max: 100 }, tags: ['peyaj', 'peaz', 'onion'] },
        { nameEn: 'Garlic', nameBn: 'রসুন', categoryId: veg, unit: 'kg', unitBn: 'কেজি', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 100, max: 200 }, tags: ['roshun', 'lehsun'] },
        { nameEn: 'Ginger', nameBn: 'আদা', categoryId: veg, unit: 'kg', unitBn: 'কেজি', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 80, max: 180 }, tags: ['ada', 'adarak'] },
        { nameEn: 'Tomato', nameBn: 'টমেটো', categoryId: veg, unit: 'kg', unitBn: 'কেজি', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 40, max: 120 }, tags: ['tomato'] },
        { nameEn: 'Eggplant', nameBn: 'বেগুন', categoryId: veg, unit: 'kg', unitBn: 'কেজি', isBangladeshCommon: true, priceGuide: { min: 30, max: 80 }, tags: ['begun', 'brinjal', 'aubergine'] },
        { nameEn: 'Green Chili', nameBn: 'কাঁচা মরিচ', categoryId: veg, unit: 'kg', unitBn: 'কেজি', isBangladeshCommon: true, priceGuide: { min: 40, max: 150 }, tags: ['kacha morich', 'chili', 'pepper'] },
        { nameEn: 'Bitter Gourd', nameBn: 'করলা', categoryId: veg, unit: 'kg', unitBn: 'কেজি', isBangladeshCommon: true, priceGuide: { min: 40, max: 100 }, tags: ['korola', 'ucche'] },
        { nameEn: 'Bottle Gourd', nameBn: 'লাউ', categoryId: veg, unit: 'piece', unitBn: 'পিস', isBangladeshCommon: true, priceGuide: { min: 20, max: 50 }, tags: ['lau', 'lauki', 'kaddu'] },

        // Dairy
        { nameEn: 'Milk', nameBn: 'দুধ', categoryId: dairy, unit: 'liter', unitBn: 'লিটার', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 70, max: 120 }, tags: ['dudh', 'milk'] },
        { nameEn: 'Eggs', nameBn: 'ডিম', categoryId: dairy, unit: 'dozen', unitBn: 'ডজন', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 130, max: 180 }, tags: ['dim', 'egg', 'hens egg'] },
        { nameEn: 'Butter', nameBn: 'মাখন', categoryId: dairy, unit: 'gram', unitBn: 'গ্রাম', isBangladeshCommon: true, priceGuide: { min: 80, max: 150 }, tags: ['makhan', 'butter'] },
        { nameEn: 'Yogurt', nameBn: 'দই', categoryId: dairy, unit: 'gram', unitBn: 'গ্রাম', isBangladeshCommon: true, priceGuide: { min: 40, max: 100 }, tags: ['doi', 'curd', 'dahi'] },

        // Pharmacy
        { nameEn: 'Paracetamol', nameBn: 'প্যারাসিটামল', categoryId: pharma, unit: 'strip', unitBn: 'স্ট্রিপ', isPopular: true, priceGuide: { min: 15, max: 30 }, tags: ['napa', 'ace', 'fever', 'medicine'] },
        { nameEn: 'Oral Saline', nameBn: 'স্যালাইন', categoryId: pharma, unit: 'piece', unitBn: 'প্যাকেট', isBangladeshCommon: true, priceGuide: { min: 10, max: 20 }, tags: ['saline', 'ors'] },
        { nameEn: 'Bandage', nameBn: 'ব্যান্ডেজ', categoryId: pharma, unit: 'piece', unitBn: 'পিস', priceGuide: { min: 20, max: 60 }, tags: ['bandage', 'wound'] },
        { nameEn: 'Vitamin C', nameBn: 'ভিটামিন সি', categoryId: pharma, unit: 'strip', unitBn: 'স্ট্রিপ', priceGuide: { min: 30, max: 80 }, tags: ['vitamin', 'c', 'supplement'] },

        // Cleaning
        { nameEn: 'Soap', nameBn: 'সাবান', categoryId: cleaning, unit: 'piece', unitBn: 'পিস', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 20, max: 60 }, tags: ['shaban', 'body soap', 'bathing'] },
        { nameEn: 'Detergent Powder', nameBn: 'ডিটারজেন্ট', categoryId: cleaning, unit: 'kg', unitBn: 'কেজি', isBangladeshCommon: true, priceGuide: { min: 80, max: 180 }, tags: ['washing powder', 'surf', 'wheel', 'kapor'] },
        { nameEn: 'Dish Wash', nameBn: 'বাসন মাজার সাবান', categoryId: cleaning, unit: 'piece', unitBn: 'পিস', isBangladeshCommon: true, priceGuide: { min: 30, max: 80 }, tags: ['vim', 'dish soap', 'bason'] },
        { nameEn: 'Mosquito Coil', nameBn: 'মশার কয়েল', categoryId: cleaning, unit: 'pack', unitBn: 'প্যাক', isBangladeshCommon: true, priceGuide: { min: 30, max: 70 }, tags: ['mosha', 'coil', 'mosquito'] },

        // Beverages
        { nameEn: 'Tea', nameBn: 'চা', categoryId: bev, unit: 'gram', unitBn: 'গ্রাম', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 80, max: 250 }, tags: ['cha', 'tea', 'black tea'] },
        { nameEn: 'Nescafe', nameBn: 'নেসক্যাফে', categoryId: bev, unit: 'gram', unitBn: 'গ্রাম', priceGuide: { min: 150, max: 400 }, tags: ['coffee', 'instant coffee'] },
        { nameEn: 'Horlicks', nameBn: 'হরলিক্স', categoryId: bev, unit: 'gram', unitBn: 'গ্রাম', priceGuide: { min: 200, max: 600 }, tags: ['malt', 'health drink', 'supplement'] },

        // Bakery
        { nameEn: 'Bread', nameBn: 'পাউরুটি', categoryId: bakery, unit: 'piece', unitBn: 'পিস', isPopular: true, isBangladeshCommon: true, priceGuide: { min: 35, max: 60 }, tags: ['toast', 'loaf', 'pau ruti'] },
        { nameEn: 'Biscuit', nameBn: 'বিস্কিট', categoryId: bakery, unit: 'pack', unitBn: 'প্যাক', isBangladeshCommon: true, priceGuide: { min: 25, max: 80 }, tags: ['cookie', 'cracker'] },

        // Personal Care
        { nameEn: 'Shampoo', nameBn: 'শ্যাম্পু', categoryId: care, unit: 'ml', unitBn: 'মিলি', isBangladeshCommon: true, priceGuide: { min: 80, max: 300 }, tags: ['hair wash', 'shampu'] },
        { nameEn: 'Toothpaste', nameBn: 'টুথপেস্ট', categoryId: care, unit: 'piece', unitBn: 'পিস', isBangladeshCommon: true, priceGuide: { min: 50, max: 180 }, tags: ['paste', 'dental', 'dant majan'] },
        { nameEn: 'Body Wash', nameBn: 'বডি ওয়াশ', categoryId: care, unit: 'ml', unitBn: 'মিলি', priceGuide: { min: 100, max: 350 }, tags: ['shower gel', 'ghusel'] },
        { nameEn: 'Lotion', nameBn: 'লোশন', categoryId: care, unit: 'ml', unitBn: 'মিলি', priceGuide: { min: 80, max: 300 }, tags: ['moisturizer', 'skin cream'] },
    ];
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickdeli');
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing categories and products');

        // Seed categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ Seeded ${createdCategories.length} categories`);

        // Seed products
        const products = getProducts(createdCategories);
        const createdProducts = await Product.insertMany(products);
        console.log(`✅ Seeded ${createdProducts.length} Bangladesh common products`);

        // Create default admin user
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            await User.create({
                phone: '01700000000',
                name: 'QuickDeli Admin',
                role: 'admin',
                isVerified: true,
                isActive: true,
            });
            console.log('✅ Created default admin (phone: 01700000000)');
        }

        console.log('\n🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedDB();
