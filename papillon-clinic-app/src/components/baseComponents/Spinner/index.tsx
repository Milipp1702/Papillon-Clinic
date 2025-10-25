import * as S from './styles';

interface Props {
  id: string;
}

const Spinner: React.FC<Props> = ({ id }) => {
  return <S.Spinner id={id} />;
};

export default Spinner;
