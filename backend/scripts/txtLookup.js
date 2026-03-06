const dns = require('dns').promises;

async function checkTxt() {
    try {
        dns.setServers(['8.8.8.8']);
        const records = await dns.resolveTxt('powerworldtesting.4jhnluy.mongodb.net');
        for (const r of records) {
            console.log('TXT: ' + r.join(''));
        }
    } catch (err) {
        console.error('FAIL: ' + err.message);
    }
}

checkTxt();
