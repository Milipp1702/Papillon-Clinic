import React, { AnchorHTMLAttributes } from 'react';
import { LinkProps } from 'react-router-dom';
import * as S from './styles';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkProps & {
    variant?: 'default' | 'button';
    variantButton?: 'primary' | 'secondary' | 'terciary';
  };

const Link: React.FC<Props> = ({
  children,
  to,
  variant = 'default',
  variantButton = 'primary',
  ...props
}) => {
  return (
    <>
      <S.RouteLink
        to={to}
        $variant={variant}
        $variantbutton={variantButton}
        {...props}
      >
        {children}
      </S.RouteLink>
    </>
  );
};

export default Link;
