import styled from 'styled-components';

export const Main = styled.main`
  padding: 40px 0;
  overflow: auto;
  height: 100vh;

  .observation-textarea {
    grid-column: 1 / -1;
    margin-top: 0;
  }
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
    width: auto;
    padding: 0 25px;
    margin: 0 auto;
    margin-top: 50px;
  }
  .button-filter {
    width: auto;
    margin: 0 auto;
    padding: 0 10px;
    margin-top: 20px;
    font-size: 1.8rem;
    min-height: 27px;
  }
  .button-change-slot {
    width: fit-content;
    padding: 10px 20px;
    font-size: 1.6rem;
    min-height: 36px;
    margin-top: 20px;
  }
`;

export const FirstFieldset = styled.fieldset`
  border: none;
  display: grid;
  justify-content: space-evenly;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

export const SecondFieldset = styled.fieldset`
  border: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

export const FilterButton = styled.button`
  width: fit-content;
  padding: 0.4rem 1rem;
  font-size: 0.875rem;
  align-self: flex-start;
  margin-top: 1rem;
`;

export const TableWrapper = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin: 20px 0;
`;

export const InputContainer = styled.div`
  label {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.title};
  }
`;

export const CheckboxContainer = styled.div`
  label {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.title};
  }
  input {
    width: 20px;
    height: 20px;
    margin-left: 10px;
  }
  display: flex;
  align-items: center;
  gap: 25px;
`;

export const Select = styled.select`
  display: block;
  width: 100%;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: 8px;
  padding: 10px;
`;

export const SelectedSlot = styled.div`
  background-color: #f5f5f5;
  padding: 24px;
  border-radius: 10px;
  text-align: left;
  border: 1px solid #ccc;

  display: flex;
  flex-direction: column;
  gap: 12px;

  div {
    display: flex;
    justify-content: center;
    gap: 40px;
  }

  p {
    font-size: 1.6rem;
    font-weight: 500;
    color: #333;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
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
