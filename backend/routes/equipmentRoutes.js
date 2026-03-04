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

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/equipment';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, 'equipment-' + Date.now() + path.extname(file.originalname));
    }
});

const equipmentUpload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

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

module.exports = router;
