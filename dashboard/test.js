const fetch = require('node-fetch');

const API_URL = 'http://127.0.0.1:3000/api';

async function testFetch() {
    try {
        console.log("Testing GET...");
        const getRes = await fetch(`${API_URL}/dashboard-stats`);
        const getJson = await getRes.json();
        console.log("GET SUCCESS:", getJson?.state?.system_mode);
        
        console.log("Testing POST...");
        const postRes = await fetch(`${API_URL}/sensor-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tank_level: 50.0,
                input_flow: 10,
                kitchen_flow: 1,
                bathroom_flow: 1,
                drinking_flow: 1,
                plantation_flow: 1
            })
        });
        
        const postJson = await postRes.json();
        console.log("POST SUCCESS:", postJson);
    } catch(e) {
        console.error("TEST FAILED:", e);
    }
}

testFetch();
