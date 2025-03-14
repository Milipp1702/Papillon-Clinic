import * as S from './styles';

interface InputErrorProps {
  children: string;
}

const InputError: React.FC<InputErrorProps> = ({
  children,
}: InputErrorProps) => {
  return (
    <S.ErrorMessage role={'alert'}>
      {children || 'Houve um erro aqui'}
    </S.ErrorMessage>
  );
};

export default InputError;
