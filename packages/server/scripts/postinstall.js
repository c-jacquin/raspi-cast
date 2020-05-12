/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const localEnvPath = path.join(process.cwd(), '.env');
const localEnv = `RASPI_IP=***.***.***.***

`;

if (!fs.existsSync(localEnvPath)) {
  fs.writeFileSync(localEnvPath, localEnv, { encoding: 'utf8' });
}
