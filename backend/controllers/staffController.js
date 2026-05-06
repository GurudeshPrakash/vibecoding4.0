const Staff = require('../models/Staff');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const Admin = require('../models/Admin');
const sendEmail = require('../utils/emailService');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id, role: 'staff' }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Staff login
// @route   POST /api/staff/login
exports.loginStaff = async (req, res) => {
    const { email, password } = req.body;
    try {
        const staff = await Staff.findOne({ email });
        if (staff && (await staff.comparePassword(password))) {
            const loginTime = new Date();

            // Cleanup any stale active sessions for this staff member
            const staleLogs = await ActivityLog.find({ staffId: staff._id, status: 'Active' });
            for (const staleLog of staleLogs) {
                staleLog.status = 'Ended';
                staleLog.logoutTimestamp = loginTime; // Use current login time as fallback for previous logout
                await staleLog.save();

                // Notify admin about unexpected closure
                await Notification.create({
                    type: 'Logout',
                    recipientRole: 'admin',
                    staffId: staff._id,
                    staffName: `${staff.firstName} ${staff.lastName}`,
                    staffEmail: staff.email,
                    branch: staff.branch || 'Not Specified',
                    activityLogId: staleLog._id,
                    timestamp: loginTime,
                    message: 'Session ended unexpectedly (New login detected)',
                    systemSource: 'System cleanup'
                });
            }

            // 1. Create Unified Activity Log (Continuous flow)
            const log = await ActivityLog.create({
                staffId: staff._id,
                staffName: `${staff.firstName} ${staff.lastName}`,
                staffEmail: staff.email,
                branch: staff.branch || 'Not Specified',
                loginTimestamp: loginTime,
                status: 'Active'
            });

            // 2. Create Notification for Manager (Login success)
            await Notification.create({
                type: 'Login',
                recipientRole: 'staff',
                recipientId: staff._id,
                staffId: staff._id,
                staffName: `${staff.firstName} ${staff.lastName}`,
                staffEmail: staff.email,
                branch: staff.branch || 'Not Specified',
                activityLogId: log._id,
                timestamp: loginTime,
                message: 'You logged in successfully',
                systemSource: 'Manager activity'
            });

            // 3. Send Email to Admin (Optional alert, kept for now)
            const admin = await Admin.findOne();
            const adminEmail = process.env.ADMIN_EMAIL || (admin ? admin.email : null);
            if (adminEmail) {
                await sendEmail({
                    to: adminEmail,
                    subject: `Manager Login Alert: ${staff.firstName} ${staff.lastName}`,
                    html: `
                        <h2>Manager Login Alert</h2>
                        <p><strong>Manager Name:</strong> ${staff.firstName} ${staff.lastName}</p>
                        <p><strong>Action:</strong> Login</p>
                        <p><strong>Date & Time:</strong> ${loginTime.toLocaleString()}</p>
                    `
                }).catch(e => console.log('Email skip:', e.message));
            }

            res.json({
                _id: staff._id,
                firstName: staff.firstName,
                email: staff.email,
                branch: staff.branch,
                token: generateToken(staff._id),
                logId: log._id
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Staff Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Staff logout
// @route   POST /api/staff/logout
exports.logoutStaff = async (req, res) => {
    const { logId } = req.body;
    try {
        const log = await ActivityLog.findById(logId);
        if (log && log.status === 'Active') {
            const logoutTime = new Date();

            // 1. Update the EXISTING Activity Log (Continuous flow)
            log.logoutTimestamp = logoutTime;
            log.status = 'Ended';
            await log.save();

            const staff = await Staff.findById(log.staffId);

            // 2. Create Logout Notification for Manager
            await Notification.create({
                type: 'Logout',
                recipientRole: 'staff',
                recipientId: log.staffId,
                staffId: log.staffId,
                staffName: log.staffName,
                staffEmail: log.staffEmail,
                branch: log.branch,
                activityLogId: log._id,
                timestamp: logoutTime,
                message: 'You logged out successfully',
                systemSource: 'Manager activity'
            });

            // 3. Send Email to Admin
            const admin = await Admin.findOne();
            const adminEmail = process.env.ADMIN_EMAIL || (admin ? admin.email : null);
            if (adminEmail) {
                await sendEmail({
                    to: adminEmail,
                    subject: `Manager Logout Alert: ${log.staffName}`,
                    html: `
                        <h2>Manager Logout Alert</h2>
                        <p><strong>Manager Name:</strong> ${log.staffName}</p>
                        <p><strong>Action:</strong> Logout</p>
                        <p><strong>Date & Time:</strong> ${logoutTime.toLocaleString()}</p>
                    `
                }).catch(e => console.log('Email skip:', e.message));
            }

            res.json({ message: 'Logged out successfully' });
        } else {
            res.status(404).json({ message: 'Active session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Manager Profile
exports.getStaffProfile = async (req, res) => {
    try {
        const staff = await Staff.findById(req.user.id).select('-password');
        if (staff) {
            res.json(staff);
        } else {
            res.status(404).json({ message: 'Manager member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update manager profile (Self-service)
exports.updateStaffProfile = async (req, res) => {
    try {
        const staff = await Staff.findById(req.user.id);
        if (staff) {
            staff.firstName = req.body.firstName || staff.firstName;
            staff.lastName = req.body.lastName || staff.lastName;
            staff.phone = req.body.phone || staff.phone;
            staff.profilePicture = req.body.profilePicture || staff.profilePicture;

            if (req.body.password) {
                staff.password = req.body.password;
            }

            const updatedStaff = await staff.save();
            res.json({
                _id: updatedStaff._id,
                firstName: updatedStaff.firstName,
                lastName: updatedStaff.lastName,
                email: updatedStaff.email,
                phone: updatedStaff.phone,
                branch: updatedStaff.branch,
                profilePicture: updatedStaff.profilePicture
            });
        } else {
            res.status(404).json({ message: 'Manager not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Staff Notifications
exports.getStaffNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipientRole: 'staff',
            recipientId: req.user.id
        }).sort({ timestamp: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark staff notification as read
exports.markStaffNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, recipientId: req.user.id });
        if (notification) {
            notification.isRead = true;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Note: RegisterStaff is removed here as it will be handled by Admin

// @desc    Report Inventory Issue (Maintenance/Damage)
exports.reportInventoryIssue = async (req, res) => {
    try {
        const { machineId, machineName, branchName, status, description } = req.body;

        const staff = await Staff.findById(req.user.id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        // Determine message text as per requested format
        const staffFullName = `${staff.firstName} ${staff.lastName}`.trim();
        let messageText = '';
        if (status === 'Damaged') {
            messageText = `Staff member ${staffFullName} reported that the machine [${machineName} - ${machineId || 'N/A'}] is Damaged.`;
        } else {
            messageText = `Staff member ${staffFullName} reported that the machine [${machineName} - ${machineId || 'N/A'}] in ${staff.branch} requires Maintenance.`;
        }

        // Find Branch Admin
        const Branch = require('../models/Branch');
        const branchObj = await Branch.findOne({ name: staff.branch });
        let adminId = null;
        if (branchObj && branchObj.adminName) {
            // Find Admin by firstName (assuming adminName is firstName)
            const admin = await Admin.findOne({ firstName: branchObj.adminName, role: 'admin' });
            if (admin) {
                adminId = admin._id;

                // 1. Notification for Branch Admin
                await Notification.create({
                    type: 'Inventory',
                    recipientRole: 'admin',
                    recipientId: admin._id,
                    adminId: admin._id,
                    staffId: staff._id,
                    staffName: `${staff.firstName} ${staff.lastName}`,
                    staffEmail: staff.email,
                    branch: staff.branch,
                    message: messageText,
                    systemSource: 'Staff Inventory Check',
                    machineId,
                    machineName,
                    status,
                    description
                });
            }
        }

        // 2. Notification for Super Admin
        const superAdmins = await Admin.find({ role: 'super_admin' });
        for (const superAdmin of superAdmins) {
            await Notification.create({
                type: 'Inventory',
                recipientRole: 'super_admin',
                recipientId: superAdmin._id,
                adminId: superAdmin._id,
                staffId: staff._id,
                staffName: `${staff.firstName} ${staff.lastName}`,
                staffEmail: staff.email,
                branch: staff.branch,
                message: messageText,
                systemSource: 'Staff Inventory Check',
                machineId,
                machineName,
                status,
                description
            });
        }

        res.json({ message: 'Maintenance report sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
