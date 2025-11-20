import styled from 'styled-components';

export const TextareaContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 40px;

  div {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 500px;
    max-width: 500px;

    font-weight: bold;
    color: ${({ theme }) => theme.colors.title};

    textarea {
      resize: none;
      height: 100px;
    }
  }
`;
