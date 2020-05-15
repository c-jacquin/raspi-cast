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
    error: () => lens.focusPath('isPending').setValue(false),
  }))
  .compute(({ playbackStatus }) => ({
    isPlaying: playbackStatus === PlaybackStatus.PLAYING,
    isStopped: playbackStatus === PlaybackStatus.STOPPED,
  }))
  .sideEffects({
    cast: () => {
      let type: CastType;
      const { pageUrl } = store.currentState;

      if (pageUrl && pageUrl.includes('https://www.youtube.com')) {
        type = CastType.YOUTUBEDL;
        socket.emit(Events.CAST, {
          data: pageUrl,
          type,
        });
      } else {
        store.dispatch({
          error: 'Unsupported web page (only youtube for now)',
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

const handleError = (error: any) => {
  console.error(error);
  store.dispatch({ error });
};

const handleConnectionError = () => {
  const error = new Error('Impossible to connect raspicast server');
  console.error(error);
  store.dispatch({ error: error.message });
};

store
  .pick('castIp', 'port')
  .pipe(
    filter(({ castIp }) => Boolean(castIp)),
    tap(async ({ castIp, port }) => {
      socket = io(`http://${castIp}:${port}`);

      socket
        .on('connect', () => socket.emit(Events.INITIAL_STATE))
        .on('connect_failed', handleConnectionError)
        .on('reconnecting', handleConnectionError)
        .on('fail', handleError);
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
  .subscribe((setState: Partial<State>) => {
    store.dispatch({ setState });
  });
