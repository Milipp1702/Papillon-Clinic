import { ButtonHTMLAttributes } from 'react';
import VisuallyHidden from '../baseComponents/VisuallyHidden';
import * as S from './styles';

type MenuButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOpen: boolean;
  onClick: () => void;
};

const MenuHamburguer: React.FC<MenuButtonProps> = ({
  isOpen,
  onClick,
  ...props
}: MenuButtonProps) => {
  return (
    <S.HamburguerButton
      aria-expanded={isOpen}
      onClick={onClick}
      $isOpen={isOpen}
      {...props}
    >
      <S.Bar className="bar" aria-hidden />
      <S.Bar className="bar" aria-hidden />
      <S.Bar className="bar" aria-hidden />
      <VisuallyHidden aria-live="polite">
        {isOpen ? 'Fechar Menu' : 'Abrir Menu'}
      </VisuallyHidden>
    </S.HamburguerButton>
  );
};

export default MenuHamburguer;
