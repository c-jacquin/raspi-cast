import { PlaybackStatus, Events } from '@raspi-cast/core';
import { createStore } from 'lenrix';
import { fromEvent, merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import io from 'socket.io-client';

import { initialState } from './lib/initialState';
import { Actions, State } from './lib/types';
let socket: any;

export const store = createStore<State>(initialState)
  .actionTypes<Actions>()
  .updates((lens) => ({
    setState: (update) => lens.setFields(update),
    error: () => lens.setFields({ isPending: false }),
    volume: (volume) => lens.focusPath('volume').setValue(volume),
    cast: () => lens.focusPath('isPending').setValue(true),
    initialState: () => lens.focusPath('isPending').setValue(true),
  }))
  .compute(({ playbackStatus }) => ({
    isPlaying: playbackStatus === PlaybackStatus.PLAYING,
    isStopped: playbackStatus === PlaybackStatus.STOPPED,
  }))
  .sideEffects({
    cast: (castOptions) => socket.emit(Events.CAST, castOptions),
    play: () => socket.emit(Events.PLAY),
    pause: () => socket.emit(Events.PAUSE),
    volume: (volume) => socket.emit(Events.VOLUME, volume),
    seek: (position) => socket.emit(Events.SEEK, position),
    stop: () => socket.emit(Events.STOP),

    error: () => {
      // if (store.currentState.notification) {
      //   browser.notifications.create('error', {
      //     title: 'Error',
      //     message: err,
      //     type: 'basic',
      //     iconUrl: browser.extension.getURL('icons/ic_cast_3x.png'),
      //   });
      // }
    },
  });

store
  .pluck('castIp')
  .pipe(
    filter(Boolean),
    tap((castIp) => {
      socket = io(`http://${castIp}:8181`);
      fromEvent(socket, 'fail').subscribe((err: string) =>
        store.dispatch({ error: err }),
      );

      merge(
        fromEvent(socket, Events.CAN_PLAY),
        fromEvent(socket, Events.CAN_SEEK),
        fromEvent(socket, Events.INITIAL_STATE),
        fromEvent(socket, Events.PLAYBACK_STATUS),
        fromEvent(socket, Events.SEEK),
        fromEvent(socket, Events.VOLUME),
      ).subscribe((updates: any) => store.dispatch({ setState: updates }));

      socket.emit('initialState');
    }),
  )
  .subscribe();
