import styled from 'styled-components';

export const main = styled.main`
  padding-top: 40px;
  height: 100vh;
  overflow: auto;
  margin: 0 auto;
  max-width: 90%;

  .new-appointment-button {
    padding: 0 20px;
    width: 254px;
    max-width: 254px;
  }
`;

export const Options = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  margin-top: 64px;
  margin-bottom: 60px;

  a {
    max-width: 200px;
  }
`;

export const InputContainer = styled.div`
  position: relative;
  width: 40%;

  button {
    position: absolute;
    right: 10px;
    top: 1px;
  }

  :first-child {
    height: 44px;
  }
`;

export const TableContainer = styled.div`
  max-height: 55vh;
  overflow-y: auto;
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  margin-top: 24px;

  button {
    width: auto;
    min-height: auto;
  }
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.sizes.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
  width: 100%;
`;
