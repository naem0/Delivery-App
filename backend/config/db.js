const mongoose = require('mongoose');

// Cache the database connection in the global scope 
// so it doesn't get created multiple times in Vercel.
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Don't buffer operations on timeout
            serverSelectionTimeoutMS: 10000,
        };

        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickdeli';

        cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
            console.log(`✅ MongoDB Connected`);
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error(`❌ MongoDB connection error:`, e.message);
        throw e;
    }

    return cached.conn;
};

module.exports = connectDB;
