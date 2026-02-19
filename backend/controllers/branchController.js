const Branch = require('../models/Branch');

exports.getAllBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addBranch = async (req, res) => {
    try {
        const newBranch = new Branch(req.body);
        const savedBranch = await newBranch.save();
        res.status(201).json(savedBranch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateBranch = async (req, res) => {
    try {
        const updated = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBranch = async (req, res) => {
    try {
        await Branch.findByIdAndDelete(req.params.id);
        res.json({ message: 'Branch deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
