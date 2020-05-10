import { Injectable } from '@nestjs/common';
import dbus, { Variant } from 'dbus-next';
import path from 'path';
import { Subject } from 'rxjs';

import { PlaybackStatus, PlayerState } from '@raspi-cast/core';

const spinner = path.join(process.cwd(), 'assets/loading-screen.mp4');

const playerMprisInterface =
  process.env.NODE_ENV === 'development'
    ? 'org.mpris.MediaPlayer2.vlc'
    : 'org.mpris.MediaPlayer2.omxplayer';

@Injectable()
export class Player {
  private player: dbus.ClientInterface;
  private properties: dbus.ClientInterface;
  private state: PlayerState = {
    isPlaying: false,
    isPending: false,
    isStarted: false,
  };
  public close$ = new Subject<void>();

  public async init(
    source = spinner,
    // loop = false,
    // output = 'both',
    // noOsd = false,
  ): Promise<any> {
    const bus = dbus.sessionBus();
    const obj = await bus.getProxyObject(
      playerMprisInterface,
      '/org/mpris/MediaPlayer2',
    );

    this.player = obj.getInterface('org.mpris.MediaPlayer2.Player');
    this.properties = obj.getInterface('org.freedesktop.DBus.Properties');

    console.log('open ', source);
    await this.player.OpenUri(`file://${source}`);
  }

  public async getDuration(): Promise<any> {
    const duration = await this.properties.Get(
      'org.mpris.MediaPlayer2.Player',
      'Duration',
    );

    return duration / 1000 / 1000;
  }

  public play(): void {
    this.player.Play();
  }

  public pause() {
    this.player.Pause();
  }

  public getStatus(): Promise<any> {
    return this.properties.Get(
      'org.mpris.MediaPlayer2.Player',
      'PlaybackStatus',
    );
  }

  public async getPosition(): Promise<any> {
    const position = await this.properties.Get(
      'org.mpris.MediaPlayer2.Player',
      'Position',
    );

    return position.value;
  }

  public async setPosition(position: number): Promise<any> {
    await this.properties.Set(
      'org.mpris.MediaPlayer2.Player',
      'Position',
      new (Variant as any)('x', position),
    );
    this.state.isPending = false;

    return position;
  }

  public quit(): Promise<any> {
    return this.player.Stop();
  }

  public async seek(position: number): Promise<any> {
    this.state.isPending = true;
    await this.player.Seek(position);

    this.state.isPending = false;
    return position;
  }

  public setVolume(volume: number): Promise<any> {
    this.state.volume = volume;
    return this.properties.Set(
      'org.mpris.MediaPlayer2.Player',
      'Volume',
      new (Variant as any)('d', volume),
    );
  }

  public async getVolume(): Promise<any> {
    if (this.state.volume) {
      return Promise.resolve(this.state.volume);
    } else {
      const volume = await this.properties.Get(
        'org.mpris.MediaPlayer2.Player',
        'Volume',
      );
      this.state.volume = volume.value;
      return volume.value;
    }
  }

  public async increaseVolume(): Promise<any> {
    const volume = await this.getVolume();

    this.setVolume(volume + 0.05);

    return volume + 0.05;
  }

  public async decreaseVolume(): Promise<any> {
    const volume = await this.getVolume();

    this.setVolume(volume - 0.05);

    return volume - 0.05;
  }

  public isPlaying(): boolean {
    return this.state.isPlaying;
  }

  public isStarted(): boolean {
    return this.state.isStarted;
  }

  public isPending(): boolean {
    return this.state.isPending;
  }

  public getPlaybackStatus(): string {
    return !!this.state.isStarted
      ? this.state.isPlaying
        ? PlaybackStatus.PLAYING
        : PlaybackStatus.PAUSED
      : PlaybackStatus.STOPPED;
  }

  public getMeta() {
    return this.state.meta;
  }

  public setMeta(meta: any) {
    this.state.meta = meta;
  }
}
