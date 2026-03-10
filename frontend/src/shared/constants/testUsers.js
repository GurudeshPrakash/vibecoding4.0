export const TEST_USERS = {
    super_admin: {
        id: 'SA-001',
        name: 'Alex Fernando',
        email: 'alex@powerworld.com',
        phone: '+94 77 123 4567',
        role: 'super_admin'
    },
    admin: {
        id: 'ADM-001',
        name: 'Daniel Perera',
        email: 'daniel@powerworld.com',
        phone: '+94 77 765 4321',
        role: 'admin',
        branches: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] // Manages all 6 branches
    },
    staff: {
        id: 'STF-001',
        name: 'Nimal Silva',
        email: 'nimal@powerworld.com',
        phone: '+94 77 000 1111',
        role: 'staff',
        branchId: 'b3' // Assigned to Galle Branch (b3)
    }
};

export const TEST_BRANCHES = [
    { _id: 'b1', name: 'Colombo City Gym', location: 'Colombo' },
    { _id: 'b2', name: 'Kandy Fitness Center', location: 'Kandy' },
    { _id: 'b3', name: 'Galle Power Hub', location: 'Galle' },
    { _id: 'b4', name: 'Negombo Fitness', location: 'Negombo' },
    { _id: 'b5', name: 'Kurunegala Gym', location: 'Kurunegala' },
    { _id: 'b6', name: 'Matara Power Center', location: 'Matara' }
];
