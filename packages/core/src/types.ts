import { Subscription } from 'rxjs';
import { Socket } from 'socket.io';

import { CastType } from './enum';

export interface CastClient {
  address: string;
  socket: Socket;
  subscription: Subscription;
}

export interface CastMeta {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
}

export interface CastOptions {
  type: CastType;
  data: string;
}

export interface PlayerState {
  isPending: boolean;
  volume?: number;
  isPlaying: boolean;
  isStarted: boolean;
  meta?: CastMeta;
  castId?: string;
  locked?: boolean;
  masterAdress?: string;
}

export interface InitialState {
  isPending: boolean;
  status: string;
  meta: {
    title: string;
    description: string;
    thumbnail: string;
  };
  duration?: number;
  volume?: number;
}
