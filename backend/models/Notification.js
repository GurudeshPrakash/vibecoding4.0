const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: { type: String, enum: ['Login', 'Logout', 'Inventory'], required: true },
    recipientRole: { type: String, enum: ['admin', 'staff'], default: 'admin' },
    recipientId: { type: mongoose.Schema.Types.ObjectId }, // Can be Staff ID if recipientRole is 'staff'
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    staffName: { type: String, required: true },
    staffEmail: { type: String, required: true },
    branch: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    activityLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityLog' },
    isRead: { type: Boolean, default: false },
    message: { type: String }, // Flexible message for different notifications
    systemSource: { type: String, default: 'Staff activity' }
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
