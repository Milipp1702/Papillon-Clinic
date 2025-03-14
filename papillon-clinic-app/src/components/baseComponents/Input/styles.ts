import styled from 'styled-components';

interface ContainerProps {
  height?: number;
  readOnly?: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  height: ${({ height }) => height || 40}px;

  display: flex;
  align-items: center;
  position: relative;

  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};

  &:focus-within {
    box-shadow:
      #fff 0px 0px 0px 2px,
      #575757 0px 0px 0px 4px;
  }

  background-color: ${({ readOnly, theme }) =>
    readOnly ? '#dfdfdf' : theme.colors.white};
`;

export const Input = styled.input`
  border: none;
  outline: 0;
  height: 100%;
  width: 100%;
  background-color: transparent;
  font-size: 16px;
`;
