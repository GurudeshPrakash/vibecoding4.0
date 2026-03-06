const dns = require('dns').promises;

async function checkSrv() {
    try {
        dns.setServers(['8.8.8.8']);
        const records = await dns.resolveSrv('_mongodb._tcp.powerworldtesting.4jhnluy.mongodb.net');
        for (const r of records) {
            console.log('SHARD: ' + r.name);
        }
    } catch (err) {
        console.error('FAIL: ' + err.message);
    }
}

checkSrv();
