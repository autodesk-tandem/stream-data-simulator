/*
    This example can be used to push  data to given stream within the facility.
    
    It uses 2-legged authentication - this requires that application is added to facility as service.
*/
import { createToken } from './auth.js';

// update values below according to your environment
const APS_CLIENT_ID = 'YOUR_CLIENT_ID';
const APS_CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const FACILITY_URN = 'YOUR_FACILITY_URN';
const STREAM_ID = 'YOUR_STREAM_ID';
const TIMEOUT = 5;

async function sendDataToStream() {
    console.log(`sendDataToStream`);
    const token = await createToken(APS_CLIENT_ID, APS_CLIENT_SECRET,
        'data:read data:write');
    
    const modelID = FACILITY_URN.replace('urn:adsk.dtt:', 'urn:adsk.dtm:');
    const payload = {
        id: STREAM_ID,
        temperature: 15 + Math.random() * 10 // range [15, 25]
    };

    const response = await fetch(`https://tandem.autodesk.com/api/v1/timeseries/models/${modelID}/webhooks/generic`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (response.status === 403) {
        throw new Error(`failed to authorize, check your token/scope.`);
    }
    console.log(`  data sent to stream: ${payload.temperature}`);
}

function main() {
    setInterval(sendDataToStream, TIMEOUT * 60 * 1000);
}

main();