/*
    This example can be used to push data to given stream within the facility.
*/

// update values below according to your environment
// facility URN can be obtained from URL - it's text after last /
// the token can be obtained using Streams - Webhook Integration command
const FACILITY_URN = 'YOUR_FACILITY_URN';
const AUTH_TOKEN = 'YOUR_AUTHORIZATION_TOKEN';
const BASE_PATH = 'https://tandem.autodesk.com/api/v1';
const TIMEOUT = 5; // in minutes

// this contains stream keys + template for data we want to send
const streamDataTemplate = {
    // this is key of the stream
    'AQAAAEiqpnFVIEhIj_yuyNW9I40AAAAA': {
        // this defines variable to be sent to Tandem. In case below the value is in range [15, 25]
        temperature: {
            min: 15,
            max: 25
        },
    },
    'AQAAAJoBmfwOwUgRirX5mUfyBfMAAAAA': {
        // In this case the value is one of the values from the array
        status: {
            values: [ 'ON', 'OFF' ]
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
            let value;

            if (streamInput.values) {
                const index = Math.floor(Math.random() * streamInput.values.length);

                value = streamInput.values[index];
            }
            if (streamInput.min !== undefined && streamInput.max !== undefined) {
                value = streamInput.min + Math.random() * (streamInput.max - streamInput.min);
            }
            if (value !== undefined) {
                streamData[streamInputName] = value;
            }
        }
        payload.push(streamData);
    }
    const response = await fetch(`${BASE_PATH}/timeseries/models/${modelID}/webhooks/generic`, {
        method: 'POST',
        headers: {
            'Authorization': AUTH_TOKEN
        },
        body: JSON.stringify(payload)
    });

    if (response.status === 403) {
        throw new Error(`failed to authorize, check your token/scope.`);
    }
    if (response.status !== 200) {
        console.warn(`unexpected response: ${response.status}`);
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