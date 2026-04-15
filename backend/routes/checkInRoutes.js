const express = require('express');
const router = express.Router();
const { getCheckInsByBranch, logCheckIn } = require('../controllers/checkInController');
const { protect } = require('../middleware/authMiddleware');
const rbac = require('../middleware/rbacMiddleware');

router.get('/branch/:branchId', protect, rbac('super_admin', 'admin', 'staff'), getCheckInsByBranch);
router.post('/', protect, rbac('super_admin', 'admin', 'staff'), logCheckIn);

module.exports = router;
