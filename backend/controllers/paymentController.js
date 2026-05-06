const Payment = require('../models/Payment');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin/Super Admin)
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ date: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get payments by branch
// @route   GET /api/payments/branch/:branchId
// @access  Private (Admin/Staff)
const getPaymentsByBranch = async (req, res) => {
    try {
        const payments = await Payment.find({ branchId: req.params.branchId }).sort({ date: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a payment
// @route   POST /api/payments
// @access  Private (Staff/Admin)
const createPayment = async (req, res) => {
    const { memberId, memberName, amount, type, method, branchId, status } = req.body;

    if (!memberId || !memberName || !amount || !type || !method || !branchId) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const payment = await Payment.create({
            memberId,
            memberName,
            amount,
            type,
            method,
            branchId,
            status: status || 'Completed'
        });
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a payment
// @route   PUT /api/payments/:id
// @access  Private (Admin)
const updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        const updatedPayment = await Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Private (Admin/Super Admin)
const deletePayment = async (req, res) => {
    try {
        // Use deleteOne() instead of remove()
        await Payment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Payment record removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPayments,
    getPaymentsByBranch,
    createPayment,
    updatePayment,
    deletePayment
};
