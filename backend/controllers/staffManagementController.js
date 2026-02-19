const Staff = require('../models/Staff');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

// @desc    Admin create staff
// @route   POST /api/admin/staff
exports.createStaff = async (req, res) => {
    const { firstName, lastName, email, password, phone, branch, assignedArea, profilePicture } = req.body;
    try {
        const staffExists = await Staff.findOne({ email });
        if (staffExists) return res.status(400).json({ message: 'Staff email already exists' });

        // Check if branch is already assigned
        if (branch) {
            const branchExists = await Staff.findOne({ branch });
            if (branchExists) {
                return res.status(400).json({
                    message: `The branch "${branch}" is already assigned to ${branchExists.firstName} ${branchExists.lastName}.`
                });
            }
        }

        const staff = await Staff.create({ firstName, lastName, email, password, phone, branch, assignedArea, profilePicture });
        res.status(201).json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin get all staff
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find().select('-password');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin update staff
exports.updateStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (staff) {
            // Check if new branch is already assigned to ANOTHER manager
            if (req.body.branch && req.body.branch !== staff.branch) {
                const branchExists = await Staff.findOne({ branch: req.body.branch });
                if (branchExists) {
                    return res.status(400).json({
                        message: `The branch "${req.body.branch}" is already assigned to ${branchExists.firstName} ${branchExists.lastName}.`
                    });
                }
            }

            staff.firstName = req.body.firstName || staff.firstName;
            staff.lastName = req.body.lastName || staff.lastName;
            staff.email = req.body.email || staff.email;
            staff.phone = req.body.phone || staff.phone;
            staff.branch = req.body.branch || staff.branch;
            staff.phone = req.body.phone || staff.phone;
            staff.branch = req.body.branch || staff.branch;
            staff.assignedArea = req.body.assignedArea || staff.assignedArea;
            staff.profilePicture = req.body.profilePicture || staff.profilePicture;
            if (req.body.password) {
                staff.password = req.body.password;
            }
            const updatedStaff = await staff.save();
            res.json(updatedStaff);
        } else {
            res.status(404).json({ message: 'Staff member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin delete staff
exports.deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (staff) {
            await staff.deleteOne();
            res.json({ message: 'Staff member removed' });
        } else {
            res.status(404).json({ message: 'Staff member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin get activity logs
exports.getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find().sort({ loginTimestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin get notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientRole: 'admin' }).sort({ timestamp: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark notification as read
exports.markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
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
// @desc    Get activity log by ID
exports.getLogById = async (req, res) => {
    try {
        const log = await ActivityLog.findById(req.params.id);
        if (log) {
            res.json(log);
        } else {
            res.status(404).json({ message: 'Activity log not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
