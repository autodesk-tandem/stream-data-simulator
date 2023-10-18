/*
    This example can be used to push data to given stream within the facility.
*/

// update values below according to your environment
// facility URN can be obtained from URL - it's text after last /
// the token can be obtained using Streams - Webhook Integration command
const FACILITY_URN = 'YOUR_FACILITY_URN';
const AUTH_TOKEN = 'YOUR_AUTHORIZATION_TOKEN';
const TIMEOUT = 5;

// this contains stream keys + template for data we want to send
const streamDataTemplate = {
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

async function sendDataToStream() {
    console.log(`sendDataToStream`);
    // stream data are stored in default model which has same id as facility
    const modelID = FACILITY_URN.replace('urn:adsk.dtt:', 'urn:adsk.dtm:');
    const payload = [];

    // iterate through stream template
    for (const streamId in streamDataTemplate) {
        const streamInputs = streamDataTemplate[streamId];
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
    const response = await fetch(`https://developer.api.autodesk.com/tandem/v1/timeseries/models/${modelID}/webhooks/generic`, {
        method: 'POST',
        headers: {
            'Authorization': AUTH_TOKEN
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