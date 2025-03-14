import { ButtonHTMLAttributes } from 'react';
import { css, styled } from 'styled-components';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'terciary' | 'iconButton';
  height?: number;
  width?: number;
}

const BUTTON_VARIANTS = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};

    &:hover {
      background-color: ${({ theme }) => theme.colors.hover.primary};
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};

    &:hover {
      background-color: ${({ theme }) => theme.colors.hover.secondary};
    }
  `,
  terciary: css`
    background-color: ${({ theme }) => theme.colors.terciary};
    color: ${({ theme }) => theme.colors.white};

    &:hover {
      background-color: ${({ theme }) => theme.colors.hover.terciary};
    }
  `,
  iconButton: css`
    width: auto;
    height: auto;
    background: transparent;
  `,
};

export const Button = styled.button<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  min-height: 44px;
  font-weight: bold;
  font-size: 2.4rem;
  width: 100%;

  :disabled {
    background-color: ${({ theme }) => theme.colors.grey[200]};
  }

  ${({ variant }) => BUTTON_VARIANTS[variant]}

  ${({ height }) => (height ? `height:${height}px` : '')};
  ${({ width }) => (width ? `width:${width}px` : '')};
`;
