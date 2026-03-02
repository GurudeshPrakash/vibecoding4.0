const express = require('express');
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAdminProfile,
    forgotPassword,
    resetPassword,
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminLogs,
    getDashboardStats
} = require('../controllers/adminController');
const { getAllOwners, addOwner, updateOwner, deleteOwner } = require('../controllers/gymOwnerController');
const { getAllBranches, addBranch, updateBranch, deleteBranch } = require('../controllers/branchController');
const {
    createStaff,
    getAllStaff,
    updateStaff,
    deleteStaff,
    getActivityLogs,
    getLogById,
    getNotifications,
    markNotificationRead
} = require('../controllers/staffManagementController');
const { protect, adminOnly, superAdminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Admins Management (Super Admin only)
router.get('/admins', protect, superAdminOnly, getAllAdmins);
router.post('/admins', protect, superAdminOnly, createAdmin);
router.put('/admins/:id', protect, superAdminOnly, updateAdmin);
router.delete('/admins/:id', protect, superAdminOnly, deleteAdmin);
router.get('/admin-logs', protect, superAdminOnly, getAdminLogs);

// Auth
router.post('/signup', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', protect, adminOnly, getAdminProfile);

// Gym Owners Management
router.get('/owners', protect, adminOnly, getAllOwners);
router.post('/owners', protect, adminOnly, addOwner);
router.put('/owners/:id', protect, adminOnly, updateOwner);
router.delete('/owners/:id', protect, adminOnly, deleteOwner);

// Branch Management
router.get('/branches', protect, adminOnly, getAllBranches);
router.post('/branches', protect, adminOnly, upload.single('photoFile'), addBranch);
router.put('/branches/:id', protect, adminOnly, upload.single('photoFile'), updateBranch);
router.delete('/branches/:id', protect, adminOnly, deleteBranch);

// Staff Management (Admin only)
router.post('/staff', protect, adminOnly, createStaff);
router.get('/staff', protect, adminOnly, getAllStaff);
router.put('/staff/:id', protect, adminOnly, updateStaff);
router.delete('/staff/:id', protect, adminOnly, deleteStaff);

// Activity Logs and Notifications
router.get('/staff-logs', protect, adminOnly, getActivityLogs);
router.get('/staff-logs/:id', protect, adminOnly, getLogById);
router.get('/notifications', protect, adminOnly, getNotifications);
router.put('/notifications/:id', protect, adminOnly, markNotificationRead);

// Dashboard Statistics
router.get('/dashboard-stats', protect, superAdminOnly, getDashboardStats);

module.exports = router;
