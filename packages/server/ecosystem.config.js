/* eslint-disable @typescript-eslint/camelcase */

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
};
