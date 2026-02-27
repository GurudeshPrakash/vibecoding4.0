const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Load environment variables
dotenv.config();

const app = express();

// Security Middlewares
// 1. Helmet for security headers (configured to allow cross-origin resources)
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false
}));

// 2. Rate Limiting removed as per user request

// 3. CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow any localhost port during development, or pass if no origin (e.g. server-to-server)
        if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' })); // Body limit for security
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Data sanitization against NoSQL query injection
app.use((req, res, next) => {
    ['body', 'params', 'headers', 'query'].forEach((key) => {
        if (req[key]) {
            mongoSanitize.sanitize(req[key]);
        }
    });
    next();
});
// 5. HTTP Parameter Pollution protection
app.use(hpp());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
