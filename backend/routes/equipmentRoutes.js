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

// Public or Protected depending on requirements
router.get('/', protect, getAllEquipment);
router.get('/pending-requests', protect, adminOnly, getPendingRequests); // New
router.get('/dismantled-history', protect, getDismantledHistory); // New
router.post('/requests/:id/:action', protect, adminOnly, handleDismantleRequest); // New action can be approve/reject
router.delete('/dismantle-finalize/:id', protect, finalizeDismantle); // New - For clearing history list
router.get('/:id', getEquipmentById);

// Only Staff or Admin can manage equipment
router.post('/', protect, staffOnly, addEquipment);
router.put('/:id', protect, updateEquipment); // Changed from staffOnly to allow both
router.delete('/:id', protect, adminOnly, deleteEquipment); // Only Admin can delete

module.exports = router;
