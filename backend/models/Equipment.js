const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    customId: { type: String }, // User-defined Machine ID (e.g. TM-001)
    name: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['Good', 'Maintenance', 'Dismantled'], default: 'Good' },
    area: { type: String, required: true },
    branch: { type: String, required: true },
    serial: { type: String },
    brand: { type: String },
    model: { type: String },
    mfgYear: { type: String },
    origin: { type: String },
    warranty: { type: String },
    maxLoad: { type: String },
    power: { type: String },
    voltage: { type: String },
    usageType: { type: String, default: 'Commercial' },
    photo: { type: String }, // URL to photo
    lastMaintenance: { type: Date },
    nextMaintenance: { type: Date },
    vendor: { type: String },
    totalUsageHours: { type: String, default: '0' },
    boughtDate: { type: Date },
    price: { type: Number, default: 0 },
    maintenanceHistory: [{
        date: { type: Date, default: Date.now },
        description: { type: String },
        cost: { type: Number, default: 0 },
        technician: { type: String }
    }],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);
