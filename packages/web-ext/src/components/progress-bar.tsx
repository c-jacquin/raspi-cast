import React, { useCallback } from 'react';
import styled from 'styled-components';

import { formaTime } from '../helpers/time';

const Progress = styled.div`
  width: 100%;
  background-color: var(--background);
  padding: 3px;
  border-radius: 3px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  position: relative;
`;

const ProgressFill = styled.div`
  display: block;
  height: 22px;
  background-color: var(--progress-color);
  border-radius: 3px;
  transition: width 500ms ease-in-out;
`;

const Timer = styled.span`
  position: absolute;
  /* margin-left: auto;
  margin-right: auto; */
  color: var(--text);
  z-index: 100000000;
  left: 4px;
  top: 4px;
`;

interface ProgressBarProps {
  total: number;
  position: number;
  onSeek(value: number): void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  position,
  total,
  onSeek,
}) => {
  const handleClick = useCallback(
    (evt: any) => {
      onSeek((100 * evt.clientX) / evt.target.clientWidth);
    },
    [onSeek],
  );

  return (
    <Progress onClick={handleClick}>
      <ProgressFill style={{ width: `${(100 * position) / total}%` }} />
      <Timer>{`${formaTime(position)}/${formaTime(total)}`}</Timer>
    </Progress>
  );
};

export default ProgressBar;
