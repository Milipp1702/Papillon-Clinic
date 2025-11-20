import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Input from '../../components/baseComponents/Input';
import Button from '../../components/baseComponents/Button';
import InputError from '../../components/baseComponents/InputError';
import { dataFormat } from '../../constants/types';
import * as S from './styles';
import { useClinicApi } from '../../services/api/useClinicApi';
import papillon_icon from '../../assets/papillon_icon.png';
import trail from '../../assets/trail.png';
import Spinner from '../../components/baseComponents/Spinner';

type FormData = {
  newPassword: string;
  confirmPassword: string;
};

const formErrors: dataFormat = {
  newPassword: {
    min: 'Mínimo 6 caracteres',
    required: 'Informe a nova senha.',
  },
  confirmPassword: {
    required: 'Confirme a nova senha.',
  },
};

const schema = object({
  newPassword: string().required(),
  confirmPassword: string().required(),
});

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useClinicApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (data.newPassword !== data.confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, data.newPassword);
      navigate('/');
    } catch (error) {
      setErrorMessage('Não foi possível redefinir a senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Container>
      <header>
        <a href="/">
          <img className="logo" src={papillon_icon} alt="Clinica Papillon" />
        </a>
      </header>
      <S.FormContainer>
        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <h2>Redefinir Senha</h2>
          <S.InputContainer>
            <label htmlFor="newPassword">Nova Senha</label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword')}
            />
            {errors.newPassword?.type && (
              <InputError>
                {formErrors['newPassword'][errors.newPassword?.type]}
              </InputError>
            )}
          </S.InputContainer>
          <S.InputContainer>
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword?.type && (
              <InputError>
                {formErrors['confirmPassword'][errors.confirmPassword?.type]}
              </InputError>
            )}
          </S.InputContainer>
          {errorMessage && <InputError>{errorMessage}</InputError>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner id="spinner" /> Enviando...
              </>
            ) : (
              'Redefinir Senha'
            )}
          </Button>
        </S.Form>
      </S.FormContainer>
      <img src={trail} alt="" className="trailTop" aria-hidden />
      <img src={trail} alt="" className="trailBottom" aria-hidden />
    </S.Container>
  );
};

export default ResetPassword;
