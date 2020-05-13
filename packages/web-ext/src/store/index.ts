import { PlaybackStatus, Events, CastType } from '@raspi-cast/core';
import { createStore } from 'lenrix';
import { fromEvent, merge } from 'rxjs';
import { filter, tap, switchMap } from 'rxjs/operators';
import io from 'socket.io-client';

import { initialState } from './lib/initialState';
import { Actions, State } from './lib/types';
let socket: SocketIOClient.Socket;

export const store = createStore<State>(initialState)
  .actionTypes<Actions>()
  .updates((lens) => ({
    setState: (update) => lens.setFields(update),
    cast: () => lens.focusPath('isPending').setValue(true),
    seek: (position) => lens.focusPath('position').setValue(position),
    stop: () => lens.focusPath('position').setValue(0),
  }))
  .compute(({ playbackStatus }) => ({
    isPlaying: playbackStatus === PlaybackStatus.PLAYING,
    isStopped: playbackStatus === PlaybackStatus.STOPPED,
  }))
  .sideEffects({
    cast: () => {
      let type: CastType;
      const data = store.currentState.pageUrl;

      if (data && data.includes('youtube')) {
        type = CastType.YOUTUBEDL;
        socket.emit(Events.CAST, {
          data,
          type,
        });
      }
    },
    play: () => socket.emit(Events.PLAY),
    pause: () => socket.emit(Events.PAUSE),
    volume: (volume) => socket.emit(Events.VOLUME, volume),
    seek: (position) => socket.emit(Events.SEEK, position),
    stop: () => socket.emit(Events.STOP),

    error: (err) => {
      browser.notifications.create('error', {
        title: 'Error',
        message: err,
        type: 'basic',
        iconUrl: browser.extension.getURL('icons/ic_cast_3x.png'),
      });
    },
  });

store
  .pluck('castIp')
  .pipe(
    filter(Boolean),
    tap((castIp: string) => {
      socket = io(`http://${castIp}:8181`);

      socket
        .on('connect', () => socket.emit(Events.INITIAL_STATE))
        .on('fail', (error: string) => store.dispatch({ error }));
    }),
    switchMap(() =>
      merge(
        fromEvent(socket, Events.CAN_PLAY),
        fromEvent(socket, Events.CAN_SEEK),
        fromEvent(socket, Events.INITIAL_STATE),
        fromEvent(socket, Events.PLAYBACK_STATUS),
        fromEvent(socket, Events.SEEK),
        fromEvent(socket, Events.VOLUME),
        fromEvent(socket, Events.META),
        fromEvent(socket, Events.POSITION),
      ),
    ),
  )
  .subscribe((updates: Partial<State>) => {
    console.log('updates ', updates);
    store.dispatch({ setState: updates });
  });
