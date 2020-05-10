import { spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import 'reflect-metadata';

dotenv.config({
  path: path.join(process.cwd(), `env/${process.env.NODE_ENV}.env`),
});

import { NestFactory } from '@nestjs/core';

import { CastModule } from './cast.module';
import { Screen } from './services/Screen';

(async () => {
  try {
    const app = await NestFactory.create(CastModule, {});
    const screen = app.get<Screen>(Screen);

    await app.listen(Number(process.env.SOCKET_PORT));
    if (process.env.NODE_ENV === 'production') {
      spawn('setterm', ['-powersave', 'off', '-blank', '0']);
      screen.printIp();
    } else {
      console.log(`server is running on ${process.env.SOCKET_PORT}`);
      console.log('player init  ! ! ! !');
    }
  } catch (err) {
    console.error('something fail during bootstrap');
    console.error(err);
  }
})();
