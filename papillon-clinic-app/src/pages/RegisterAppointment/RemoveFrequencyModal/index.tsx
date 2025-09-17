import React from 'react';
import Modal from '../../../components/Modal';
import * as S from './styles';
import Button from '../../../components/baseComponents/Button';

interface FrequencyModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onRequestClose: () => void;
}

const FrequencyModal: React.FC<FrequencyModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  onRequestClose,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title="Remover recorrência"
    >
      <S.Form>
        <div className="modal-content">
          <p>
            Você removeu a recorrência. Deseja mesmo apagar os atendimentos
            futuros relacionados a ela?
          </p>
          <div className="modal-actions">
            <Button
              className="button"
              type="button"
              variant="primary"
              onClick={onConfirm}
            >
              Sim, apagar
            </Button>
            <Button
              className="button"
              type="button"
              variant="primary"
              onClick={onCancel}
            >
              Não, manter
            </Button>
          </div>
        </div>
      </S.Form>
    </Modal>
  );
};

export default FrequencyModal;
