const Admin = require('../models/Admin');
const AdminLog = require('../models/AdminLog');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService');

const generateToken = (id, role) => {
    return jwt.sign({ id, role: role || 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
};

// @desc    Forgot Password - Send reset email
// @route   POST /api/admin/forgot-password
exports.forgotPassword = async (req, res) => {
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
            token: generateToken(admin._id),
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await Admin.findOne({ email });
        let isStaff = false;

        if (!user) {
            const Staff = require('../models/Staff');
            user = await Staff.findOne({ email });
            isStaff = true;
        }

        if (user && (await user.comparePassword(password))) {
            const loginTime = new Date();

            if (!isStaff) {
                let logId = null;

                // Track only the 'admin', not the 'super_admin'
                if (user.role === 'admin') {
                    const staleLogs = await AdminLog.find({ adminId: user._id, status: 'Active' });
                    for (const staleLog of staleLogs) {
                        staleLog.status = 'Ended';
                        staleLog.logoutTimestamp = loginTime;
                        await staleLog.save();
                    }

                    const log = await AdminLog.create({
                        adminId: user._id,
                        adminName: `${user.firstName} ${user.lastName}`,
                        adminEmail: user.email,
                        loginTimestamp: loginTime,
                        status: 'Active'
                    });

                    logId = log._id;
                }

                return res.json({
                    _id: user._id,
                    firstName: user.firstName,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.role),
                    logId: logId
                });
            } else {
                const ActivityLog = require('../models/ActivityLog');
                const staleLogs = await ActivityLog.find({ staffId: user._id, status: 'Active' });
                for (const staleLog of staleLogs) {
                    staleLog.status = 'Ended';
                    staleLog.logoutTimestamp = loginTime;
                    await staleLog.save();
                }

                const log = await ActivityLog.create({
                    staffId: user._id,
                    staffName: `${user.firstName} ${user.lastName}`,
                    staffEmail: user.email,
                    branch: user.branch || 'Unassigned',
                    loginTimestamp: loginTime,
                    status: 'Active'
                });

                return res.json({
                    _id: user._id,
                    firstName: user.firstName,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.role),
                    logId: log._id
                });
            }
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logoutAdmin = async (req, res) => {
    const { logId } = req.body;
    try {
        const log = await AdminLog.findById(logId);
        if (log && log.status === 'Active') {
            log.logoutTimestamp = new Date();
            log.status = 'Ended';
            await log.save();
            res.json({ message: 'Logged out successfully' });
        } else {
            res.status(404).json({ message: 'Active session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ role: 'admin' }).select('-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createAdmin = async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments({ role: 'admin' });
        if (adminCount >= 6) {
            return res.status(400).json({ message: 'Maximum limit of 6 Admins reached.' });
        }

        const { firstName, lastName, email, password, phone } = req.body;
        const userExists = await Admin.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Admin already exists' });

        const admin = await Admin.create({ firstName, lastName, email, password, phone, role: 'admin' });
        res.status(201).json({
            _id: admin._id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            phone: admin.phone
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.firstName = req.body.firstName || admin.firstName;
            admin.lastName = req.body.lastName || admin.lastName;
            admin.email = req.body.email || admin.email;
            admin.phone = req.body.phone || admin.phone;

            if (req.body.password) {
                admin.password = req.body.password;
            }

            const updatedAdmin = await admin.save();
            res.json(updatedAdmin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (admin) {
            await admin.deleteOne();
            res.json({ message: 'Admin removed' });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdminLogs = async (req, res) => {
    try {
        const logs = await AdminLog.find().sort({ loginTimestamp: -1 }).populate('adminId', 'firstName lastName email role');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Dashboard Statistics for Super Admin
// @route   GET /api/admin/dashboard-stats
exports.getDashboardStats = async (req, res) => {
    console.log('--- DASHBOARD STATS REQUEST RECEIVED ---');
    try {
        const Branch = require('../models/Branch');
        const Staff = require('../models/Staff');
        const Admin = require('../models/Admin');
        const AdminLog = require('../models/AdminLog');
        const ActivityLog = require('../models/ActivityLog');

        const branches = await Branch.find();
        const admins = await Admin.find();
        const staff = await Staff.find();

        // Mocking member data since no dedicated model exists yet
        // In a real scenario, this would query a Members collection
        const totalMembers = 850 + (staff.length * 10); // Dynamic-ish mock
        const activeMembers = Math.floor(totalMembers * 0.85);

        const activeSessions = await AdminLog.countDocuments({ status: 'Active' });
        const recentActivity = await ActivityLog.find().sort({ loginTimestamp: -1 }).limit(5);

        const stats = {
            totalMembers,
            activeMembers,
            newMembersToday: 12,
            activeGyms: branches.length,
            acGyms: branches.filter(b => b.isAC).length || 5, // Default mock if property missing
            nonAcGyms: branches.filter(b => !b.isAC).length || 3,
            monthlyRevenue: 4200000,
            pendingPayments: 185000,
            recentActivities: recentActivity.map(log => ({
                id: log._id,
                user: log.staffName || 'System',
                action: log.status === 'Active' ? 'Started a new session' : 'Completed operation',
                time: log.loginTimestamp,
                branch: log.branch
            })),
            memberGrowth: [
                { name: 'Feb 01', members: 400 },
                { name: 'Feb 07', members: 600 },
                { name: 'Feb 14', members: 800 },
                { name: 'Feb 21', members: 1250 },
                { name: 'Feb 28', members: totalMembers },
            ],
            revenueTrend: [
                { month: 'Jan', revenue: 45000 },
                { month: 'Feb', revenue: 52000 },
                { month: 'Mar', revenue: 48000 },
                { month: 'Apr', revenue: 61000 },
                { month: 'May', revenue: 55000 },
                { month: 'Jun', revenue: 67000 },
            ]
        };

        res.json(stats);
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
