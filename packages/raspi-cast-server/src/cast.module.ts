import { Module } from '@nestjs/common';
import { CastSocket } from './cast.gateway';
import { Player } from './services/Player';
import { Screen } from './services/Screen';
import { YoutubeDl } from './services/YoutubeDl';

@Module({
  providers: [CastSocket, Screen, Player, YoutubeDl],
})
export class CastModule {}
