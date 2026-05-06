const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    surname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    nic: { type: String },
    role: { type: String, default: 'Staff' },
    branch: { type: String },
    assignedArea: { type: String },
    branchId: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    profilePhoto: { type: String },
    lastLogin: { type: String, default: 'Never' },
    createdAt: { type: Date, default: Date.now }
});

staffSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

staffSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.Staff || mongoose.model('Staff', staffSchema);
