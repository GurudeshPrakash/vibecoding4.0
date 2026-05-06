const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
    memberId: {
        type: String,
        required: true
    },
    memberName: {
        type: String,
        required: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    action: {
        type: String,
        enum: ['Check In', 'Check Out'],
        required: true
    },
    method: {
        type: String,
        enum: ['QR Code', 'RFID', 'Manual'],
        default: 'Manual'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CheckIn', checkInSchema);
