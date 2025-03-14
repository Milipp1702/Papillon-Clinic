import { AriaAttributes, ReactNode } from 'react';
import * as S from './styles';

interface Props extends AriaAttributes {
  children: ReactNode;
}

const VisuallyHidden: React.FC<Props> = ({ children, ...props }: Props) => {
  return <S.HiddenContent {...props}>{children}</S.HiddenContent>;
};

export default VisuallyHidden;
