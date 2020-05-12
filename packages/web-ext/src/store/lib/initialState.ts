import { PlaybackStatus } from '@raspi-cast/core';
import { State } from './types';

export const initialState: State = {
  playbackStatus: PlaybackStatus.STOPPED,
  isPending: false,
  position: 0,
  volume: 1,
  canPlay: false,
  canSeek: false
};
