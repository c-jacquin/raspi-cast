/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
const path = require('path');
const dotenv = require('dotenv');

dotenv.load({
  path: path.join(process.cwd(), `env/local.env`),
});

if (!process.env.RASPI_IP) {
  throw new Error('You must specify RASPI_IP environment variable');
}

module.exports = {
  apps: [
    {
      name: 'raspicast-server',
      script: path.join(process.cwd(), 'dist/main.js'),
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
      'pre-setup':
        'sudo apt-get install git && sudo apt-get install omxplayer && sudo apt-get install figlet',
      ref: 'origin/dev',
      path: '/home/pi/cast-server',
      'post-deploy':
        'source ~/.bashrc && npm i && npm run stop && npm run build && npm start',
    },
  },
};
