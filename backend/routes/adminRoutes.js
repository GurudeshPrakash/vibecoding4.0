const express = require('express');
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    forgotPassword,
    resetPassword
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
const rbac = require('../middleware/rbacMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Admins Management (Super Admin only)
// Redundant declaration removed
// const { protect, adminOnly } = require('../middleware/authMiddleware');

// Auth
router.post('/signup', registerAdmin);
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', protect, rbac('admin', 'super_admin'), getAdminProfile);

// Admins Management (Super Admin only)
const { getAllAdmins, deleteAdmin } = require('../controllers/adminController');
router.get('/admins', protect, rbac('super_admin'), getAllAdmins);
router.post('/admins', protect, rbac('super_admin'), registerAdmin);
router.delete('/admins/:id', protect, rbac('super_admin'), deleteAdmin);
// router.get('/admin-logs', protect, rbac('super_admin'), getAdminLogs);

// Gym Owners Management
router.get('/owners', protect, rbac('admin', 'super_admin'), getAllOwners);
router.post('/owners', protect, rbac('admin', 'super_admin'), addOwner);
router.put('/owners/:id', protect, rbac('admin', 'super_admin'), updateOwner);
router.delete('/owners/:id', protect, rbac('admin', 'super_admin'), deleteOwner);

// Branch Management
router.get('/branches', protect, rbac('admin', 'super_admin'), getAllBranches);
router.post('/branches', protect, rbac('admin', 'super_admin'), upload.single('photoFile'), addBranch);
router.put('/branches/:id', protect, rbac('admin', 'super_admin'), upload.single('photoFile'), updateBranch);
router.delete('/branches/:id', protect, rbac('admin', 'super_admin'), deleteBranch);

// Staff Management (Admin only)
router.post('/staff', protect, rbac('admin', 'super_admin'), createStaff);
router.get('/staff', protect, rbac('admin', 'super_admin'), getAllStaff);
router.put('/staff/:id', protect, rbac('admin', 'super_admin'), updateStaff);
router.delete('/staff/:id', protect, rbac('admin', 'super_admin'), deleteStaff);

// Activity Logs and Notifications
router.get('/staff-logs', protect, rbac('admin', 'super_admin'), getActivityLogs);
router.get('/staff-logs/:id', protect, rbac('admin', 'super_admin'), getLogById);
router.get('/notifications', protect, rbac('admin', 'super_admin'), getNotifications);
router.put('/notifications/:id', protect, rbac('admin', 'super_admin'), markNotificationRead);

// Dashboard Statistics
// Assuming getDashboardStats exists in a controller or similar
// router.get('/dashboard-stats', protect, rbac('super_admin'), getDashboardStats);

module.exports = router;
