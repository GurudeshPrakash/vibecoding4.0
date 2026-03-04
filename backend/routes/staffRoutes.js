const express = require('express');
const router = express.Router();
const { loginStaff, logoutStaff, getStaffProfile, updateStaffProfile, getStaffNotifications, markStaffNotificationRead } = require('../controllers/staffController');
const { protect, staffOnly } = require('../middleware/authMiddleware');
const rbac = require('../middleware/rbacMiddleware');

router.post('/login', loginStaff);
router.post('/logout', logoutStaff);
router.get('/profile', protect, rbac('superadmin', 'admin', 'manager'), getStaffProfile);
router.put('/profile', protect, rbac('superadmin', 'admin', 'manager'), updateStaffProfile);
router.get('/notifications', protect, rbac('superadmin', 'admin', 'manager'), getStaffNotifications);
router.put('/notifications/:id', protect, rbac('superadmin', 'admin', 'manager'), markStaffNotificationRead);

module.exports = router;
