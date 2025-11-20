import React from 'react';
import * as S from './styles';
import Modal from '../Modal';
import Button from '../baseComponents/Button';

type Props = {
  title?: string;
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isAppointment?: boolean;
  onConfirmAll?: () => void;
};

const ConfirmationModal: React.FC<Props> = ({
  title = 'Confirmação',
  message,
  isOpen,
  onConfirm,
  onCancel,
  isAppointment,
  onConfirmAll,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel} title={title}>
      <S.Message>{message}</S.Message>
      <S.Actions>
        <Button onClick={onCancel}>Cancelar</Button>
        {isAppointment ? (
          <>
            <Button onClick={onConfirm}>Apagar só esse</Button>
            <Button onClick={onConfirmAll}>Apagar todos da frequência</Button>
          </>
        ) : (
          <Button onClick={onConfirm}>Confirmar</Button>
        )}
      </S.Actions>
    </Modal>
  );
};

export default ConfirmationModal;
