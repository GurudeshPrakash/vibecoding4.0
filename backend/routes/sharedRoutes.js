const express = require('express');
const router = express.Router();
const { unifiedLogin, unifiedForgotPassword, unifiedResetPassword, getSystemInfo } = require('../controllers/sharedController');

// Get System Info
router.get('/info', getSystemInfo);

// Unified Auth
router.post('/login', unifiedLogin);
router.post('/forgot-password', unifiedForgotPassword);
router.post('/reset-password/:token', unifiedResetPassword);

module.exports = router;
