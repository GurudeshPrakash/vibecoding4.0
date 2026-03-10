const express = require('express');
const router = express.Router();
const { loginStaff, logoutStaff, getStaffProfile, updateStaffProfile, getStaffNotifications, markStaffNotificationRead, reportInventoryIssue } = require('../controllers/staffController');
const { protect, staffOnly } = require('../middleware/authMiddleware');
const rbac = require('../middleware/rbacMiddleware');

router.post('/login', loginStaff);
router.post('/logout', logoutStaff);
router.get('/profile', protect, rbac('super_admin', 'admin', 'staff'), getStaffProfile);
router.put('/profile', protect, rbac('super_admin', 'admin', 'staff'), updateStaffProfile);
router.get('/notifications', protect, rbac('super_admin', 'admin', 'staff'), getStaffNotifications);
router.put('/notifications/:id', protect, rbac('super_admin', 'admin', 'staff'), markStaffNotificationRead);
router.post('/inventory/report', protect, rbac('super_admin', 'admin', 'staff'), reportInventoryIssue);

module.exports = router;
