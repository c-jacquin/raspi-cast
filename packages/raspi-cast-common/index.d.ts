export type Type = 'youtubedl';
export type Error = 'youtubeDl' | 'playerUnavailable';
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

export const CastType: Record<string, Type>;
export const Errors: Record<string, Error>;
export const PlaybackStatus: Record<string, Playback>