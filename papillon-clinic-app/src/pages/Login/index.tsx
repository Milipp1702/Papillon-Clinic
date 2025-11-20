import { useContext, useEffect, useState } from 'react';
import Button from '../../components/baseComponents/Button';
import Input from '../../components/baseComponents/Input';
import papillon_icon from '../../assets/papillon_icon.png';
import trail from '../../assets/trail.png';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { SCREEN_PATHS } from '../../constants/paths';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { set, useForm } from 'react-hook-form';
import InputError from '../../components/baseComponents/InputError';
import * as S from './styles';
import { dataFormat } from '../../constants/types';
import Spinner from '../../components/baseComponents/Spinner';

type FormData = {
  login: string;
  password: string;
};

const formErrors: dataFormat = {
  login: {
    required: 'Informe um email válido.',
  },
  password: {
    required: 'Informe a senha.',
  },
};

const Login: React.FC = () => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login, isAuth, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginSchema = object({
    login: string().trim().required(),
    password: string().trim().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await login(data);
      setLoading(false);
      return navigate(SCREEN_PATHS.home);
    } catch (error: any) {
      setErrorMessage('Email ou Senha Inválidos!');
      setError(true);
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(false);
    setErrorMessage('');
  };

  useEffect(() => {
    if (isAuth && user) {
      navigate(SCREEN_PATHS.home);
    }
  }, [isAuth]);

  return (
    <>
      <S.Container>
        <header>
          <a href="/">
            <img className="logo" src={papillon_icon} alt="Clinica Papillon" />
          </a>
        </header>
        <S.FormContainer>
          <S.Form onSubmit={handleSubmit(onSubmit)}>
            <h2>Login</h2>
            <S.InputContainer>
              <label htmlFor="inputEmail">Email</label>
              <Input
                id="inputEmail"
                type="email"
                {...register('login', { onChange: () => clearMessages() })}
              />
              {errors.login?.type && (
                <InputError>
                  {formErrors['login'][errors.login?.type]}
                </InputError>
              )}
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="inputPassword">Senha</label>
              <Input
                id="inputPassword"
                type="password"
                {...register('password', { onChange: () => clearMessages() })}
              />
              {errors.password?.type && (
                <InputError>
                  {formErrors['password'][errors.password?.type]}
                </InputError>
              )}
            </S.InputContainer>
            {error && <InputError>{errorMessage}</InputError>}
            <Button type="submit" isDisabled={loading}>
              {loading ? (
                <>
                  <Spinner id="spinner" /> Enviando...
                </>
              ) : (
                <span>Enviar</span>
              )}
            </Button>
            <Link to="/forgot-password">Esqueceu sua senha?</Link>
          </S.Form>
        </S.FormContainer>
        <img src={trail} alt="" className="trailTop" aria-hidden />
        <img src={trail} alt="" className="trailBottom" aria-hidden />
      </S.Container>
    </>
  );
};

export default Login;
