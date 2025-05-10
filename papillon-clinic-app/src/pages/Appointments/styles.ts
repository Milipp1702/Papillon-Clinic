import styled from 'styled-components';

export const main = styled.main`
  padding-top: 40px;
  height: 100vh;
  overflow: auto;
  margin: 0 auto;
  max-width: 90%;
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
