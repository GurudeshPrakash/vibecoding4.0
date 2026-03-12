export const ADMIN_BRANCHES = [
    { _id: 'b1', name: 'Colombo City Gym', location: 'Colombo', openingHours: '6:00 AM - 11:00 PM', photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80', type: 'AC' },
    { _id: 'b2', name: 'Kandy Fitness Center', location: 'Kandy', openingHours: '6:00 AM - 11:00 PM', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', type: 'AC' },
    { _id: 'b3', name: 'Galle Power Hub', location: 'Galle', openingHours: '6:00 AM - 10:00 PM', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', type: 'AC' },
    { _id: 'b4', name: 'Negombo Fitness', location: 'Negombo', openingHours: '6:00 AM - 10:00 PM', photo: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80', type: 'Non-AC' },
    { _id: 'b5', name: 'Kurunegala Gym', location: 'Kurunegala', openingHours: '6:00 AM - 10:00 PM', photo: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80', type: 'Non-AC' },
    { _id: 'b6', name: 'Matara Fitness', location: 'Matara', openingHours: '6:00 AM - 10:00 PM', photo: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80', type: 'Non-AC' },
];

// ─── DEFAULT STAFF ──────────────────────────
export const DEFAULT_STAFF = [
    { _id: 's1', staffId: 'STF-0001', firstName: 'Niluka', lastName: 'Perera', phone: '+94 77 111 2233', branchId: 'b1', joinDate: '2024-01-15', status: 'Active', nic: '958822334V', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' },
    { _id: 's2', staffId: 'STF-9763', firstName: 'Mithula', lastName: 'Kuganesan', phone: '+94 76 112 7146', branchId: 'b2', joinDate: '2024-03-10', status: 'Active', nic: '985533445V', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
    { _id: 's3', staffId: 'STF-5987', firstName: 'Sugirtha', lastName: 'Kuganesan', phone: '+94 76 112 7146', branchId: 'b3', joinDate: '2023-11-05', status: 'Active', nic: '974455667V', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=400&q=80' },
    { _id: 's4', staffId: 'STF-9750', firstName: 'Vithushi', lastName: 'Kuganesan', phone: '+94 76 112 7146', branchId: 'b4', joinDate: '2025-01-20', status: 'Active', nic: '996677889V', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
    { _id: 's5', staffId: 'STF-7115', firstName: 'Guru', lastName: 'Praksh', phone: '+94 76 112 7146', branchId: 'b5', joinDate: '2024-08-01', status: 'Active', nic: '921100223V', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
    { _id: 's6', staffId: 'STF-7980', firstName: 'Kuganesan', lastName: 'Kandasamy', phone: '+94 76 112 7146', branchId: 'b6', joinDate: '2024-05-12', status: 'Active', nic: '752233445V', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
];

// ─── INVENTORY RELATED ────────────────────────
export const STATUS_CONFIG = {
    'Good': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
    'Available': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
    'Maintenance': { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
    'Damaged': { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export const CATEGORIES = ['All', 'Cardio', 'Weight Machine', 'Free Weights'];
export const STATUSES = ['Good', 'Maintenance', 'Damaged'];

export const MOCK_INVENTORY = [
    { id: 'TM-001', branchId: 'b1', name: 'Commercial Treadmill Gen-X', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Life Fitness', model: '95T', serial: 'SN-TM-001', lastMaintenance: '2026-01-15', nextMaintenance: '2026-04-15', photo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800' },
    { id: 'TM-002', branchId: 'b1', name: 'Commercial Treadmill Gen-X', category: 'Cardio', status: 'Maintenance', area: 'Cardio Zone', brand: 'Life Fitness', model: '95T', serial: 'SN-TM-002', lastMaintenance: '2025-12-01', nextMaintenance: '2026-03-15', photo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800' },
    { id: 'EB-001', branchId: 'b2', name: 'Upright Stationary Bike', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Matrix', model: 'U50', serial: 'SN-EB-001', lastMaintenance: '2026-02-10', nextMaintenance: '2026-05-10', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
    { id: 'LP-001', branchId: 'b3', name: '45-Degree Leg Press', category: 'Weight Machine', status: 'Good', area: 'Strength Zone', brand: 'Hammer Strength', model: 'MTS-LP', serial: 'SN-LP-001', lastMaintenance: '2026-02-01', nextMaintenance: '2026-08-01', photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800' },
    { id: 'CC-001', branchId: 'b4', name: 'Dual Cable Crossover', category: 'Weight Machine', status: 'Good', area: 'Strength Zone', brand: 'Precor', model: 'FTS-Glide', serial: 'SN-CC-001', lastMaintenance: '2026-01-20', nextMaintenance: '2026-07-20', photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
    { id: 'RM-001', branchId: 'b5', name: 'Concept2 RowErg', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Concept2', model: 'Model D', serial: 'SN-RM-001', lastMaintenance: '2026-02-15', nextMaintenance: '2026-05-15', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800' },
    { id: 'FB-001', branchId: 'b6', name: 'Adjustable Flat Bench', category: 'Free Weights', status: 'Good', area: 'Free Weights', brand: 'Body-Solid', model: 'GFID71', serial: 'SN-FB-001', lastMaintenance: '2025-11-20', nextMaintenance: '2026-05-20', photo: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800' },
    { id: 'SM-001', branchId: 'b1', name: 'Pro Smith Machine', category: 'Weight Machine', status: 'Damaged', area: 'Strength Zone', brand: 'Body-Solid', model: 'GDCC300', serial: 'SN-SM-001', lastMaintenance: '2025-10-01', nextMaintenance: '2026-01-01', photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800' },
    { id: 'DB-001', branchId: 'b2', name: 'Dumbbell Set (5kg-50kg)', category: 'Free Weights', status: 'Good', area: 'Free Weights', brand: 'Rogue', model: 'Rubber Hex', serial: 'SN-DB-SET-01', lastMaintenance: '2026-01-05', nextMaintenance: '2026-07-05', photo: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?auto=format&fit=crop&q=80&w=800' },
    { id: 'BC-001', branchId: 'b3', name: 'Olympic Barbell', category: 'Free Weights', status: 'Good', area: 'Free Weights', brand: 'Rogue', model: 'Ohio Bar', serial: 'SN-BC-001', lastMaintenance: '2026-02-10', nextMaintenance: '2026-08-10', photo: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800' },
    { id: 'EL-001', branchId: 'b4', name: 'Elliptical Trainer E7', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Life Fitness', model: 'E7 GO', serial: 'SN-EL-001', lastMaintenance: '2026-01-05', nextMaintenance: '2026-04-05', photo: 'https://images.unsplash.com/photo-1571388208497-71bedc66e932?auto=format&fit=crop&q=80&w=800' },
    { id: 'CH-001', branchId: 'b5', name: 'Chest Press Machine', category: 'Weight Machine', status: 'Good', area: 'Strength Zone', brand: 'Matrix', model: 'G7-S13', serial: 'SN-CH-001', lastMaintenance: '2026-01-20', nextMaintenance: '2026-07-20', photo: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=800' },
    { id: 'LD-001', branchId: 'b6', name: 'Lat Pulldown Station', category: 'Weight Machine', status: 'Maintenance', area: 'Strength Zone', brand: 'Hammer Strength', model: 'MTS-LD', serial: 'SN-LD-001', lastMaintenance: '2026-02-15', nextMaintenance: '2026-03-15', photo: 'https://images.unsplash.com/photo-1591940746222-e8d2f7f00ce2?auto=format&fit=crop&q=80&w=800' },
    { id: 'EQ-007', branchId: 'b1', name: 'Barbell Rack', category: 'Weight Machine', status: 'Good', area: 'Free Weights', brand: 'Matrix', serial: 'MX-B-9922', lastMaintenance: '2025-01-10', photo: 'https://images.squarespace-cdn.com/content/v1/5941def92994ca6f59f816c1/1516668799407-7SUML73X83L8SUH789RE/shutterstock_430391353.jpg' },
];

export const AVATAR_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

export const MOCK_MEMBERS = [
    { id: 'M-1024', name: 'Arjun Perera', email: 'arjun.p@example.com', phone: '077 123 4567', type: 'Monthly', status: 'Active', enrollDate: '2026-01-10', expire: '2026-03-10' },
    { id: 'M-1056', name: 'Sarah Mendis', email: 'sarah.m@example.com', phone: '071 234 5678', type: 'Annual', status: 'Active', enrollDate: '2025-11-20', expire: '2026-11-20' },
    { id: 'M-1089', name: 'Dilshan Silva', email: 'dilshan.s@example.com', phone: '076 345 6789', type: 'Quarterly', status: 'Active', enrollDate: '2025-12-15', expire: '2026-03-15' },
    { id: 'M-1102', name: 'Anjali Gunawardena', email: 'anjali@example.com', phone: '072 456 7890', type: 'Monthly', status: 'Active', enrollDate: '2026-02-05', expire: '2026-03-05' },
    { id: 'M-1115', name: 'Kasun Rajapaksa', email: 'kasun.r@example.com', phone: '075 567 8901', type: 'Annual', status: 'Expired', enrollDate: '2025-02-10', expire: '2026-02-10' },
    { id: 'M-1128', name: 'Nirosha Fernando', email: 'nirosha@example.com', phone: '070 678 9012', type: 'Monthly', status: 'Active', enrollDate: '2026-02-15', expire: '2026-03-15' },
    { id: 'M-1142', name: 'Damith Perera', email: 'damith@example.com', phone: '077 789 0123', type: 'Quarterly', status: 'Active', enrollDate: '2026-01-05', expire: '2026-04-05' },
    { id: 'M-1156', name: 'Priyanka Jayasuriya', email: 'priyanka@example.com', phone: '071 890 1234', type: 'Annual', status: 'Active', enrollDate: '2025-10-20', expire: '2026-10-20' },
    { id: 'M-1170', name: 'Ruwan Kumara', email: 'ruwan@example.com', phone: '076 901 2345', type: 'Monthly', status: 'Active', enrollDate: '2026-03-01', expire: '2026-04-01' },
    { id: 'M-1185', name: 'Lakmini Silva', email: 'lakmini@example.com', phone: '072 012 3456', type: 'Monthly', status: 'Expired', enrollDate: '2026-01-28', expire: '2026-02-28' },
    { id: 'M-1201', name: 'Ishara Madushanka', email: 'ishara@example.com', phone: '075 123 4567', type: 'Quarterly', status: 'Active', enrollDate: '2026-02-10', expire: '2026-05-10' },
    { id: 'M-1215', name: 'Tharindu Fernando', email: 'tharindu@example.com', phone: '070 234 5678', type: 'Annual', status: 'Active', enrollDate: '2025-12-05', expire: '2026-12-05' },
    { id: 'M-1230', name: 'Sanduni Perera', email: 'sanduni@example.com', phone: '077 345 6789', type: 'Monthly', status: 'Active', enrollDate: '2026-02-20', expire: '2026-03-20' },
    { id: 'M-1245', name: 'Malith Silva', email: 'malith@example.com', phone: '071 456 7890', type: 'Annual', status: 'Active', enrollDate: '2025-09-15', expire: '2026-09-15' },
    { id: 'M-1260', name: 'Dinithi Jayasinghe', email: 'dinithi@example.com', phone: '076 567 8901', type: 'Quarterly', status: 'Active', enrollDate: '2026-01-20', expire: '2026-04-20' },
];
