import { ButtonHTMLAttributes, ReactNode } from 'react';
import * as S from './styles';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;

  isDisabled?: boolean;
  variant?: 'primary' | 'secondary' | 'terciary' | 'iconButton';
  height?: number;
  width?: number;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  isDisabled = false,
  height,
  width,
  ...props
}) => {
  return (
    <S.Button
      onClick={onClick}
      variant={variant}
      disabled={isDisabled}
      height={height}
      width={width}
      {...props}
    >
      {children}
    </S.Button>
  );
};

export default Button;
