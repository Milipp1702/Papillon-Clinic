import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/baseComponents/Input';
import Button from '../../components/baseComponents/Button';
import Spinner from '../../components/baseComponents/Spinner';
import InputError from '../../components/baseComponents/InputError';
import { dataFormat } from '../../constants/types';
import papillon_icon from '../../assets/papillon_icon.png';
import trail from '../../assets/trail.png';
import * as S from './styles';
import { useClinicApi } from '../../services/api/useClinicApi';
import { AxiosError } from 'axios';

type FormData = {
  email: string;
};

const formErrors: dataFormat = {
  email: {
    required: 'Informe um email válido.',
  },
};

const ForgotPassword: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestPasswordReset } = useClinicApi();

  const schema = object({
    email: string().email().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await requestPasswordReset(data.email);
      setSuccessMessage(true);
      setErrorMessage('');
    } catch (error) {
      console.log(error);
      setErrorMessage(
        ((error as AxiosError).response?.data as string) ||
          'Erro ao enviar email de recuperação.'
      );
      setSuccessMessage(false);
    } finally {
      setLoading(false);
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
          <h2>Recuperar Senha</h2>
          <S.InputContainer>
            <label htmlFor="inputEmail">Email</label>
            <Input id="inputEmail" type="email" {...register('email')} />
            {errors.email?.type && (
              <InputError>{formErrors['email'][errors.email?.type]}</InputError>
            )}
          </S.InputContainer>
          <Button type="submit" isDisabled={loading}>
            {loading ? (
              <>
                <Spinner id="spinner" /> Enviando...
              </>
            ) : (
              <span>Enviar</span>
            )}
          </Button>
          {successMessage && (
            <S.SuccessMessage>
              Email de recuperação enviado com sucesso!
            </S.SuccessMessage>
          )}
          {errorMessage && <InputError>{errorMessage}</InputError>}
        </S.Form>
      </S.FormContainer>
      <img src={trail} alt="" className="trailTop" aria-hidden />
      <img src={trail} alt="" className="trailBottom" aria-hidden />
    </S.Container>
  );
};

export default ForgotPassword;
