const CheckIn = require('../models/CheckIn');
const Member = require('../models/Member');

// @desc    Get check-ins for a branch
// @route   GET /api/checkins/branch/:branchId
const getCheckInsByBranch = async (req, res) => {
    try {
        const checkins = await CheckIn.find({ branchId: req.params.branchId })
            .sort({ timestamp: -1 })
            .limit(50);
        res.status(200).json(checkins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Perform check-in/out
// @route   POST /api/checkins
const logCheckIn = async (req, res) => {
    const { memberId, action, method, branchId } = req.body;

    if (!memberId || !action || !branchId) {
        return res.status(400).json({ message: 'Please provide memberId, action, and branchId' });
    }

    try {
        // Find member to get their name
        const member = await Member.findOne({ memberId: memberId }); // Assuming memberId is a custom field in Member model
        // If not found by custom memberId, try searching by _id
        const actualMember = member || await Member.findById(memberId).catch(() => null);

        if (!actualMember) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const checkin = await CheckIn.create({
            memberId: actualMember.memberId || actualMember._id,
            memberName: `${actualMember.firstName} ${actualMember.lastName}`,
            branchId,
            action,
            method: method || 'Manual'
        });

        res.status(201).json(checkin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCheckInsByBranch,
    logCheckIn
};
