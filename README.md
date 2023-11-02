# Stream Device Simulator
This repository contains simple example how to send data to stream in the facility. The example is written using JavaScript and require [Node.js](https://nodejs.org/en).

## Configuration
1. Open folder using your code editor.
2. Navigate to `main.js` and open it.
3. On top of the file there is block with global variables. Replace those variables according to your environment:
  ``` js
  // update values below according to your environment
  const BASE_PATH = 'https://developer.api.autodesk.com/tandem/v1';
  const FACILITY_URN = 'YOUR_FACILITY_URN';
  const AUTH_TOKEN = 'YOUR_AUTHORIZATION_TOKEN';
  const TIMEOUT = 5;
  ```
4. Review and update `streamDataTemplate` variable as needed. This defines data to be send to the streams.
   **Note** You need to use stream keys according to your facility. Easiest way to get stream keys is to use **Streams - Import/Export Connections** command. It exports stream information to CSV file. The key of the stream is stored under **fullId** column.
5. Save your changes.

## Usage
Execute using `npm start`. Use **Ctrl+C** to stop the script.
