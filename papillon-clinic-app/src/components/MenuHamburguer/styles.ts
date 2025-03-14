import styled, { css } from 'styled-components';

interface Props {
  $isOpen: boolean;
}

export const HamburguerButton = styled.button<Props>`
  position: relative;
  width: 30px;
  height: 30px;
  background: transparent;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border: none;
  gap: 8px;

  ::after {
    content: '';
    position: absolute;
    left: -8px;
    top: -8px;
    width: 44px;
    height: 44px;
  }

  div.bar {
    ${({ $isOpen }) =>
      $isOpen
        ? css`
            &.bar:nth-child(1) {
              display: none;
            }

            &.bar:nth-child(2) {
              transform: rotate(45deg);
              top: 3px;
            }

            &.bar:nth-child(3) {
              transform: rotate(-45deg);
              top: -7px;
            }
          `
        : ''}
  }
`;

export const Bar = styled.div`
  position: relative;
  display: block;
  width: 30px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  transition: 0.4s;
`;
