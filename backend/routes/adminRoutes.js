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
router.get('/admins', protect, rbac('superadmin'), getAllAdmins);
router.post('/admins', protect, rbac('superadmin'), createAdmin);
router.put('/admins/:id', protect, rbac('superadmin'), updateAdmin);
router.delete('/admins/:id', protect, rbac('superadmin'), deleteAdmin);
router.get('/admin-logs', protect, rbac('superadmin'), getAdminLogs);
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Auth
router.post('/signup', registerAdmin);
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', protect, rbac('admin', 'superadmin'), getAdminProfile);

// Gym Owners Management
router.get('/owners', protect, rbac('admin', 'superadmin'), getAllOwners);
router.post('/owners', protect, rbac('admin', 'superadmin'), addOwner);
router.put('/owners/:id', protect, rbac('admin', 'superadmin'), updateOwner);
router.delete('/owners/:id', protect, rbac('admin', 'superadmin'), deleteOwner);

// Branch Management
router.get('/branches', protect, rbac('admin', 'superadmin'), getAllBranches);
router.post('/branches', protect, rbac('admin', 'superadmin'), upload.single('photoFile'), addBranch);
router.put('/branches/:id', protect, rbac('admin', 'superadmin'), upload.single('photoFile'), updateBranch);
router.delete('/branches/:id', protect, rbac('admin', 'superadmin'), deleteBranch);
router.get('/branches', protect, adminOnly, getAllBranches);
router.post('/branches', protect, adminOnly, addBranch);
router.put('/branches/:id', protect, adminOnly, updateBranch);
router.delete('/branches/:id', protect, adminOnly, deleteBranch);

// Staff Management (Admin only)
router.post('/staff', protect, rbac('admin', 'superadmin'), createStaff);
router.get('/staff', protect, rbac('admin', 'superadmin'), getAllStaff);
router.put('/staff/:id', protect, rbac('admin', 'superadmin'), updateStaff);
router.delete('/staff/:id', protect, rbac('admin', 'superadmin'), deleteStaff);

// Activity Logs and Notifications
router.get('/staff-logs', protect, rbac('admin', 'superadmin'), getActivityLogs);
router.get('/staff-logs/:id', protect, rbac('admin', 'superadmin'), getLogById);
router.get('/notifications', protect, rbac('admin', 'superadmin'), getNotifications);
router.put('/notifications/:id', protect, rbac('admin', 'superadmin'), markNotificationRead);

// Dashboard Statistics
router.get('/dashboard-stats', protect, rbac('superadmin'), getDashboardStats);

module.exports = router;
