const mongoose = require('mongoose');
const Branch = require('./models/Branch');
require('dotenv').config();

const verify = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const count = await Branch.countDocuments();
        console.log('Total Branches:', count);

        if (count > 0) {
            const all = await Branch.find({}, 'name');
            console.log('Branch Names:', all.map(b => b.name));
        }

        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

verify();
