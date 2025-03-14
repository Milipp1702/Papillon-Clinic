import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

type Props = {
  $variant?: 'default' | 'button';
  $variantbutton?: 'primary' | 'secondary' | 'terciary';
};

export const RouteLink = styled(Link)<Props>`
  color: ${({ theme }) => theme.colors.text};

  ${({ $variant, $variantbutton }) =>
    $variant === 'button'
      ? css`
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 4px;
          min-height: 44px;
          font-weight: bold;
          font-size: 2.4rem;
          width: 100%;
          text-decoration: none;
          color: ${({ theme }) => theme.colors.white};
          background-color: ${({ theme }) =>
            theme.colors[$variantbutton || 'primary']};

          &:hover {
            background-color: ${({ theme }) =>
              theme.colors.hover[$variantbutton || 'primary']};
          }
        `
      : ''}
`;
