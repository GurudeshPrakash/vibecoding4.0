const Equipment = require('../models/Equipment');
const Notification = require('../models/Notification');
const Staff = require('../models/Staff');
const Request = require('../models/Request');
const equipmentService = require('../services/equipmentService');

// @desc    Get all equipment
// @route   GET /api/equipment
exports.getAllEquipment = async (req, res) => {
    try {
        let filter = {};

        // Branch Isolation Logic
        if (req.user && req.user.role === 'staff') {
            const staff = await Staff.findById(req.user.id);
            if (staff && staff.branch) {
                filter.branch = staff.branch;
            } else {
                return res.status(200).json([]);
            }
        }

        const equipment = await equipmentService.findActiveEquipment(filter);
        res.status(200).json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single equipment by ID
// @route   GET /api/equipment/:id
exports.getEquipmentById = async (req, res) => {
    try {
        const item = await Equipment.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Equipment not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new equipment
// @route   POST /api/equipment
exports.addEquipment = async (req, res) => {
    try {
        let equipmentData = { ...req.body };

        // Force branch if staff
        if (req.user && req.user.role === 'staff') {
            const staff = await Staff.findById(req.user.id);
            if (staff && staff.branch) {
                equipmentData.branch = staff.branch;
            }
        }

        const newEquipment = new Equipment(equipmentData);
        const savedEquipment = await newEquipment.save();

        if (req.user && req.user.role === 'staff') {
            const staff = await Staff.findById(req.user.id);
            if (staff) {
                console.log('Creating Inventory Notification for Admin...');
                await Notification.create({
                    type: 'Inventory',
                    recipientRole: 'admin',
                    staffId: staff._id,
                    staffName: `${staff.firstName} ${staff.lastName}`,
                    staffEmail: staff.email,
                    branch: staff.branch || 'Not Specified',
                    timestamp: new Date(),
                    message: `New equipment added: ${savedEquipment.name} (${savedEquipment.category})`,
                    systemSource: 'Staff Portal'
                });
                console.log('Notification created successfully');
            } else {
                console.log('Staff not found for notification');
            }
        }

        res.status(201).json(savedEquipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
exports.updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) return res.status(404).json({ message: 'Equipment not found' });

        // Branch Isolation: If staff, ensure they only update their own branch equipment
        if (req.user && req.user.role === 'staff') {
            const staff = await Staff.findById(req.user.id);
            if (!staff || staff.branch !== equipment.branch) {
                return res.status(403).json({ message: 'Not authorized to update equipment in other branches' });
            }

            // APPROVAL WORKFLOW: If manager wants to dismantle, create a request
            if (req.body.status === 'Dismantled' && equipment.status !== 'Dismantled') {
                const existingRequest = await Request.findOne({
                    equipmentId: equipment._id,
                    status: 'Pending'
                });

                if (existingRequest) {
                    return res.status(400).json({ message: 'A dismantle request for this item is already pending admin approval.' });
                }

                // Create the request with report snapshot
                await Request.create({
                    equipmentId: equipment._id,
                    equipmentName: equipment.name,
                    equipmentCustomId: equipment.customId,
                    staffId: staff._id,
                    staffName: `${staff.firstName} ${staff.lastName}`,
                    branch: staff.branch,
                    reason: req.body.reason || 'Requested for dismantling',
                    // SNAPSHOTS FOR REPORT
                    equipmentType: equipment.type,
                    boughtDate: equipment.boughtDate,
                    maintenanceCount: (equipment.maintenanceHistory || []).length,
                    lastMaintenance: equipment.lastMaintenance,
                    price: equipment.price || 0
                });

                // Create Notification for Admin
                await Notification.create({
                    type: 'Inventory',
                    recipientRole: 'admin',
                    staffId: staff._id,
                    staffName: `${staff.firstName} ${staff.lastName}`,
                    staffEmail: staff.email,
                    branch: staff.branch || 'Not Specified',
                    timestamp: new Date(),
                    message: `Dismantle Request: ${staff.firstName} is asking to dismantle ${equipment.name} (${equipment.customId || 'No ID'}). Admin approval required.`,
                    systemSource: 'Staff Portal'
                });

                return res.status(200).json({
                    message: 'Dismantle request submitted for admin approval.',
                    requestPending: true,
                    equipment: equipment
                });
            }
        }

        // ADMIN DIRECT DISMANTLE: If an admin sets status to 'Dismantled', do it immediately
        if (req.body.status === 'Dismantled' && equipment.status !== 'Dismantled' && req.user && req.user.role === 'admin') {
            await Request.create({
                equipmentId: equipment._id,
                equipmentName: equipment.name,
                equipmentCustomId: equipment.customId,
                staffId: req.user.id,
                staffName: 'Administrator',
                branch: equipment.branch,
                reason: req.body.reason || 'Dismantled directly by Admin',
                status: 'Approved',
                updatedAt: new Date(),
                // SNAPSHOTS FOR REPORT
                equipmentType: equipment.type,
                boughtDate: equipment.boughtDate,
                maintenanceCount: (equipment.maintenanceHistory || []).length,
                lastMaintenance: equipment.lastMaintenance,
                price: equipment.price || 0
            });

            await Equipment.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: 'Equipment dismantled and removed from active inventory.', dismantled: true });
        }

        const oldStatus = equipment.status;
        const updatedEquipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Notify admin if status changed
        if (updatedEquipment.status !== oldStatus) {
            if (req.user && req.user.role === 'staff') {
                const staff = await Staff.findById(req.user.id);
                if (staff) {
                    await Notification.create({
                        type: 'Inventory',
                        recipientRole: 'admin',
                        staffId: staff._id,
                        staffName: `${staff.firstName} ${staff.lastName}`,
                        staffEmail: staff.email,
                        branch: staff.branch || 'Not Specified',
                        timestamp: new Date(),
                        message: `Equipment status changed: ${updatedEquipment.name} is now ${updatedEquipment.status} (was ${oldStatus})`,
                        systemSource: 'Staff Portal'
                    });
                }
            }
        }

        res.status(200).json(updatedEquipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
exports.deleteEquipment = async (req, res) => {
    try {
        const deletedEquipment = await Equipment.findByIdAndDelete(req.params.id);
        if (!deletedEquipment) return res.status(404).json({ message: 'Equipment not found' });
        res.status(200).json({ message: 'Equipment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Handle Dismantle Requests (Admin Only)
// @route   POST /api/equipment/requests/:id/:action
exports.handleDismantleRequest = async (req, res) => {
    try {
        const { id, action } = req.params; // id is requestId, action is 'approve' or 'reject'
        const dismantleRequest = await Request.findById(id);

        if (!dismantleRequest) return res.status(404).json({ message: 'Request not found' });
        if (dismantleRequest.status !== 'Pending') return res.status(400).json({ message: 'Request already processed' });

        if (action === 'approve') {
            dismantleRequest.status = 'Approved';
            // PERMANENT REMOVAL: Remove from Equipment database upon approval
            await Equipment.findByIdAndDelete(dismantleRequest.equipmentId);
        } else {
            dismantleRequest.status = 'Rejected';
            dismantleRequest.adminComment = req.body.comment || 'Rejected by Admin';

            const equipment = await Equipment.findById(dismantleRequest.equipmentId);
            if (equipment) {
                equipment.status = 'Maintenance';

                // Decrease usage
                if (equipment.totalUsageHours && !isNaN(parseInt(equipment.totalUsageHours))) {
                    const currentUsage = parseInt(equipment.totalUsageHours);
                    equipment.totalUsageHours = Math.max(0, currentUsage - 50).toString();
                }

                // Increase time span (next maintenance)
                if (equipment.nextMaintenance) {
                    const nextMaint = new Date(equipment.nextMaintenance);
                    nextMaint.setMonth(nextMaint.getMonth() + 3);
                    equipment.nextMaintenance = nextMaint;
                } else {
                    const nextMaint = new Date();
                    nextMaint.setMonth(nextMaint.getMonth() + 3);
                    equipment.nextMaintenance = nextMaint;
                }

                if (!equipment.maintenanceHistory) equipment.maintenanceHistory = [];
                equipment.maintenanceHistory.push({
                    description: 'Dismantle Rejected - Forced Maintenance',
                    date: new Date()
                });
                await equipment.save();
            }
        }

        dismantleRequest.updatedAt = new Date();
        await dismantleRequest.save();

        // Notify Staff
        await Notification.create({
            type: 'Inventory',
            recipientRole: 'staff',
            recipientId: dismantleRequest.staffId,
            staffId: req.user.id, // Admin ID
            staffName: 'Administrator',
            staffEmail: 'admin@powerworld.com',
            branch: dismantleRequest.branch,
            message: `Your dismantle request for ${dismantleRequest.equipmentName} has been ${dismantleRequest.status}. ${action === 'approve' ? 'Item has been removed from active inventory.' : ''}`,
            systemSource: 'System'
        });

        res.status(200).json({ message: `Request ${action}d successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Dismantled History
exports.getDismantledHistory = async (req, res) => {
    try {
        let query = { status: 'Approved' };

        // If staff, only show their branch
        if (req.user && req.user.role === 'staff') {
            const staff = await Staff.findById(req.user.id);
            if (staff && staff.branch) {
                query.branch = staff.branch;
            } else {
                return res.status(200).json([]);
            }
        }

        const history = await Request.find(query).sort({ updatedAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Finalize Dismantle (Delete from to-do list after physical dismantling)
exports.finalizeDismantle = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await equipmentService.finalizeDismantle(id);

        if (!result) return res.status(404).json({ message: 'Record not found' });

        res.status(200).json({ message: 'Equipment removal finalized and record archived.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all pending requests (Admin Only)
exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await Request.find({ status: 'Pending' }).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
