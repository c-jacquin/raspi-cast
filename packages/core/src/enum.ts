export enum CastType {
  YOUTUBEDL = 'youtubedl',
  LOCAL = 'local'
}

export enum Errors {
  UNSUPORTED_STREAM = 'unsuportedStream',
  PLAYER_UNAVAILABLE = 'playerUnavailable',
}

export enum PlaybackStatus {
  PLAYING = 'Playing',
  PAUSED = 'Paused',
  STOPPED = 'Stopped',
}

export enum Events {
  CAN_PLAY = 'canPlay',
  CAN_SEEK = 'canSeek',
  CAST = 'cast',
  INITIAL_STATE = 'initialState',
  PAUSE = 'pause',
  PLAY = 'play',
  PLAYBACK_STATUS = 'playbackStatus',
  META = 'meta',
  SEEK = 'seek',
  STOP = 'stop',
  VOLUME = 'volume',
  POSITION = 'position',
}
