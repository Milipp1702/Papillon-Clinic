import styled from 'styled-components';

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  display: block;
  border-bottom: 3px solid ${({ theme }) => theme.colors.primary};
  padding-bottom: 30px;
  margin: 0 auto;
  width: fit-content;
`;
