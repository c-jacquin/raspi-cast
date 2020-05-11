import { Injectable, Inject } from '@nestjs/common';
import {
  camelize,
  PlaybackStatus,
  PlayerState,
  CastMeta,
} from '@raspi-cast/core';
import autobind from 'autobind-decorator';
import dbus from 'dbus-next';
import path from 'path';

import Screen from './Screen';
import Sockets from './Sockets';

const Variant: any = dbus.Variant;

const spinner = path.join(process.cwd(), 'assets/loading-screen.mp4');

const playerMprisInterface =
  process.env.NODE_ENV === 'development'
    ? 'org.mpris.MediaPlayer2.vlc'
    : 'org.mpris.MediaPlayer2.omxplayer';

@Injectable()
class Player {
  private player: dbus.ClientInterface;
  private properties: dbus.ClientInterface;
  private state: PlayerState = {
    isPending: false,
    canPlay: false,
    canSeek: false,
  };

  constructor(
    @Inject(Sockets) private sockets: Sockets,
    @Inject(Screen) private screen: Screen,
  ) {}

  private setState(dif: Partial<PlayerState>) {
    this.state = {
      ...this.state,
      ...dif,
    };
  }

  public getState() {
    return this.state;
  }

  @autobind
  private handlePropertyChange(iface: unknown, changed: any) {
    for (const prop of Object.keys(changed)) {
      if (
        prop === 'PlaybackStatus' &&
        changed[prop].value === PlaybackStatus.STOPPED &&
        process.env.NODE_ENV === 'production'
      ) {
        this.screen.printIp();
      }
      switch (prop) {
        case 'PlaybackStatus':
        case 'Volume':
        case 'CanSeek':
        case 'CanPlay':
          const formattedProp = camelize(prop);

          this.setState({
            [formattedProp]: changed[prop].value,
          });

          this.sockets.sendAll(formattedProp, changed[prop].value);
          break;
      }
    }
  }

  public async init(): Promise<void> {
    try {
      const bus = dbus.sessionBus();
      const obj = await bus.getProxyObject(
        playerMprisInterface,
        '/org/mpris/MediaPlayer2',
      );

      this.player = obj.getInterface('org.mpris.MediaPlayer2.Player');
      this.properties = obj.getInterface('org.freedesktop.DBus.Properties');

      this.properties.on('PropertiesChanged', this.handlePropertyChange);
    } catch (err) {
      throw new Error(
        `${playerMprisInterface.split('.').pop()} is not running`,
      );
    }
  }

  public async getPosition(): Promise<number> {
    const position = await this.properties.Get(
      'org.mpris.MediaPlayer2.Player',
      'Position',
    );

    return position.value;
  }

  public setVolume(volume: number): Promise<void> {
    return this.properties.Set(
      'org.mpris.MediaPlayer2.Player',
      'Volume',
      new Variant('d', volume),
    );
  }

  public loadSpinner() {
    this.player.OpenUri(`file://${spinner}`);
  }

  public loadStream(meta: CastMeta) {
    this.state.meta = meta;
    this.player.OpenUri(meta.url);
  }

  public play(): void {
    this.state.canPlay && this.player.Play();
  }

  public pause() {
    this.state.canPlay && this.player.Pause();
  }

  public stop() {
    this.player.Stop();
  }

  public seek(position: number): void {
    this.state.canSeek && this.player.Seek(position);
  }

  public isPending(): boolean {
    return this.state.isPending;
  }

  public isPlaying() {
    return this.state.playbackStatus === PlaybackStatus.PLAYING;
  }
}

export default Player;
