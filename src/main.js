/*
    This example can be used to push  data to given stream within the facility.
    
    It uses 2-legged authentication - this requires that application is added to facility as service.
*/
import { createToken } from './auth.js';

// update values below according to your environment
const APS_CLIENT_ID = 'YOUR_CLIENT_ID';
const APS_CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const FACILITY_URN = 'YOUR_FACILITY_URN';
const TIMEOUT = 5;

// this contains stream keys + data
const streams = {
    // this is key of the stream
    'AQAAAEiqpnFVIEhIj_yuyNW9I40AAAAA': {
        // this defines variable to be sent to Tandem. In case below the value is in range [15, 25]
        temperature: {
            min: 15,
            max: 25
        }
    },
    'AQAAAFgCMfk2rkoSjwJxwXs4Bh0AAAAA': {
        temperature: {
            min: 15,
            max: 25
        }
    }
};

let token;
let expires_at;

async function sendDataToStream() {
    console.log(`sendDataToStream`);
    // check if token is valid and not expired (5s tolerance)
    if (!token || expires_at < (Date.now() - 5000)) {
        token = await createToken(APS_CLIENT_ID, APS_CLIENT_SECRET,
            'data:read data:write');
        expires_at = Date.now() + token.expires_in * 1000;
        console.debug(`token expiration: ${expires_at}`);
    }
    const modelID = FACILITY_URN.replace('urn:adsk.dtt:', 'urn:adsk.dtm:');
    const payload = [];

    for (const streamId in streams) {
        const streamInputs = streams[streamId];
        const streamData = {
            id: streamId
        };

        for (const streamInputName in streamInputs) {
            const streamInput = streamInputs[streamInputName];
            const value = streamInput.min + Math.random() * (streamInput.max - streamInput.min);
    
            streamData[streamInputName] = value;
        }
        payload.push(streamData);
    }
    const response = await fetch(`https://tandem.autodesk.com/api/v1/timeseries/models/${modelID}/webhooks/generic`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token.access_token}`
        },
        body: JSON.stringify(payload)
    });

    if (response.status === 403) {
        throw new Error(`failed to authorize, check your token/scope.`);
    }
    console.log(`  number of updated streams: ${payload.length}`);
}

function main() {
    sendDataToStream();
    if (TIMEOUT > 0) {
        setInterval(sendDataToStream, TIMEOUT * 60 * 1000);
    }
}

main();