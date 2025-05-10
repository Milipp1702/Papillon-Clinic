import { useState, useEffect, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import PageWrapper from '../../components/PageWrapper';
import Button from '../../components/baseComponents/Button';
import Input from '../../components/baseComponents/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import { bool, number, object, string } from 'yup';
import VisuallyHidden from '../../components/baseComponents/VisuallyHidden';
import { useClinicApi } from '../../services/api/useClinicApi';
import { useNavigate, useParams } from 'react-router-dom';
import * as S from './styles';
import { PatientListDTO, ProfessionalListDTO } from '../../services/dtos';

const FREQUENCY_OPTIONS = ['DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL'];

type FormAppointmentData = {
  id?: string;
  appointment_date: string;
  patient_id: string;
  appointment_type_id: string;
  specialty_id?: string;
  payment_type: string;
  professional_id: string;
  payment_date?: string;
  observation: string;
  hasFrequency: string;
  appointment_frequency?: Frequency;
};

type Frequency = {
  end_date: string;
  frequency: string;
  frequency_interval?: number;
  email_reminder?: boolean;
};

const RegisterAppointment: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [appointment, setAppointment] = useState<FormAppointmentData | null>(
    null
  );
  const [hasFrequency, setHasFrequency] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>({} as Frequency);
  const [patients, setPatients] = useState<PatientListDTO[] | null>(
    [] as PatientListDTO[]
  );
  const [professionals, setProfessionals] = useState<
    ProfessionalListDTO[] | null
  >([]);
  const [specialties, setSpecialties] = useState<
    { id: string; name: string }[] | null
  >([]);
  const [appointmentTypes, setAppointmentType] = useState<
    { id: string; name: string }[] | null
  >([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    registerAppointment,
    getProfessionalsBySpecialty,
    findProfessionalById,
    getAppointmentTypes,
    getSpecialties,
    getPatients,
    getProfessionals,
  } = useClinicApi();

  const AppointmentSchema = object({
    appointment_date: string().trim().required(),
    patient_id: string().trim().required(),
    appointment_type_id: string().trim().required(),
    specialty_id: string().trim().optional(),
    payment_type: string().trim().required(),
    professional_id: string().trim().required(),
    payment_date: string().optional(),
    observation: string().default(''),
    hasFrequency: string().required(),
    appointment_frequency: object({
      frequency: string().trim().required(),
      end_date: string().required(),
      frequency_interval: number().optional(),
      email_reminder: bool().optional(),
    }).optional(),
  });

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormAppointmentData>({
    resolver: yupResolver(AppointmentSchema),
    values: { ...appointment } as FormAppointmentData,
  });

  const onSubmit = async (data: FormAppointmentData) => {
    const appointment = {
      ...data,
      appointment_frequency: frequency,
    };

    if (id) {
      /* try {
        await updateProfessional({ ...appointment, id });
        return navigate(SCREEN_PATHS.appointments);
      } catch (error) {
        console.log(error);
      }*/
    } else {
      try {
        await registerAppointment(appointment);
        setSuccess((current) => !current);
        reset();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getAppointmentData = async (id: string) => {
    /*try {
      const response = await findProfessionalById(id);
      setAppointment(response);
    } catch (error) {
      console.log('error' + error);
    }*/
  };

  const getPatientsData = async () => {
    try {
      const response = await getPatients();

      setPatients(response.content);
    } catch (error) {
      console.log('error' + error);
      //setError(true);
    }
  };

  const getProfessionalsData = async () => {
    try {
      const response = await getProfessionals();

      setProfessionals(response.content);
    } catch (error) {
      console.log('error' + error);
      //setError(true);
    }
  };

  const getAppointmentTypesData = async () => {
    try {
      const response = await getAppointmentTypes();
      setAppointmentType(response);
    } catch (error) {
      console.log('error' + error);
      //setError(true);
    }
  };

  const getSpecialitiesData = async () => {
    try {
      const response = await getSpecialties();

      setSpecialties(response);
    } catch (error) {
      console.log('error' + error);
      //setError(true);
    }
  };

  const handleChangeAppointmentType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    const selectedText = event.target.selectedOptions[0].text;
    console.log(selectedText);
    setSelectedType(selectedText);
    setValue('appointment_type_id', selectedValue);
    setValue('specialty_id', '');
  };

  const updateSelectProfessionals = async (specialty_id: string) => {
    try {
      if (specialty_id === '') {
        getProfessionalsData();
        return;
      }
      const response = await getProfessionalsBySpecialty(specialty_id);
      setProfessionals(response);
    } catch (error) {
      console.log('error' + error);
    }
  };

  useEffect(() => {
    getPatientsData();
    getProfessionalsData();
    getAppointmentTypesData();
    getSpecialitiesData();

    if (id) {
      getAppointmentData(id);
    }
  }, []);

  return (
    <PageWrapper>
      <S.Main>
        <S.Title>{id ? 'Editar Atendimento' : 'Cadastrar Atendimento'}</S.Title>
        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <S.Fieldset>
            <legend>
              <VisuallyHidden>Dados do Atendimento</VisuallyHidden>
            </legend>
            <S.InputContainer>
              <label htmlFor="payment_type">Tipo de Atendimento</label>
              <S.Select
                defaultValue={''}
                id="appointment_type_id"
                onChange={(event) => handleChangeAppointmentType(event)}
              >
                <option value="" disabled>
                  Selecione um tipo...
                </option>
                {appointmentTypes &&
                  appointmentTypes.map((appointmentType, index) => (
                    <option
                      key={index + 'appointmentType'}
                      value={appointmentType.id}
                    >
                      {appointmentType.name}
                    </option>
                  ))}
              </S.Select>
            </S.InputContainer>
            {selectedType === 'ATENDIMENTO' && (
              <S.InputContainer>
                <label htmlFor="specialty_id">Especialidade</label>
                <S.Select
                  defaultValue={''}
                  id="specialty_id"
                  onChange={(event) => {
                    const specialty_id = event.target.value;
                    setValue('specialty_id', specialty_id);
                    updateSelectProfessionals(specialty_id);
                  }}
                >
                  <option value="">Selecione a especialidade...</option>
                  {specialties &&
                    specialties.map((specialty) => (
                      <option key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </option>
                    ))}
                </S.Select>
              </S.InputContainer>
            )}
            <S.InputContainer>
              <label htmlFor="appointment_date">Data do Atendimento</label>
              <Input id="appointment_date" {...register('appointment_date')} />
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="professional_id">Profissional</label>
              <S.Select
                defaultValue={''}
                id="professional_id"
                {...register('professional_id')}
              >
                <option value="" disabled>
                  Selecione um profissional...
                </option>
                {professionals &&
                  professionals.map((professional, index) => (
                    <option
                      key={index + 'professional'}
                      value={professional.id}
                    >
                      {professional.name}
                    </option>
                  ))}
              </S.Select>
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="payment_type">Tipo de Pagamento</label>
              <Input id="payment_type" {...register('payment_type')} />
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="patient_id">Paciente</label>
              <S.Select
                defaultValue={''}
                id="patient_id"
                {...register('patient_id')}
              >
                <option value="" disabled>
                  Selecione um paciente...
                </option>
                {patients &&
                  patients.map((patient, index) => (
                    <option key={index + 'patient'} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                <option value="newPatient">Cadastrar novo paciente</option>
              </S.Select>
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="discount">Adicionar Recorrência</label>
              <Input
                id="frequency"
                type="checkbox"
                {...register('appointment_frequency')}
              />
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="appointment_date">Término da Frequência</label>
              <Input
                id="appointment_date"
                {...register('appointment_frequency.end_date')}
              />
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="frequency">Frequência</label>
              <S.Select
                defaultValue={''}
                id="appointment_frequency"
                {...register('appointment_frequency.frequency')}
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {FREQUENCY_OPTIONS.map((frequency, index) => (
                  <option key={index + 'frequency'} value={frequency}>
                    {frequency}
                  </option>
                ))}
              </S.Select>
            </S.InputContainer>
          </S.Fieldset>
          {success && (
            <S.SuccessMessage>Atendimento Cadastrado!</S.SuccessMessage>
          )}
          <Button className="button-register" variant="terciary" type="submit">
            Cadastrar
          </Button>
        </S.Form>
      </S.Main>
    </PageWrapper>
  );
};

export default RegisterAppointment;
