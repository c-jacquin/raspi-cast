import { Module } from '@nestjs/common';
import CastSocket from './cast.gateway';
import Player from './services/Player';
import Screen from './services/Screen';
import StreamProvider from './services/StreamProvider';
import Sockets from './services/Sockets';

@Module({
  providers: [CastSocket, Screen, Player, StreamProvider, Sockets],
})
export class CastModule {}
