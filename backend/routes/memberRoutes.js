const express = require('express');
const router = express.Router();
const { getAllMembers, getMembersByBranch, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');
const rbac = require('../middleware/rbacMiddleware');

router.get('/', protect, rbac('super_admin', 'admin', 'staff'), getAllMembers);
router.get('/branch/:branchId', protect, rbac('super_admin', 'admin', 'staff'), getMembersByBranch);
router.post('/', protect, rbac('super_admin', 'admin', 'staff'), createMember);
router.put('/:id', protect, rbac('super_admin', 'admin', 'staff'), updateMember);
router.delete('/:id', protect, rbac('super_admin', 'admin', 'staff'), deleteMember);

module.exports = router;
