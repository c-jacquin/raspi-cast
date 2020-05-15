import { spawn } from 'child_process';
import { NestFactory } from '@nestjs/core';
import { Config } from '@raspi-cast/core';
import 'reflect-metadata';

import { CastModule } from './module';
import Player from './services/Player';
import Screen from './services/Screen';

(async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      spawn('vlc');
    }
    const app = await NestFactory.create(CastModule, {});
    const screen = app.get<Screen>(Screen);
    const player = app.get<Player>(Player);
    const config = app.get<Config>('config');

    await player.init();
    await app.listen(config.port);

    if (process.env.NODE_ENV === 'production') {
      spawn('setterm', ['-powersave', 'off', '-blank', '0']);
      screen.printIp();
    } else {
      console.log(`server is running on port 8181`);
    }
  } catch (err) {
    console.error('something fail during bootstrap');
    console.error(err);
  }
})();
