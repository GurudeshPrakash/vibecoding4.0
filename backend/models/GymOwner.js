const mongoose = require('mongoose');

const gymOwnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    ownedGym: { type: String }, // Can be an ID later
    location: { type: String },
    partnerSince: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    photo: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GymOwner', gymOwnerSchema);
