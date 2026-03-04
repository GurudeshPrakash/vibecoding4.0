const express = require('express');
const router = express.Router();
const {
    getAllEquipment,
    getEquipmentById,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    handleDismantleRequest,
    getPendingRequests,
    getDismantledHistory,
    finalizeDismantle
} = require('../controllers/equipmentController');
const { protect, staffOnly, adminOnly } = require('../middleware/authMiddleware');
const rbac = require('../middleware/rbacMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Changed to use general upload for now

// Public or Protected depending on requirements
router.get('/', protect, rbac('superadmin', 'admin', 'manager'), getAllEquipment);
router.get('/pending-requests', protect, rbac('superadmin', 'admin'), getPendingRequests); // New
router.get('/dismantled-history', protect, rbac('superadmin', 'admin', 'manager'), getDismantledHistory); // New
router.post('/requests/:id/:action', protect, rbac('superadmin', 'admin'), handleDismantleRequest); // New action can be approve/reject
router.delete('/dismantle-finalize/:id', protect, rbac('superadmin', 'admin', 'manager'), finalizeDismantle); // New - For clearing history list
router.get('/:id', getEquipmentById);

// Only Staff or Admin can manage equipment
router.post('/', protect, rbac('superadmin', 'admin', 'manager'), addEquipment);
router.put('/:id', protect, upload.single('photoFile'), rbac('superadmin', 'admin', 'manager'), updateEquipment);
router.delete('/:id', protect, rbac('superadmin', 'admin', 'manager'), deleteEquipment);

module.exports = router;
