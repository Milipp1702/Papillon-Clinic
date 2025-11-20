import styled from 'styled-components';

export const main = styled.main`
  padding-top: 40px;
  height: 100vh;
  overflow: auto;
  margin: 0 auto;
  max-width: 90%;

  #download-report-button,
  #generate-report-button {
    width: auto;
    padding: 0 18px;
  }

  #download-report-button {
    margin: 0 auto;
  }

  #generate-report-button {
    font-size: 18px;
    min-height: 34px;
    align-self: end;
    margin-bottom: 5px;
  }
`;

export const InputContainer = styled.div`
  label {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.title};
  }
`;

export const TableContainer = styled.div`
  max-height: 55vh;
  overflow-y: auto;
  margin-bottom: 40px;
`;

export const Select = styled.select`
  display: block;
  width: 100%;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: 8px;
  padding: 10px;
`;

export const Wrapper = styled.div`
  padding: 2rem;
  text-align: center;
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
