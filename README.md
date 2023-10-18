# Stream Device Simulator
This repository contains simple example how to send data to stream in the facility. The example is written using JavaScript and require [Node.js](https://nodejs.org/en).

## Configuration
The examples use 2-legged authentication in case when authentication is needed. This needs that application is added to facility as service:
1. Create new application using [APS Portal](https://aps.autodesk.com/myapps/).
2. Open facility in Autodesk Tandem.
3. Navigate to Users, then select Service and enter *Client ID* of application from step 1 above. Make sure to specify correct permission.
4. After this aplication should be able to use 2-legged token when interaction with facility.

## Usage
1. Open folder using your code editor.
2. Navigate to `main.js` and open it.
3. On top of the file there is block with global variables. Replace those variables according to your environment:
  ``` js
  // update values below according to your environment
  const APS_CLIENT_ID = 'YOUR_CLIENT_ID';
  const APS_CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
  const FACILITY_URN = 'YOUR_FACILITY_URN';
  const TIMEOUT = 5;
  ```
4. Review and update `streamDataTemplate` variable as needed. This defines data to be send to the streams.
   **Note** You need to use stream keys according to your facility.
5. Save your changes and execute using `npm start`. Use **Ctrl+C** to stop the script.
