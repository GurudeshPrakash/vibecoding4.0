export const INITIAL_PROFILES = {
    super_admin: [
        {
            id: "SAD-001",
            firstName: "Shahana",
            surname: "Kuganesan",
            email: "shahana@powerworld.lk",
            phone: "+94 77 123 4567",
            nic: "987654321V",
            role: "Super Admin",
            address: "123 Main St, Colombo 07",
            dateJoined: "2023-01-01",
            photo: "https://i.pravatar.cc/150?u=shahana"
        }
    ],
    admin: [
        {
            id: "ADM-001",
            firstName: "Niluka",
            surname: "Perera",
            email: "niluka@powerworld.lk",
            phone: "+94 77 111 2233",
            nic: "958822334V",
            role: "Admin",
            address: "45 Galle Rd, Colombo 03",
            dateJoined: "2024-01-15",
            branchAssignment: "Colombo City Gym",
            photo: "https://i.pravatar.cc/150?u=niluka"
        },
        {
            id: "ADM-002",
            firstName: "Prakash",
            surname: "Sivalingam",
            email: "prakash@powerworld.lk",
            phone: "+94 77 222 3344",
            nic: "941234567V",
            role: "Admin",
            address: "78 Peradeniya Rd, Kandy",
            dateJoined: "2024-02-01",
            branchAssignment: "Kandy Fitness Center",
            photo: "https://i.pravatar.cc/150?u=prakash"
        },
        {
            id: "ADM-003",
            firstName: "Kamal",
            surname: "Perera",
            email: "kamal@powerworld.lk",
            phone: "+94 77 333 4455",
            nic: "931234567V",
            role: "Admin",
            address: "12 Fort Area, Galle",
            dateJoined: "2024-02-15",
            branchAssignment: "Galle Branch",
            photo: "https://i.pravatar.cc/150?u=kamal"
        },
        {
            id: "ADM-004",
            firstName: "Nirosh",
            surname: "Mendis",
            email: "nirosh@powerworld.lk",
            phone: "+94 77 444 5566",
            nic: "921234567V",
            role: "Admin",
            address: "90 Beach Rd, Negombo",
            dateJoined: "2024-03-01",
            branchAssignment: "Negombo Fitness",
            photo: "https://i.pravatar.cc/150?u=nirosh"
        }
    ],
    staff: Array.from({ length: 24 }).map((_, i) => ({
        id: `STF-${String(i + 1).padStart(3, '0')}`,
        firstName: i === 0 ? "Mithula" : ["John", "Jane", "Mike", "Sarah", "David", "Emma", "Robert", "Linda", "Chris", "Susan"][i % 10],
        surname: i === 0 ? "Kuganesan" : ["Perera", "Silva", "Fernandez", "Mendis", "Rodrigo", "Gunawardena", "Rajapaksa", "Seneviratne", "Dias", "Jayasooriya"][i % 10],
        email: i === 0 ? "mithula@powerworld.lk" : `${["john", "jane", "mike", "sarah", "david", "emma", "robert", "linda", "chris", "susan"][i % 10]}.${i}@powerworld.lk`,
        phone: `+94 76 ${1000000 + i}`,
        nic: `${800000000 + i}V`,
        role: "Staff",
        address: `${i + 10} Temple Rd, ${['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Kurunegala'][i % 6]}`,
        dateJoined: `2024-0${(i % 5) + 1}-10`,
        branchAssignment: `${['Colombo City Gym', 'Kandy Fitness Center', 'Galle Branch', 'Negombo Fitness', 'Kurunegala Gym', 'Jaffna Fitness'][i % 6]}`,
        photo: `https://i.pravatar.cc/150?u=staff${i}`
    }))
};
