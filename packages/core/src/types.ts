import { CastType, PlaybackStatus } from './enum';

export interface CastMeta {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  duration: number;
}

export interface CastOptions {
  type: CastType;
  data: string;
}

export interface PlayerState {
  canPlay: boolean;
  canSeek: boolean;
  trackId?: string;
  playbackStatus?: PlaybackStatus;
  volume?: number;
  meta?: CastMeta;
  position?: number;
}
