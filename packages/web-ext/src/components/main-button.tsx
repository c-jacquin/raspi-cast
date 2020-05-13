import React, { useCallback } from 'react';
import styled from 'styled-components';
import { FaChromecast, FaPlay, FaPause, FaSpinner } from 'react-icons/fa';

import useObservable from '../hooks/use-observable';
import { store } from '../store';

const Button = styled.button`
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

const MainButton: React.FC = () => {
  const { isPending, isPlaying, isStopped } = useObservable(
    store.pick('isPlaying', 'isStopped', 'isPending'),
  );

  const handleClick = useCallback(() => {
    if (!isPending && isStopped) {
      store.dispatch({ cast: undefined });
    } else if (!isPending && !isPlaying) {
      store.dispatch({ play: undefined });
    } else if (!isPending && isPlaying) {
      store.dispatch({ pause: undefined });
    }
  }, [isPending, isPlaying, isStopped]);

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending && <FaSpinner size="70" rotate="true" />}
      {!isPending && isStopped && <FaChromecast size="70" />}
      {!isPending && !isPlaying && !isStopped && <FaPlay size="70" />}
      {!isPending && isPlaying && <FaPause size="70" />}
    </Button>
  );
};

export default MainButton;
