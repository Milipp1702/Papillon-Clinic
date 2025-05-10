import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PageWrapper from '../../components/PageWrapper';
import Button from '../../components/baseComponents/Button';
import Input from '../../components/baseComponents/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import { ONLY_NUMBERS } from '../../constants/regexPatterns';
import { array, number, object, string } from 'yup';
import VisuallyHidden from '../../components/baseComponents/VisuallyHidden';
import { dataFormat } from '../../constants/types';
import InputError from '../../components/baseComponents/InputError';
import { useClinicApi } from '../../services/api/useClinicApi';
import { useNavigate, useParams } from 'react-router-dom';
import * as S from './styles';
import { professionalToFormData } from '../../services/mappers';
import { SCREEN_PATHS } from '../../constants/paths';

const SPECIALITY_OPTIONS = [
  'TO',
  'MUSICOTERAPIA',
  'PSICOLOGIA',
  'FONOAUDIOLOGIA',
  'PSICOPEDAGOGIA',
];

const WORKDAYS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const WORKSHIFT = ['Manhã', 'Tarde'];

type FormProfessionalData = {
  id?: string;
  name: string;
  cpf: string;
  crm: string;
  phone_number: string;
  speciality: string;
  discount: number;
  workdays: string[];
  workshift: string[];
};

const formErrors: dataFormat = {
  name: {
    required: 'Informe o nome!',
  },
  crm: {
    required: 'Informe o CRM!',
  },
  cpf: {
    required: 'Informe o CPF!',
    min: 'CPF deve ter no minímo 11 digitos!',
    matches: 'CPF deve possuir apenas números!',
  },
  phone_number: {
    required: 'Informe o numero de telefone!',
    min: 'Número inválido!',
    matches: 'Número de telefone deve possuir apenas números!',
  },
  speciality: {
    required: 'Informe a especialidade!',
  },
  discount: {
    typeError: 'Informe o valor a ser descontado!',
  },
  workdays: {
    required: 'Informe os dias de trabalho!',
  },
  workshift: {
    required: 'Informe os turnos de trabalho!',
  },
};

const RegisterProfessional: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [professional, setProfessional] = useState<FormProfessionalData | null>(
    null
  );
  const navigate = useNavigate();
  const { id } = useParams();

  const { registerProfessional, updateProfessional, findProfessionalById } =
    useClinicApi();

  const ProfessionalSchema = object({
    name: string().trim().required(),
    crm: string().trim().required(),
    cpf: string().trim().required().matches(ONLY_NUMBERS).min(11).max(11),
    phone_number: string()
      .trim()
      .required()
      .matches(ONLY_NUMBERS)
      .min(11)
      .max(11),
    speciality: string().trim().required(),
    discount: number().required(),
    workdays: array().of(string().trim().required()).required(),
    workshift: array().of(string().trim().required()).required(),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProfessionalData>({
    resolver: yupResolver(ProfessionalSchema),
    values: { ...professional } as FormProfessionalData,
  });

  const onSubmit = async (data: FormProfessionalData) => {
    const professional = data;

    if (id) {
      try {
        await updateProfessional({ ...professional, id });
        return navigate(SCREEN_PATHS.professionals);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await registerProfessional(professional);
        setSuccess((current) => !current);
        reset();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getProfessionalData = async (id: string) => {
    try {
      const response = await findProfessionalById(id);
      setProfessional(professionalToFormData(response));
    } catch (error) {
      console.log('error' + error);
    }
  };

  useEffect(() => {
    if (id) {
      getProfessionalData(id);
    }
  }, []);

  return (
    <PageWrapper>
      <S.Main>
        <S.Title>
          {id ? 'Editar Profissional' : 'Cadastrar Profissional'}
        </S.Title>
        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <S.Fieldset>
            <legend>
              <VisuallyHidden>Dados do Profissional</VisuallyHidden>
            </legend>
            <S.InputContainer>
              <label htmlFor="name">Nome</label>
              <Input id="name" {...register('name')} />
              {errors.name?.type && (
                <InputError>{formErrors['name'][errors.name?.type]}</InputError>
              )}
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="cpf">CPF</label>
              <Input id="cpf" {...register('cpf')} />
              {errors.cpf?.type && (
                <InputError>{formErrors['cpf'][errors.cpf?.type]}</InputError>
              )}
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="crm">CRM</label>
              <Input id="crm" {...register('crm')} />
              {errors.crm?.type && (
                <InputError>{formErrors['crm'][errors.crm?.type]}</InputError>
              )}
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="phone_number">Celular</label>
              <Input id="phone_number" {...register('phone_number')} />
              {errors.phone_number?.type && (
                <InputError>
                  {formErrors['phone_number'][errors.phone_number?.type]}
                </InputError>
              )}
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="speciality">Especialidade</label>
              <S.Select
                defaultValue={''}
                id="speciality"
                {...register('speciality')}
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {SPECIALITY_OPTIONS.map((speciality, index) => (
                  <option key={index + 'speciality'} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </S.Select>
              {errors.speciality?.type && (
                <InputError>
                  {formErrors['speciality'][errors.speciality?.type]}
                </InputError>
              )}
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="discount">Valor de Desconto</label>
              <Input id="discount" {...register('discount')} />
              {errors.discount?.type && (
                <InputError>
                  {formErrors['discount'][errors.discount?.type]}
                </InputError>
              )}
            </S.InputContainer>
          </S.Fieldset>
          <S.InputContainer>
            <label htmlFor="workdays">Dias de Trabalho</label>
            <S.CheckboxGroup>
              {WORKDAYS.map((day, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={`workday-${index}`}
                    value={day}
                    {...register('workdays')}
                  />
                  <label htmlFor={`workday-${index}`}>{day}</label>
                </div>
              ))}
            </S.CheckboxGroup>
            {errors.workdays?.type && (
              <InputError>
                {formErrors['workdays'][errors.workdays?.type]}
              </InputError>
            )}
          </S.InputContainer>

          <S.InputContainer>
            <label htmlFor="workshift">Turnos</label>
            <S.CheckboxGroup>
              {WORKSHIFT.map((shift, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={`workshift-${index}`}
                    value={shift}
                    {...register('workshift')}
                  />
                  <label htmlFor={`workshift-${index}`}>{shift}</label>
                </div>
              ))}
            </S.CheckboxGroup>
            {errors.workshift?.type && (
              <InputError>
                {formErrors['workshift'][errors.workshift?.type]}
              </InputError>
            )}
          </S.InputContainer>
          {success && (
            <S.SuccessMessage>Profissional Cadastrado!</S.SuccessMessage>
          )}
          <Button className="button-register" variant="terciary" type="submit">
            Cadastrar
          </Button>
        </S.Form>
      </S.Main>
    </PageWrapper>
  );
};

export default RegisterProfessional;
