import { PlayerState } from '@raspi-cast/core';

export interface State extends PlayerState {
  castIp?: string;
  port?: number;
  pageUrl?: string;
  error?: string;
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
