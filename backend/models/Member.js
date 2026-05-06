const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    subscriptionType: { type: String, enum: ['Monthly', 'Quarterly', 'Annual'], default: 'Monthly' },
    status: { type: String, enum: ['Active', 'Expired', 'Paused'], default: 'Active' },
    enrollDate: { type: Date, default: Date.now },
    expireDate: { type: Date },
    profilePhoto: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', memberSchema);
