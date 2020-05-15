import styled from 'styled-components';

interface PopupContainerProps {
  background?: string;
}

export const PopupContainer = styled.div`
  width: 400px;
  min-height: 200px;
  color: var(--text);
  display: flex;
  flex-direction: column;
  background: var(--background);
`;

export const MainContainer = styled.div<PopupContainerProps>`
  display: flex;
  flex-direction: row;
  height: 100%;
  flex: 90%;
  position: relative;

  background-size: cover;

  :before {
    content: '""';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ background }) =>
      background ? `url(${background})` : 'var(--background)'};
    filter: blur(2px) opacity(0.4);
  }
`;
