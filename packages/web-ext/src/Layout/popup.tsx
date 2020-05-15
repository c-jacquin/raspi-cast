import React, { useCallback, Fragment } from 'react';
import { FaSpinner } from 'react-icons/fa';

import { CastButton, PlayPauseButton, StopButton } from '../components/button';
import { MainContainer, PopupContainer } from '../components/container';
import ProgressBar from '../components/progress-bar';
import Title from '../components/title';
import Volume from '../components/volume';
import useObservable from '../hooks/use-observable';
import { store } from '../store';

const PopupLayout = () => {
  const { castIp, meta, position, canPlay, isPending } = useObservable(
    store.pick('castIp', 'meta', 'position', 'isPending', 'canPlay'),
  );

  const handleSeek = useCallback(
    (percent) => {
      if (meta) {
        store.dispatch({ seek: meta.duration * (percent / 100) });
      }
    },
    [meta],
  );

  const handleGoToOptions = useCallback(() => {
    browser.tabs.create({
      url: browser.runtime.getURL('/options.html'),
    });
  }, []);

  if (!castIp) {
    return (
      <PopupContainer>
        <p style={{ cursor: 'pointer' }} onClick={handleGoToOptions}>
          Go to the options and enter your raspi cast server ip
        </p>
      </PopupContainer>
    );
  }

  return (
    <PopupContainer>
      {isPending && (
        <FaSpinner
          size="150"
          className="fa-spin"
          style={{ alignSelf: 'center', justifySelf: 'center' }}
        />
      )}
      {!isPending && meta?.title && <Title>{meta.title}</Title>}
      {!isPending && (
        <MainContainer background={meta?.thumbnail}>
          <CastButton />
          {canPlay && (
            <Fragment>
              <PlayPauseButton />
              <StopButton />
            </Fragment>
          )}
          {canPlay && <Volume />}
        </MainContainer>
      )}
      {!isPending && (!!position || position === 0) && meta && (
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
