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

// Public or Protected depending on requirements
router.get('/', protect, rbac('superadmin', 'admin', 'manager'), getAllEquipment);
router.get('/pending-requests', protect, rbac('superadmin', 'admin'), getPendingRequests); // New
router.get('/dismantled-history', protect, rbac('superadmin', 'admin', 'manager'), getDismantledHistory); // New
router.post('/requests/:id/:action', protect, rbac('superadmin', 'admin'), handleDismantleRequest); // New action can be approve/reject
router.delete('/dismantle-finalize/:id', protect, rbac('superadmin', 'admin', 'manager'), finalizeDismantle); // New - For clearing history list
router.get('/:id', getEquipmentById);

// Only Staff or Admin can manage equipment
router.post('/', protect, rbac('superadmin', 'admin', 'manager'), addEquipment);
router.put('/:id', protect, equipmentUpload.single('photoFile'), rbac('superadmin', 'admin', 'manager'), updateEquipment); // Changed from staffOnly to allow both
router.delete('/:id', protect, rbac('superadmin', 'admin', 'manager'), deleteEquipment); // Only Admin can delete
router.post('/', protect, staffOnly, addEquipment);
router.put('/:id', protect, updateEquipment); // Changed from staffOnly to allow both
router.delete('/:id', protect, adminOnly, deleteEquipment); // Only Admin can delete
module.exports = router;
