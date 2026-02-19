const express = require('express');
const router = express.Router();
const { loginStaff, logoutStaff, getStaffProfile, updateStaffProfile, getStaffNotifications, markStaffNotificationRead } = require('../controllers/staffController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

router.post('/login', loginStaff);
router.post('/logout', logoutStaff);
router.get('/profile', protect, staffOnly, getStaffProfile);
router.put('/profile', protect, staffOnly, updateStaffProfile);
router.get('/notifications', protect, staffOnly, getStaffNotifications);
router.put('/notifications/:id', protect, staffOnly, markStaffNotificationRead);

module.exports = router;
