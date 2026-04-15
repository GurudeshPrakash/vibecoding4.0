const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photo: { type: String },
    city: { type: String },
    type: { type: String, enum: ['AC', 'Non-AC'], default: 'AC' },
    location: { type: String, required: true },
    contactNumber: { type: String },
    openTime: { type: String, default: '5:00 AM' },
    closeTime: { type: String, default: '10:00 PM' },
    adminName: { type: String },
    adminPhone: { type: String },
    adminEmail: { type: String },
    adminPhoto: { type: String },
    inventory: [{
        name: String,
        quantity: Number,
        condition: String
    }],
    staff: [{
        name: String,
        role: String,
        email: String,
        phone: String,
        photo: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Branch', branchSchema);
