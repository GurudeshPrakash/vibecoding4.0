const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const adminRoutes = require('./routes/adminRoutes.js');
const checkInRoutes = require('./routes/checkInRoutes.js');
const equipmentRoutes = require('./routes/equipmentRoutes.js');
const memberRoutes = require('./routes/memberRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const sharedRoutes = require('./routes/sharedRoutes.js');
const staffRoutes = require('./routes/staffRoutes.js');

app.use('/api/admin', adminRoutes);
app.use('/api/checkins', checkInRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/shared', sharedRoutes);
app.use('/api/staff', staffRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('Gym Equipment Inventory Management System API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle errors
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
