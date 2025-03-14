import * as S from './styles';

type Props = {
  children: React.ReactNode;
};

const PageTitle: React.FC<Props> = ({ children }) => {
  return <S.Title>{children}</S.Title>;
};

export default PageTitle;
