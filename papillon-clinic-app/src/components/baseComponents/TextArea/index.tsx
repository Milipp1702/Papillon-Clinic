import React from 'react';
import * as S from './styles';

type Props = {
  className?: string;
  children: React.ReactNode;
};

const TextArea: React.FC<Props> = ({ children, className }) => {
  return (
    <S.TextareaContainer className={className}>{children}</S.TextareaContainer>
  );
};

export default TextArea;
