import styled from 'styled-components';

export const Form = styled.form`
  padding-top: 40px;
  width: 100%;

  .button-add {
    width: 150px;
    margin: 30px auto 0 auto;
  }
`;

export const Fieldset = styled.fieldset`
  border: none;
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(2, 40%);
  margin: 0 auto;
  max-width: 90%;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputContainer = styled.div`
  &.neighborhood {
    flex-grow: 1;
  }

  label {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.title};
  }
`;

export const Select = styled.select`
  display: block;
  width: 100%;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: 8px;
`;

export const RadioButtonFieldset = styled.fieldset`
  border: none;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  margin-top: 40px;

  span.title {
    color: ${({ theme }) => theme.colors.title};
    font-weight: bold;
  }
`;

export const RadioButtonWrapper = styled.div`
  display: flex;
  gap: 50px;
  justify-content: center;
`;

export const RadioContainer = styled.div`
  display: flex;
  gap: 14px;
`;

export const RadioButton = styled.input``;
