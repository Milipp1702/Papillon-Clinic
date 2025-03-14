import styled, { css } from 'styled-components';

interface ContainerProps {
  rotateIcon?: number;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  width: min-content;
  height: min-content;

  ${({ rotateIcon }) =>
    rotateIcon
      ? css`
          transform: rotate(${rotateIcon}deg);
        `
      : null}
`;
