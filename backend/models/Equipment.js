const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    id: { type: String }, // Machine ID
    name: { type: String, required: true },
    category: { type: String },
    status: { type: String, enum: ['Good', 'Available', 'Maintenance', 'Damaged', 'Dismantled'], default: 'Good' },
    area: { type: String },
    branchId: { type: String },
    serial: { type: String },
    brand: { type: String },
    mfgYear: { type: String },
    purchaseDate: { type: String },
    warranty: { type: String },
    lastMaintenance: { type: String },
    nextMaintenance: { type: String },
    supplier: { type: String },
    manualUrl: { type: String },
    spareInfo: { type: String },
    desc: { type: String },
    photo: { type: String },
    maintenanceHistory: [{
        date: { type: String },
        description: { type: String },
        cost: { type: Number, default: 0 },
        technician: { type: String }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);
