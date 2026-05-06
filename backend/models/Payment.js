const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    memberId: {
        type: String, // Or mongoose.Schema.Types.ObjectId if we link to Member
        required: true
    },
    memberName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Registration', 'Other'],
        required: true
    },
    method: {
        type: String,
        enum: ['Cash', 'Card', 'Online Transfer'],
        required: true
    },
    status: {
        type: String,
        enum: ['Completed', 'Pending', 'Failed'],
        default: 'Completed'
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
