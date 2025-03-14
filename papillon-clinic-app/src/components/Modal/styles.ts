import styled from 'styled-components';

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  button.modal-close-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    font-size: 24px;

    height: 48px;
    width: 48px;
    position: absolute;
    right: 0;
  }
`;
