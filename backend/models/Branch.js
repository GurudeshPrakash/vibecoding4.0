const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photo: { type: String },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    adminName: { type: String },
    adminPhone: { type: String },
    runningSince: { type: String },
    operatingHours: { type: String, default: '24 Hours' },
    inventorySummary: [{
        item: String,
        count: Number,
        condition: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Branch', branchSchema);
