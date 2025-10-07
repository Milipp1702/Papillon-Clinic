import Icon from '../../components/Icon';
import PageWrapper from '../../components/PageWrapper';
import Button from '../../components/baseComponents/Button';
import Input from '../../components/baseComponents/Input';
import VisuallyHidden from '../../components/baseComponents/VisuallyHidden';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import GuardianModal, { FormGuardianData } from './components/GuardianModal';
import { yupResolver } from '@hookform/resolvers/yup';
import GuardianTable from './components/GuardianTable';
import { dataFormat } from '../../constants/types';
import { object, string, number } from 'yup';
import { patientMapper, patientToFormData } from '../../services/mappers';
import { useClinicApi } from '../../services/api/useClinicApi';
import PageTitle from '../../components/baseComponents/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { SCREEN_PATHS } from '../../constants/paths';
import * as S from './styles';
import InputError from '../../components/baseComponents/InputError';

type FormData = {
  name: string;
  birthdate: string;
  street: string;
  number: number;
  city: string;
  neighborhood: string;
  complement: string;
  observation: string;
};

export type Guardian = {
  id?: string;
  name: string;
  relationship: string;
  cpf: string;
  phoneNumber: string;
  isMain: boolean;
};

const formErrors: dataFormat = {
  name: {
    required: 'Informe o nome do paciente!',
  },
  street: {
    required: 'Informe a rua!',
  },
  city: {
    required: 'Informe o CPF!',
  },
  birthdate: {
    required: 'Informe a data de nascimento!',
  },
  number: {
    required: 'Informe o número!',
    typeError: 'O número deve ser válido!',
    min: 'O número deve ser maior que zero!',
  },
  neighborhood: {
    required: 'Informe o bairro!',
  },
};

const RegisterPatient: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [guardianList, setGuardianList] = useState<Guardian[] | []>([]);
  const [editGuardian, setEditGuardian] = useState<Guardian | null>(null);
  const [patient, setPatient] = useState<FormData | null>(null);
  const { id } = useParams();
  const { registerPatient, findPatientById, updatePatient } = useClinicApi();
  const navigate = useNavigate();

  const handleModal = (isEdit?: boolean) => {
    if (!isEdit) {
      setEditGuardian(null);
    }
    setOpenModal(!openModal);
  };

  const formSchema = object({
    name: string().trim().required(),
    street: string().trim().required(),
    city: string().trim().required(),
    birthdate: string().trim().required(),
    number: number().required(),
    neighborhood: string().trim().required(),
    complement: string().default(() => ''),
    observation: string().default(() => ''),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    values: { ...patient } as FormData,
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    if (guardianList.length === 0) {
      setError('Adicione ao menos um responsável!');
      return;
    }
    setError('');
    const patient = patientMapper({ ...data, guardians: guardianList });

    if (id) {
      try {
        await updatePatient({ ...patient, id });
        return navigate(SCREEN_PATHS.patients);
      } catch (error) {
        console.log(error);
        setError('Erro ao atualizar paciente.');
      }
    } else {
      try {
        await registerPatient(patient);
        reset();
        setGuardianList([]);
      } catch (error) {
        console.log(error);
        setError('Erro ao cadastrar paciente.');
      }
    }
  };

  const handleGuardianAdd = (data: FormGuardianData) => {
    const newGuardian: Guardian = { ...data, isMain: data.isMain === 'true' };
    const hasMainGuardian = guardianList.find((guardian) => guardian.isMain);

    if (hasMainGuardian && newGuardian.isMain) {
      return;
    }

    setGuardianList((current) => [...current, newGuardian]);
  };

  const handleEditGuardian = (cpf: string) => {
    const guardian =
      guardianList.find((guardian) => guardian.cpf === cpf) || null;

    setEditGuardian(guardian);
    handleModal(true);
  };

  const onEditGuardian = (data: FormGuardianData) => {
    const newGuardian: Guardian = { ...data, isMain: data.isMain === 'true' };

    const updated = guardianList.filter(
      (guardian) => guardian.cpf !== newGuardian.cpf
    );

    setEditGuardian(null);
    setGuardianList(() => [...updated, newGuardian]);
  };

  const handleDeleteGuardian = (cpf: string) => {
    const updated = guardianList.filter((guardian) => guardian.cpf !== cpf);

    setGuardianList(() => [...updated]);
  };

  const getPatientData = async (id: string) => {
    try {
      const response = await findPatientById(id);
      setGuardianList(response.listGuardian);
      setPatient(patientToFormData(response));
      setError('');
    } catch (error) {
      console.log('error' + error);
      setError('Erro ao buscar dados do paciente.');
    }
  };

  useEffect(() => {
    if (id) {
      getPatientData(id);
    }
  }, []);

  return (
    <PageWrapper>
      <S.Main>
        <PageTitle>{id ? 'Editar Paciente' : 'Cadastro de Paciente'}</PageTitle>
        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <S.Fieldset>
            <legend>
              <VisuallyHidden>Dados do paciente</VisuallyHidden>
            </legend>
            <S.InputWrapper>
              <S.InputContainer>
                <label htmlFor="name">Nome</label>
                <Input id="name" {...register('name')} />
                {errors.name?.type && (
                  <InputError>
                    {formErrors['name'][errors.name?.type]}
                  </InputError>
                )}
              </S.InputContainer>
              <S.InputContainer>
                <label htmlFor="street">Rua</label>
                <Input id="street" {...register('street')} />
                {errors.street?.type && (
                  <InputError>
                    {formErrors['street'][errors.street?.type]}
                  </InputError>
                )}
              </S.InputContainer>
              <S.InputContainer>
                <label htmlFor="city">Cidade</label>
                <Input id="city" {...register('city')} />
                {errors.city?.type && (
                  <InputError>
                    {formErrors['city'][errors.city?.type]}
                  </InputError>
                )}
              </S.InputContainer>
            </S.InputWrapper>
            <S.InputWrapper>
              <S.InputContainer>
                <label htmlFor="birthdate">Data de Nascimento</label>
                <Input id="birthdate" {...register('birthdate')} />
                {errors.birthdate?.type && (
                  <InputError>
                    {formErrors['birthdate'][errors.birthdate?.type]}
                  </InputError>
                )}
              </S.InputContainer>
              <div style={{ display: 'flex', gap: '40px' }}>
                <S.InputContainer className="number">
                  <label htmlFor="number">Número</label>
                  <Input
                    type="number"
                    min={1}
                    id="number"
                    {...register('number')}
                  />
                  {errors.number?.type && (
                    <InputError>
                      {formErrors['number'][errors.number?.type]}
                    </InputError>
                  )}
                </S.InputContainer>
                <S.InputContainer className="neighborhood">
                  <label htmlFor="neighborhood">Bairro</label>
                  <Input id="neighborhood" {...register('neighborhood')} />
                  {errors.neighborhood?.type && (
                    <InputError>
                      {formErrors['neighborhood'][errors.neighborhood?.type]}
                    </InputError>
                  )}
                </S.InputContainer>
              </div>
              <S.InputContainer className="complement">
                <label htmlFor="complement">Complemento</label>
                <Input
                  defaultValue={''}
                  id="complement"
                  {...register('complement')}
                />
              </S.InputContainer>
            </S.InputWrapper>
          </S.Fieldset>
          <S.TextareaContainer>
            <div>
              <label htmlFor="observation">Observação</label>
              <textarea id="observation" {...register('observation')} />
            </div>
          </S.TextareaContainer>
          <S.GuardianFieldset>
            <S.AddButtonWrapper>
              <legend>Responsáveis</legend>
              <Button
                variant="iconButton"
                type="button"
                aria-label="Adicionar Responsável "
                onClick={() => handleModal(false)}
              >
                <Icon icon="addButton" size={32} />
              </Button>
            </S.AddButtonWrapper>
            <GuardianTable
              guardians={guardianList}
              onCickEdit={handleEditGuardian}
              onClickDelete={handleDeleteGuardian}
            />
          </S.GuardianFieldset>
          <Button className="button-register" variant="terciary" type="submit">
            {id ? 'Salvar' : 'Cadastrar'}
          </Button>
          <GuardianModal
            isOpen={openModal}
            editGuardian={editGuardian}
            onClose={handleModal}
            onAdd={handleGuardianAdd}
            onEdit={onEditGuardian}
          />
          {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        </S.Form>
      </S.Main>
    </PageWrapper>
  );
};

export default RegisterPatient;
