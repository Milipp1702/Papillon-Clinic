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
import WorkdaySelector from './WorkdaySelector';
import { Workday } from '../../services/dtos';

type FormProfessionalData = {
  id?: string;
  name: string;
  cpf: string;
  email: string;
  crm: string;
  phone_number: string;
  specialty_id: string;
  discount: number;
  workdays: Workday[];
};

type WorkdayWithShift = {
  workday_id: string;
  shift_id: string;
};

const formErrors: dataFormat = {
  name: {
    required: 'Informe o nome!',
  },
  crm: {
    required: 'Informe o CRM!',
  },
  email: {
    required: 'Informe um email válido!',
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
  specialty: {
    required: 'Informe a especialidade!',
  },
  discount: {
    typeError: 'Informe o valor a ser descontado!',
  },
  workdays: {
    required: 'Informe os dias de trabalho!',
  },
};

const RegisterProfessional: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [professional, setProfessional] = useState<FormProfessionalData | null>(
    null
  );
  const [specialties, setSpecialties] = useState<
    { id: string; name: string }[] | null
  >([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedWorkdays, setSelectedWorkdays] = useState<WorkdayWithShift[]>(
    []
  );
  const {
    registerProfessional,
    updateProfessional,
    findProfessionalById,
    getSpecialties,
  } = useClinicApi();

  const ProfessionalSchema = object({
    name: string().trim().required(),
    crm: string().trim().required(),
    cpf: string().trim().required().matches(ONLY_NUMBERS).min(11).max(11),
    email: string().trim().required().email('Email inválido!'),
    phone_number: string()
      .trim()
      .required()
      .matches(ONLY_NUMBERS)
      .min(11)
      .max(11),
    specialty_id: string().trim().required(),
    discount: number().required(),
    workdays: array()
      .of(
        object({
          workday_id: string().trim().required(),
          shift_id: string().trim().required(),
        })
      )
      .required(),
  });

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormProfessionalData>({
    resolver: yupResolver(ProfessionalSchema),
    values: { ...professional } as FormProfessionalData,
  });

  console.log(errors);

  const onSubmit = async (data: FormProfessionalData) => {
    const professional = {
      ...data,
      workdays: selectedWorkdays,
    };

    if (id) {
      try {
        await updateProfessional({ ...professional, id });
        return navigate(SCREEN_PATHS.professionals);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        console.log(professional);
        await registerProfessional(professional);
        setSuccess((current) => !current);
        reset();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getSpecialtiesData = async () => {
    try {
      const response = await getSpecialties();

      setSpecialties(response);
    } catch (error) {
      console.log('error' + error);
      //setError('Erro ao buscar especialidades.');
    }
  };

  const getProfessionalData = async (id: string) => {
    try {
      const response = await findProfessionalById(id);
      setProfessional(professionalToFormData(response));
      setSelectedWorkdays(response.workdays);
    } catch (error) {
      console.log('error' + error);
    }
  };

  useEffect(() => {
    setValue('workdays', selectedWorkdays);
  }, [selectedWorkdays]);

  useEffect(() => {
    if (id) {
      getProfessionalData(id);
    }
    getSpecialtiesData();
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
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email?.type && (
                <InputError>
                  {formErrors['email'][errors.email?.type]}
                </InputError>
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
                id="specialty_id"
                {...register('specialty_id')}
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {specialties?.map((speciality, index) => (
                  <option key={index + 'speciality'} value={speciality.id}>
                    {speciality.name}
                  </option>
                ))}
              </S.Select>
              {errors.specialty_id?.type && (
                <InputError>
                  {formErrors['specialty_id'][errors.specialty_id?.type]}
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
          <WorkdaySelector
            selected={selectedWorkdays}
            onChange={setSelectedWorkdays}
          />
          {success && (
            <S.SuccessMessage>Profissional Cadastrado!</S.SuccessMessage>
          )}
          <Button className="button-register" variant="terciary" type="submit">
            {id ? 'Salvar' : 'Cadastrar'}
          </Button>
        </S.Form>
      </S.Main>
    </PageWrapper>
  );
};

export default RegisterProfessional;
