const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google DNS internally to bypass local network SRV blocks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const setupTestUsers = require('../scripts/setupTestUsers');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.warn('WARNING: MONGODB_URI is not defined. Server will run in OFFLINE mode (no DB functionality).');
            return;
        }
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Setup permanent development testing users and structure
        await setupTestUsers();

    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        console.warn('WARNING: Server is running without a database connection.');
        // Don't kill the server during development
    }
};

module.exports = connectDB;