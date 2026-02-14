
const https = require('https');

// Hardcoded for test (to bypass dotenv issues)
const url = "https://chyxsxvtmakdypzrmlwh.supabase.co";

console.log('Testing connection to:', url);

const req = https.get(url, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log('Reachability Check: SUCCESS');

    // Check Auth Endpoint specifically
    const authUrl = `${url}/auth/v1/health`;
    console.log('\nTesting Auth Endpoint:', authUrl);

    const authReq = https.get(authUrl, (authRes) => {
        console.log(`AUTH STATUS: ${authRes.statusCode}`);
        if (authRes.statusCode === 200) {
            console.log('Auth Service Check: ONLINE');
        } else {
            console.log('Auth Service Check: WARNING (Status ' + authRes.statusCode + ')');
        }
    });

    authReq.on('error', (e) => {
        console.error('Auth Endpoint Error:', e.message);
    });

});

req.on('error', (e) => {
    console.error(`Reachability Check FAILURE: ${e.message}`);
});

req.end();
