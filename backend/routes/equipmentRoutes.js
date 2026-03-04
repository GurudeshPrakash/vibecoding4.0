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
router.get('/', protect, rbac('super_admin', 'admin', 'staff'), getAllEquipment);
router.get('/pending-requests', protect, rbac('super_admin', 'admin'), getPendingRequests); // New
router.get('/dismantled-history', protect, rbac('super_admin', 'admin', 'staff'), getDismantledHistory); // New
router.post('/requests/:id/:action', protect, rbac('super_admin', 'admin'), handleDismantleRequest); // New action can be approve/reject
router.delete('/dismantle-finalize/:id', protect, rbac('super_admin', 'admin', 'staff'), finalizeDismantle); // New - For clearing history list
router.get('/:id', getEquipmentById);

// Only Staff or Admin can manage equipment
router.post('/', protect, rbac('super_admin', 'admin', 'staff'), addEquipment);
router.put('/:id', protect, upload.single('photoFile'), rbac('super_admin', 'admin', 'staff'), updateEquipment);
router.delete('/:id', protect, rbac('super_admin', 'admin', 'staff'), deleteEquipment);

module.exports = router;
