const Admin = require('../models/Admin');
const Staff = require('../models/Staff');
const Branch = require('../models/Branch');

const setupTestUsers = async () => {
    try {
        // 1. Setup Super Admin: Alex Fernando
        let superAdmin = await Admin.findOne({ email: 'superadmin@powerworld.com' });
        if (!superAdmin) {
            superAdmin = new Admin({
                firstName: 'Alex',
                lastName: 'Fernando',
                email: 'superadmin@powerworld.com',
                password: 'SuperAdmin123',
                phone: '0711111111',
                role: 'super_admin'
            });
            await superAdmin.save();
            console.log('✅ Permanent Super Admin (Alex Fernando) created.');
        }

        // 2. Setup Admin: Daniel Perera
        let admin = await Admin.findOne({ email: 'admin@powerworld.com' });
        if (!admin) {
            admin = new Admin({
                firstName: 'Daniel',
                lastName: 'Perera',
                email: 'admin@powerworld.com',
                password: 'Admin123',
                phone: '0722222222',
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Permanent Admin (Daniel Perera) created.');
        }

        // 3. Setup Branches: Daniel manages 6 branches
        const branchNames = ['Galle Branch', 'Colombo Branch', 'Kandy Branch', 'Matara Branch', 'Kurunegala Branch', 'Negombo Branch'];
        for (const bName of branchNames) {
            let branch = await Branch.findOne({ name: bName });
            if (!branch) {
                branch = new Branch({
                    name: bName,
                    location: bName.split(' ')[0],
                    phone: '0912222222',
                    adminName: 'Daniel', // Maps to Daniel Perera's firstName for notification routing
                    adminPhone: '0722222222',
                    operatingHours: '24 Hours',
                    runningSince: '2020'
                });
                await branch.save();
                console.log(`✅ Default Branch (${bName}) created and assigned to Daniel.`);
            }
        }

        // 4. Setup Staff: Nimal Silva
        let staff = await Staff.findOne({ email: 'staff@powerworld.com' });
        if (!staff) {
            staff = new Staff({
                firstName: 'Nimal',
                lastName: 'Silva',
                email: 'staff@powerworld.com',
                password: 'Staff123',
                phone: '0733333333',
                role: 'staff',
                branch: 'Galle Branch',
                assignedArea: 'General'
            });
            await staff.save();
            console.log('✅ Permanent Staff (Nimal Silva) created successfully.');
        } else {
            // Update branch just in case
            if (staff.branch !== 'Galle Branch') {
                staff.branch = 'Galle Branch';
                await staff.save();
                console.log('🔄 Permanent Staff (Nimal Silva) re-assigned to Galle Branch.');
            }
        }

    } catch (err) {
        console.error('❌ Error setting up permanent test users:', err.message);
    }
};

module.exports = setupTestUsers;
