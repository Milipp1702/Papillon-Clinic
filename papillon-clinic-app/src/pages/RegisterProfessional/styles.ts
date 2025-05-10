import styled from 'styled-components';

export const Main = styled.main`
  padding-top: 40px;
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  display: block;
  border-bottom: 3px solid ${({ theme }) => theme.colors.primary};
  padding-bottom: 30px;
  margin: 0 auto;
  width: max-content;
`;

export const Form = styled.form`
  padding-top: 40px;
  margin: 0 auto;
  width: 100%;
  max-width: 80%;

  .button-register {
    width: 200px;
    margin: 0 auto;
    margin-top: 50px;
  }
`;

export const Fieldset = styled.fieldset`
  border: none;
  display: grid;
  justify-content: space-evenly;
  grid-template-columns: repeat(2, 40%);
  margin: 0 auto;
  max-width: 90%;
  gap: 20px;
`;

export const InputContainer = styled.div`
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
  padding: 10px;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  input[type='checkbox'] {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  label {
    font-size: 16px;
    margin-left: 8px;
  }
`;

export const SuccessMessage = styled.span`
  display: inline-block;
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.sizes.medium};
  text-align: center;
  margin-top: 40px;
  width: 100%;
`;
