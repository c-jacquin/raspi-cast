import React, { useCallback, ChangeEvent } from 'react';
import styled from 'styled-components';

import useObservable from '../hooks/use-observable';
import { store } from '../store';

const Input = styled.input`
  -webkit-appearance: slider-vertical;
  width: 5px;
  height: 100px;
  padding: 0 2px;
  flex: 10%;
  cursor: grab;
  :active {
    cursor: grabbing;
  }
`;

const Volume: React.FC = () => {
  const { volume } = useObservable(store.pick('volume'));
  const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    store.dispatch({ volume: parseFloat(evt.target.value) });
  }, []);

  return (
    <Input
      type="range"
      orient="vertical"
      min="0"
      max="1"
      step="0.01"
      value={volume}
      onChange={handleChange}
    />
  );
};

export default Volume;
