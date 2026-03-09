const Admin = require('../models/Admin');
const Staff = require('../models/Staff');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Unified Login for Super Admin, Admin, and Staff
// @route   POST /api/shared/login
exports.unifiedLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check Admin/Super Admin collection
        let user = await Admin.findOne({ email });
        let userType = 'admin';

        if (!user) {
            // 2. Check Staff collection
            user = await Staff.findOne({ email });
            userType = 'staff';
        }

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role, // roles: super_admin, admin, staff, etc
                phone: user.phone,
                userType: userType, // helper for frontend
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Unified Login Error:', error);
        res.status(500).json({ message: 'Server error during authentication' });
    }
};

// @desc    Unified Forgot Password
// @route   POST /api/shared/forgot-password
exports.unifiedForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await Admin.findOne({ email });
        let userType = 'admin';

        if (!user) {
            user = await Staff.findOne({ email });
            userType = 'staff';
        }

        if (!user) {
            return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;

        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset for your Power World account (${user.role.toUpperCase()}).</p>
            <a href="${resetUrl}" style="background: #ff0000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Power World - Password Reset',
            html: message
        });

        res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unified Reset Password
// @route   POST /api/shared/reset-password/:token
exports.unifiedResetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        let user = await Admin.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            user = await Staff.findOne({
                resetPasswordToken,
                resetPasswordExpires: { $gt: Date.now() }
            });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSystemInfo = (req, res) => {
    res.json({
        name: 'Power World Gym Management System',
        version: '4.0.2',
        status: 'Operational'
    });
};
