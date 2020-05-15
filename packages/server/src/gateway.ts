import { Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
} from '@nestjs/websockets';
import { CastOptions, Events } from '@raspi-cast/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket } from 'socket.io';

import Player from './services/Player';
import Sockets from './services/Sockets';
import StreamProvider from './services/StreamProvider';

@WebSocketGateway()
class CastGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    @Inject(Player) private player: Player,
    @Inject(StreamProvider) private streamProvider: StreamProvider,
    @Inject(Sockets) private sockets: Sockets,
  ) {}

  public afterInit() {
    setInterval(async () => {
      if (this.player.isPlaying()) {
        const position = await this.player.getPosition();

        this.sockets.sendAll(Events.POSITION, { position });
      }
    }, 1000);
  }

  public handleConnection(socket: Socket) {
    this.sockets.addClient(socket);
  }

  public handleDisconnect(socket: Socket) {
    this.sockets.removeClient(socket);
  }

  @SubscribeMessage(Events.INITIAL_STATE)
  public async handleInitialState() {
    return from(this.player.getPosition()).pipe(
      map((position) => ({
        event: Events.INITIAL_STATE,
        data: {
          ...this.player.getState(),
          position,
        },
      })),
    );
  }

  @SubscribeMessage(Events.CAST)
  public async handleCast(client: Socket, options: CastOptions): Promise<void> {
    this.player.loadSpinner();

    const meta = await this.streamProvider.getStreamUrl(options);

    this.player.loadStream(meta);

    this.sockets.sendAll(Events.META, { meta, isPending: false });
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
    this.player.seek(parseInt(data));
  }

  @SubscribeMessage(Events.VOLUME)
  public handleVolume(client: Socket, data: string): void {
    this.player.setVolume(parseFloat(data));
  }
}

export default CastGateway;
