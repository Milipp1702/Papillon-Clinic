import React from 'react';
import Modal from '../../../components/Modal';
import * as S from './styles';
import Button from '../../../components/baseComponents/Button';
import { EventType } from '..';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onEdit: () => void;
  event: EventType;
  onRequestClose: () => void;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onEdit,
  event,
  onRequestClose,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title="Detalhes do Atendimento"
    >
      <S.Form>
        <div className="modal-content">
          <div className="appointment-details">
            <p>
              <strong>Paciente:</strong> {event.extendedProps.patient}
            </p>
            <p>
              <strong>Profissional:</strong> {event.extendedProps.professional}
            </p>
            <p>
              <strong>Especialidade:</strong> {event.extendedProps.specialty}
            </p>
            <p>
              <strong>Tipo de Atendimento:</strong> {event.extendedProps.type}
            </p>
            <p>
              <strong>Situação do pagamento:</strong>{' '}
              {event.extendedProps.isPaid ? 'Pago' : 'Não Pago'}
            </p>
            <p>
              <strong>Data:</strong>{' '}
              {new Date(event.start).toLocaleString().split(',')[0]}
            </p>
            <p>
              <strong>Início do atendimento:</strong>{' '}
              {new Date(event.start).toLocaleString().split(' ')[1]}
            </p>
            <p>
              <strong>Término do atendimento:</strong>{' '}
              {new Date(event.end).toLocaleString().split(' ')[1]}
            </p>
          </div>
          <div className="modal-actions">
            <Button
              className="button"
              type="button"
              variant="primary"
              onClick={onEdit}
            >
              Editar Atendimento
            </Button>
          </div>
        </div>
      </S.Form>
    </Modal>
  );
};

export default AppointmentDetailsModal;
