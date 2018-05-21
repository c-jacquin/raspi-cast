export type TypeKey = 'YOUTUBEDL';
export type Type = 'youtubedl';
export type ErrorKey = 'UNSUPORTED_STREAM' | 'PLAYER_UNAVAILABLE'
export type Error = 'unsuportedStream' | 'playerUnavailable';
export type PlaybackKey = 'PLAYING' | 'PAUSED' | 'STOPPED';
export type Playback = 'Playing' | 'Paused' | 'Stopped';

export interface CastMeta {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
}

export interface CastOptions {
  type: Type;
  data: string;
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

export const CastType: Record<TypeKey, Type>;
export const Errors: Record<ErrorKey, Error>;
export const PlaybackStatus: Record<PlaybackKey, Playback>