const Equipment = require('../models/Equipment');
const Notification = require('../models/Notification');
const Request = require('../models/Request');

/**
 * Service Layer for Equipment & Maintenance Logic.
 * High Cohesion: All database operations for equipment are encapsulated here.
 * Low Coupling: Controllers call this service instead of interacting with models directly.
 */
class EquipmentService {
    async findActiveEquipment(filter = {}) {
        return await Equipment.find({ ...filter, status: { $ne: 'Dismantled' } }).sort({ createdAt: -1 });
    }

    async createDismantleRequest(equipment, staff, reason) {
        // Create snapshot for reporting
        return await Request.create({
            equipmentId: equipment._id,
            equipmentName: equipment.name,
            equipmentCustomId: equipment.customId,
            staffId: staff._id,
            staffName: `${staff.firstName} ${staff.lastName}`,
            branch: staff.branch,
            reason: reason || 'Requested for dismantling',
            equipmentType: equipment.type,
            boughtDate: equipment.boughtDate,
            maintenanceCount: (equipment.maintenanceHistory || []).length,
            lastMaintenance: equipment.lastMaintenance,
            price: equipment.price || 0
        });
    }

    async notifyAdmin(staff, message) {
        return await Notification.create({
            type: 'Inventory',
            recipientRole: 'admin',
            staffId: staff._id,
            staffName: `${staff.firstName} ${staff.lastName}`,
            staffEmail: staff.email,
            branch: staff.branch || 'Not Specified',
            timestamp: new Date(),
            message,
            systemSource: 'Staff Portal'
        });
    }

    async finalizeDismantle(requestId) {
        return await Request.findByIdAndDelete(requestId);
    }
}

module.exports = new EquipmentService();
