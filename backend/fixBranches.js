const mongoose = require('mongoose');
require('dotenv').config();

const BranchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    phone: String,
    operatingHours: String,
    adminName: String,
    adminPhone: String,
    inventorySummary: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Branch = mongoose.models.Branch || mongoose.model('Branch', BranchSchema);

const branches = [
    { name: "ATTIDIYA", location: "144/1, BAKERY JUNCTION, ATTIDIYA", phone: "0112728465" },
    { name: "BELLANTHARA", location: "54, NIKAPE ROAD, DEHIWELA.", phone: "0114805250" },
    { name: "BOKUNDARA", location: "201/1/D, COLOMBO ROAD, BOKUNDARA, PILIYANDALA.", phone: "0112709696" },
    { name: "BORALESGAMUWA", location: "432, COLOMBO ROAD, BORALESGAMUWA.", phone: "0114199309" },
    { name: "DEHIWALA-LADIES", location: "228/7, 1/1 HILL STREET, DEHIWELA.", phone: "0112714812" },
    { name: "ETHUL KOTTE", location: "984, KOTTE ROAD, ETHUL KOTTE", phone: "0114758722" },
    { name: "HIGH LEVEL", location: "352, 3/1, HIGH LEVEL RD, NUGEGODA.", phone: "0114219110" },
    { name: "HOKANDARA", location: "457, 4/1, ARANGALA HOKANDARA NORTH, HOKANDARA.", phone: "0114879489" },
    { name: "IDH", location: "877 A, 2/1, THALAGAHA JUNCTION, NEW TOWN, GOTHATUWA.", phone: "0112792050" },
    { name: "KALUBOWILA", location: "155, 1/1, HOSPITAL RD, KALUBOWILA.", phone: "0114203615" },
    { name: "KIRIBATHGODA", location: "311, KANDY ROAD, GALA JUNCTION, KIRIBATHGODA.", phone: "0114203615" },
    { name: "KOTAHENA", location: "108, 2/1, GEORGE R DE SILVA MAWATHA, KOTAHENA.", phone: "0117173934" },
    { name: "KOTHALAWALA", location: "349/A/3, NEW KANDY ROAD, KOTHALAWALA", phone: "0114294223" },
    { name: "KOTTAWA", location: "685A, OLD KOTTAWA RD, KOTTAWA.", phone: "0117173123" },
    { name: "LONGDEN PLACE", location: "No 28, MALALASEKERA MAWATHA COLOMBO 7.", phone: "0114954633" },
    { name: "MAHARAGAMA", location: "134/B, HIGH LEVEL ROAD, MAHARAGAMA.", phone: "0114369220" },
    { name: "MALABE", location: "780/ 1/2, THALANGAMA NORTH, MALABE.", phone: "0112791597" },
    { name: "MORATUWA", location: "521, 2ND FLOOR, GALLE ROAD, KATUBEDDA, MORATUWA", phone: "0112649700" },
    { name: "NAWALA", location: "17, RANAWIRU MAWATHA, NAWALA ROAD, KOSWATTA RAJAGIRIYA.", phone: "0117871902" },
    { name: "OBESEKARAPURA", location: "185 B, 1/1, OBESEKERA ROAD, RAJAGIRIYA", phone: "0112875770" },
    { name: "PANADURA", location: "305, 3/1, GALLE ROAD, PANADURA.", phone: "0382238900" },
    { name: "RAGAMA", location: "51, 2/1, KADAWATHA ROAD, RAGAMA.", phone: "0112967699" },
    { name: "TAMIL UNION", location: "301, LESLEY RANAGALA MAWATHA, COLOMBO 8.", phone: "0114959878" },
    { name: "WELISARA", location: "621 NEGOMBO ROAD, MAGAMMANA", phone: "0117101577" }
];

const seed = async () => {
    try {
        console.log('Connecting to Mongo...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        for (const b of branches) {
            console.log(`Checking ${b.name}...`);
            await Branch.findOneAndUpdate(
                { name: b.name },
                { $set: b },
                { upsert: true, new: true }
            );
        }

        const total = await Branch.countDocuments();
        console.log(`SUCCESS: Total branches in DB: ${total}`);
        process.exit();
    } catch (e) {
        console.error('ERROR:', e);
        process.exit(1);
    }
};

seed();
