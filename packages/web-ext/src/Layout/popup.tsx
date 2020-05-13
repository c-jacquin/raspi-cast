import React, { useCallback } from 'react';

import { MainContainer, PopupContainer } from '../components/container';
import MainButton from '../components/main-button';
import ProgressBar from '../components/progress-bar';
import Title from '../components/title';
import Volume from '../components/volume';
import useObservable from '../hooks/use-observable';
import { store } from '../store';

const PopupLayout = () => {
  const state = useObservable(store.pick('castIp', 'meta', 'position'));

  const handleSeek = useCallback(
    (percent) => {
      if (state && state.meta) {
        store.dispatch({ seek: state.meta.duration * (percent / 100) });
      }
    },
    [state],
  );

  if (!state.castIp) {
    return <div>no castIp</div>;
  }

  console.log('rrrr  r r ', state);

  return (
    <PopupContainer>
      {state.meta?.title && <Title>{state.meta.title}</Title>}
      <MainContainer>
        <MainButton />
        <Volume />
      </MainContainer>
      {!!state.position && state.position !== 0 && state.meta && (
        <ProgressBar
          onSeek={handleSeek}
          position={state.position}
          total={state.meta.duration}
        />
      )}
    </PopupContainer>
  );
};

export default PopupLayout;
