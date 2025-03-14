import ReactModal from 'react-modal';
import Button from '../baseComponents/Button';
import VisuallyHidden from '../baseComponents/VisuallyHidden';
import * as S from './styles';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  maxWidth?: string;
  children: React.ReactNode;
  onRequestClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  onRequestClose,
  maxWidth,
  title,
}: ModalProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      style={{
        content: { maxWidth: maxWidth },
      }}
    >
      <S.ModalBody>
        <S.ModalHeader>
          {title && <h1>{title}</h1>}
          <Button
            className="modal-close-button"
            onClick={onRequestClose}
            variant="iconButton"
          >
            <span aria-hidden>X</span>
            <VisuallyHidden>Fechar Modal</VisuallyHidden>
          </Button>
        </S.ModalHeader>
        {children}
      </S.ModalBody>
    </ReactModal>
  );
};

export default Modal;
