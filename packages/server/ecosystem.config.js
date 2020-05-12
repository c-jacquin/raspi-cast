/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
const path = require('path');
const dotenv = require('dotenv');

dotenv.load({
  path: path.join(process.cwd(), '.env'),
});

module.exports = {
  apps: [
    {
      name: 'raspicast-server',
      script: path.join(process.cwd(), '/main.js'),
      instances: 1,
      production_env: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'pi',
      host: process.env.RASPI_IP,
      repo: 'git@github.com:charjac/raspi-cast-server.git',
      'pre-setup': 'sudo apt-get install -y git omxplayer figlet yarn',
      ref: 'origin/dev',
      path: '/home/pi/cast-server',
      'post-deploy':
        'source ~/.bashrc && yarn --production && yarn stop && yarn build && yarn start',
    },
  },
};
