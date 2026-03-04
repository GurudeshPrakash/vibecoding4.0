const express = require('express');
const router = express.Router();

// Get System Info
router.get('/info', (req, res) => {
    res.json({
        name: 'Power World Gym Management System',
        version: '4.0.2',
        status: 'Operational'
    });
});

module.exports = router;
