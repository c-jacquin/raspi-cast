import { PlayerState } from '@raspi-cast/core';

export interface State extends PlayerState {
  castIp?: string;
  pageUrl?: string;
  isPending: boolean;
}

export interface Actions {
  cast: void;
  play: void;
  pause: void;
  stop: void;
  seek: number;
  volume: number;
  error: string;

  setState: Partial<State>;
}
