const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const adminRoutes = require('./routes/adminRoutes');
const staffRoutes = require('./routes/staffRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const sharedRoutes = require('./routes/sharedRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/shared', sharedRoutes);

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
