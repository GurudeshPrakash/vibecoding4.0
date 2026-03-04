const GymOwner = require('../models/GymOwner');

exports.getAllOwners = async (req, res) => {
    try {
        const owners = await GymOwner.find();
        res.json(owners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addOwner = async (req, res) => {
    try {
        const newOwner = new GymOwner(req.body);
        const savedOwner = await newOwner.save();
        res.status(201).json(savedOwner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateOwner = async (req, res) => {
    try {
        const updated = await GymOwner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteOwner = async (req, res) => {
    try {
        await GymOwner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Owner deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
