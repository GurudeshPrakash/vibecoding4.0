const Member = require('../models/Member');

const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find().populate('branchId', 'name');
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMembersByBranch = async (req, res) => {
    try {
        const members = await Member.find({ branchId: req.params.branchId });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createMember = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, branchId, subscriptionType, expireDate } = req.body;
        const member = new Member({
            firstName,
            lastName,
            email,
            phone,
            branchId,
            subscriptionType,
            expireDate: expireDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        const savedMember = await member.save();
        res.status(201).json(savedMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteMember = async (req, res) => {
    try {
        await Member.findByIdAndDelete(req.params.id);
        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllMembers,
    getMembersByBranch,
    createMember,
    updateMember,
    deleteMember
};
