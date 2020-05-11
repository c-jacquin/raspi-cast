import { Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { CastOptions, Events } from '@raspi-cast/core';
import { Socket } from 'socket.io';

import Player from './services/Player';
import Sockets from './services/Sockets';
import StreamProvider from './services/StreamProvider';

@WebSocketGateway()
class CastGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(Player) private player: Player,
    @Inject(StreamProvider) private streamProvider: StreamProvider,
    @Inject(Sockets) private sockets: Sockets,
  ) {}

  public async handleConnection(socket: Socket) {
    this.sockets.addClient(socket);

    socket.send(Events.INITIAL_STATE, {
      ...this.player.getState(),
      position: await this.player.getPosition(),
    });
  }

  public handleDisconnect(socket: Socket) {
    this.sockets.removeClient(socket);
  }

  @SubscribeMessage(Events.CAST)
  public async handleCast(client: Socket, options: CastOptions): Promise<void> {
    this.player.loadSpinner();

    const meta = await this.streamProvider.getStreamUrl(options);

    this.player.loadStream(meta);

    this.sockets.sendAll(Events.META, meta);
  }

  @SubscribeMessage(Events.PLAY)
  public handlePlay() {
    this.player.play();
  }

  @SubscribeMessage(Events.PAUSE)
  public handlePause() {
    this.player.pause();
  }

  @SubscribeMessage(Events.STOP)
  public handleQuit() {
    this.player.stop();
  }

  @SubscribeMessage(Events.SEEK)
  public handleSeek(client: Socket, data: string): void {
    this.player.seek(parseFloat(data));
  }

  @SubscribeMessage(Events.VOLUME)
  public handleVolume(client: Socket, data: string): void {
    this.player.setVolume(parseFloat(data));
  }
}

export default CastGateway;
