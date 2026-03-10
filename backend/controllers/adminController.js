const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};



// @desc    Forgot Password - Send reset email
// @route   POST /api/admin/forgot-password
exports.forgotPassword = async (req, res) => {
    console.log('Forgot Password request received body:', req.body);
    const email = req.body ? req.body.email : null;
    try {
        const admin = await Admin.findOne({ email });

        // Always return success message for security (don't reveal if email exists)
        if (!admin) {
            return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        admin.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

        await admin.save();

        // Create reset URL (pointing to frontend)
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const message = `
            <h1>Password Reset Request</h1>
            <p>You are receiving this email because you (or someone else) have requested the reset of a password for your Power World Admin account.</p>
            <p>Please click on the button below to complete the process within 30 minutes:</p>
            <a href="${resetUrl}" style="background: #ff0000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `;

        try {
            await sendEmail({
                to: admin.email,
                subject: 'Power World - Admin Password Reset',
                html: message
            });
            res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
        } catch (err) {
            admin.resetPasswordToken = undefined;
            admin.resetPasswordExpires = undefined;
            await admin.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/admin/reset-password/:token
exports.resetPassword = async (req, res) => {
    try {
        // Hash the token from the URL to compare with hashed token in DB
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const admin = await Admin.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set new password
        admin.password = req.body.password;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;

        await admin.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Register a new admin
// @route   POST /api/admin/signup
exports.registerAdmin = async (req, res) => {
    try {
        if (!req.body) {
            console.error('Registration failed: No body found in request');
            return res.status(400).json({ message: 'Request body is missing' });
        }
        const { firstName, lastName, email, password, phone } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const userExists = await Admin.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Admin already exists' });

        const admin = await Admin.create({ firstName, lastName, email, password, phone });
        res.status(201).json({
            _id: admin._id,
            firstName: admin.firstName,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin._id, admin.role),
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin login
// @route   POST /api/admin/login
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (admin && (await admin.comparePassword(password))) {
            res.json({
                _id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role,
                phone: admin.phone,
                token: generateToken(admin._id, admin.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Admin Profile
// @route   GET /api/admin/profile
exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get all admins (Super Admin only)
// @route   GET /api/admin/admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ role: 'admin' }).select('-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an admin (Super Admin only)
// @route   DELETE /api/admin/admins/:id
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        if (admin.role === 'super_admin') {
            return res.status(403).json({ message: 'Cannot delete a Super Admin' });
        }

        await admin.deleteOne();
        res.json({ message: 'Admin removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
