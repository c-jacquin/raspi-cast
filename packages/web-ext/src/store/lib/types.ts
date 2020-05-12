import { PlayerState, CastOptions } from '@raspi-cast/core';

export interface State extends PlayerState {
  castIp?: string;
  pageUrl?: string;
  theme?: string;
  notification?: boolean;
  isReady?: boolean;
}

export interface Actions {
  cast: CastOptions;
  play: void;
  pause: void;
  stop: void;
  seek: number;
  volume: number;
  error: string;

  setState: Partial<State>;
}
