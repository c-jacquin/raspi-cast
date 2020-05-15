import { Module } from '@nestjs/common';
import { config } from '@raspi-cast/core';

import CastSocket from './gateway';
import Player from './services/Player';
import Screen from './services/Screen';
import StreamProvider from './services/StreamProvider';
import Sockets from './services/Sockets';

@Module({
  providers: [
    CastSocket,
    Screen,
    Player,
    StreamProvider,
    Sockets,
    { provide: 'config', useValue: config },
  ],
})
export class CastModule {}
