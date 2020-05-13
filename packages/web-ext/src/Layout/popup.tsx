import React, { useCallback } from 'react';

import { MainContainer, PopupContainer } from '../components/container';
import MainButton from '../components/main-button';
import ProgressBar from '../components/progress-bar';
import Title from '../components/title';
import Volume from '../components/volume';
import useObservable from '../hooks/use-observable';
import { store } from '../store';

const PopupLayout = () => {
  const { castIp, meta, position } = useObservable(
    store.pick('castIp', 'meta', 'position'),
  );

  const handleSeek = useCallback(
    (percent) => {
      if (meta) {
        store.dispatch({ seek: meta.duration * (percent / 100) });
      }
    },
    [meta],
  );

  if (!castIp) {
    return <div>no castIp</div>;
  }

  return (
    <PopupContainer>
      {meta?.title && <Title>{meta.title}</Title>}
      <MainContainer background={meta?.thumbnail}>
        <MainButton />
        <Volume />
      </MainContainer>
      {!!position && position !== 0 && meta && (
        <ProgressBar
          onSeek={handleSeek}
          position={position}
          total={meta.duration}
        />
      )}
    </PopupContainer>
  );
};

export default PopupLayout;
