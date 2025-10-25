import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${rotate} 0.6s linear infinite;
`;
