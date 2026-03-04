const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    staffName: { type: String, required: true },
    staffEmail: { type: String, required: true },
    branch: { type: String, required: true },
    loginTimestamp: { type: Date, required: true },
    logoutTimestamp: { type: Date },
    status: { type: String, enum: ['Active', 'Ended'], default: 'Active' },
    systemSource: { type: String, default: 'Staff Login' }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
