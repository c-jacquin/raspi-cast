import React from 'react';
import styled from 'styled-components';
import { FaChromecast, FaPlay, FaPause, FaStop } from 'react-icons/fa';

import useObservable from '../hooks/use-observable';
import { store } from '../store';

export const Button = styled.button`
  padding: 3px;
  background: transparent;
  display: block;
  color: var(--text);
  width: 100%;
  height: 100%;
  flex: 90%;
  border: none;
  align-self: center;
  text-align: center;
  cursor: pointer;
  ::-moz-focus-inner,
  ::-moz-focus-outer {
    border: 0;
  }
  position: relative;
`;

const handlePlay = () => {
  store.dispatch({ play: undefined });
};

const handlePause = () => {
  store.dispatch({ pause: undefined });
};

export const PlayPauseButton: React.FC = () => {
  const { isPlaying } = useObservable(store.pick('isPlaying'));

  return (
    <Button onClick={isPlaying ? handlePause : handlePlay}>
      {!isPlaying && <FaPlay size="70" />}
      {isPlaying && <FaPause size="70" />}
    </Button>
  );
};

const handleCast = () => {
  store.dispatch({ cast: undefined });
};

export const CastButton: React.FC = () => {
  return (
    <Button onClick={handleCast}>
      <FaChromecast size="70" />
    </Button>
  );
};

const handleStop = () => {
  store.dispatch({ stop: undefined });
};

export const StopButton: React.FC = () => {
  return (
    <Button onClick={handleStop}>
      <FaStop size="70" />
    </Button>
  );
};
