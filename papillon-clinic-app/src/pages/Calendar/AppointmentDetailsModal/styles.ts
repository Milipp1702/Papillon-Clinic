import styled from 'styled-components';

export const Form = styled.form`
  padding-top: 40px;
  width: 100%;

  .button {
    width: 130px;
    margin-top: 30px;
    font-size: 22px;
  }

  .appointment-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .modal-actions {
    display: flex;
    justify-content: center;
  }

  button {
    width: auto !important;
    padding: 8px 16px;
  }
`;
