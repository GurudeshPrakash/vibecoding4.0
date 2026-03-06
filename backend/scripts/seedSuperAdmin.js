const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB Connected.');

        const superAdminExists = await Admin.findOne({ email: 'superadmin@powerworld.com' });

        if (superAdminExists) {
            console.log('Super Admin already exists!');
            process.exit();
        }

        await Admin.create({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'superadmin@powerworld.com',
            password: 'password123',
            phone: '+0000000000',
            role: 'super_admin'
        });

        console.log('Super Admin created successfully!');
        console.log('Email: superadmin@powerworld.com');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error('Error seeding Super Admin:', error.message);
        process.exit(1);
    }
};

seedSuperAdmin();
