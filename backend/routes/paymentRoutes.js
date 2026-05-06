const express = require('express');
const router = express.Router();
const {
    getAllPayments,
    getPaymentsByBranch,
    createPayment,
    updatePayment,
    deletePayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const rbac = require('../middleware/rbacMiddleware');

router.get('/', protect, rbac('super_admin', 'admin'), getAllPayments);
router.get('/branch/:branchId', protect, rbac('super_admin', 'admin', 'staff'), getPaymentsByBranch);
router.post('/', protect, rbac('super_admin', 'admin', 'staff'), createPayment);
router.put('/:id', protect, rbac('super_admin', 'admin', 'staff'), updatePayment);
router.delete('/:id', protect, rbac('super_admin', 'admin', 'staff'), deletePayment);

module.exports = router;
