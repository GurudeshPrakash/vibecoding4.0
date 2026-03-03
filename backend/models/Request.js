const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    type: { type: String, enum: ['Dismantle'], default: 'Dismantle' },
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    equipmentName: { type: String, required: true },
    equipmentCustomId: { type: String },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    staffName: { type: String, required: true },
    branch: { type: String, required: true },
    reason: { type: String },
    // Report Snapshot Fields
    equipmentType: { type: String },
    boughtDate: { type: Date },
    maintenanceCount: { type: Number, default: 0 },
    lastMaintenance: { type: Date },
    price: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    adminComment: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Request || mongoose.model('Request', requestSchema);
