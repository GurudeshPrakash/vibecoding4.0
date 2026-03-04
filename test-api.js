
const fetch = require('node-fetch');

async function testStats() {
    try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard-stats');
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testStats();
