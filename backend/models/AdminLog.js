const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    loginTimestamp: { type: Date, required: true },
    logoutTimestamp: { type: Date },
    status: { type: String, enum: ['Active', 'Ended'], default: 'Active' },
    systemSource: { type: String, default: 'Admin Login' }
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
