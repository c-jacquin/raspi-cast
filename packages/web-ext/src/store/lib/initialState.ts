import { PlaybackStatus } from '@raspi-cast/core';
import { State } from './types';

export const initialState: State = {
  playbackStatus: PlaybackStatus.STOPPED,
  position: 0,
  volume: 1,
  canPlay: false,
  canSeek: false,
  isPending: false,
};
