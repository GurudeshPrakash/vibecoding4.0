const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Branch = require('./models/Branch');

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected');

        const count = await Branch.countDocuments();
        console.log(`Branch Count: ${count}`);

        if (count > 0) {
            const first = await Branch.findOne();
            console.log('Sample Name:', first.name);
        } else {
            console.log('No branches found.');
        }

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
