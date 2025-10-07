import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PageWrapper from '../../components/PageWrapper';
import Button from '../../components/baseComponents/Button';
import Input from '../../components/baseComponents/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import { bool, object, string } from 'yup';
import InputError from '../../components/baseComponents/InputError';
import VisuallyHidden from '../../components/baseComponents/VisuallyHidden';
import { useClinicApi } from '../../services/api/useClinicApi';
import { dataFormat } from '../../constants/types';
import { useNavigate, useParams } from 'react-router-dom';
import * as S from './styles';
import {
  AvailableSlotsDTO,
  PatientListDTO,
  ProfessionalListDTO,
} from '../../services/dtos';
import AvailableSlotsTable from './AvailableSlotsTable';
import Icon from '../../components/Icon';
import { appointmentToFormData } from '../../services/mappers';
import FrequencyModal from './RemoveFrequencyModal';
import { SCREEN_PATHS } from '../../constants/paths';

const FREQUENCY_OPTIONS = ['DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL'];

type FormAppointmentData = {
  id?: string;
  appointment_date: string;
  appointment_time: string;
  patientId: string;
  appointmentTypeId: string;
  payment_type: string;
  professionalId: string;
  payment_date?: string;
  observation: string;
  has_frequency: boolean;
  removeRelatedAppointments?: boolean;
  frequency?: Frequency;
};

type Frequency = {
  end_date?: string;
  frequency?: string;
  frequency_interval?: string;
  email_reminder?: boolean;
};

const formErrors: dataFormat = {
  patient_id: {
    required: 'Selecione um paciente!',
  },
  payment_type: {
    required: 'Informe o tipo de pagamento!',
  },
};

const RegisterAppointment: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [appointment, setAppointment] = useState<FormAppointmentData | null>(
    null
  );
  const [showFrequencyFields, setShowFrequencyFields] = useState(false);
  const [isFrequencyChecked, setFrequencyChecked] = useState<boolean>(false);
  const [oldFrequency, setOldFrequency] = useState<boolean>(false);
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
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotsDTO[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlotsDTO>();
  const [showFormFields, setShowFormFields] = useState(false);
  const [errorSlot, setErrorSlot] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const [frequencyErrors, setFrequencyErrors] = useState<{
    frequency?: string;
    end_date?: string;
  }>({});
  const [specialtyId, setSpecialtyId] = useState('');
  const [appointmentTypeId, setAppointmentTypeId] = useState('');
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [frequencyModalResolver, setFrequencyModalResolver] = useState<
    ((value: boolean) => void) | null
  >(null);

  const resetSelection = () => {
    setShowFormFields(false);
    setSelectedSlot(undefined);
  };

  const SlotDetails = () => (
    <div>
      <p>
        <Icon size={24} icon="calendar" primaryColor="#F19CA3" />
        {selectedSlot?.date}
      </p>
      <p>
        <Icon size={24} icon="clock" primaryColor="#F19CA3" />
        {selectedSlot?.time}
      </p>
      <p>
        <Icon size={24} icon="professional" primaryColor="#F19CA3" />
        {selectedSlot?.professionalName}
      </p>
    </div>
  );

  const {
    registerAppointment,
    getProfessionalsBySpecialty,
    getAppointmentTypes,
    getSpecialties,
    getPatients,
    getProfessionals,
    getAllAvailableSlots,
    findAppointmentById,
    updateAppointment,
  } = useClinicApi();

  const AppointmentSchema = object({
    appointment_date: string().trim().required(),
    appointment_time: string().trim().required(),
    patientId: string().trim().required(),
    appointmentTypeId: string().trim().required(),
    payment_type: string().trim().required(),
    professionalId: string().trim().required(),
    payment_date: string().optional(),
    observation: string().default(''),
    has_frequency: bool().default(false),
    frequency: object({
      frequency: string().trim().optional(),
      end_date: string().optional(),
      frequency_interval: string().optional(),
      email_reminder: bool().optional(),
    }).optional(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormAppointmentData>({
    resolver: yupResolver(AppointmentSchema),
    values: { ...appointment } as FormAppointmentData,
    mode: 'onSubmit',
  });

  console.log(errors);

  const callErrorDates = (skippedDateTimes: String[]) => {
    const formattedDates = skippedDateTimes.map((dt) =>
      new Date(dt.toString()).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    );

    setError(
      `Os seguintes horários não puderam ser adicionados:\n• ${formattedDates.join(
        '\n• '
      )}`
    );
  };

  const onSubmit = async (appointment: FormAppointmentData) => {
    if (appointment.has_frequency) {
      const freq = appointment.frequency;
      const newErrors: { frequency?: string; end_date?: string } = {};

      if (!freq?.frequency) {
        newErrors.frequency = 'Frequência é obrigatória';
      }

      if (!freq?.end_date) {
        newErrors.end_date = 'Data final é obrigatória';
      }

      if (Object.keys(newErrors).length > 0) {
        setFrequencyErrors(newErrors);
        return;
      }
    } else {
      appointment.frequency = undefined;
    }

    appointment.appointment_date = `${appointment.appointment_date}T${appointment.appointment_time}`;
    setFrequencyErrors({});
    console.log(appointment, id);
    if (id) {
      console.log(oldFrequency, isFrequencyChecked);
      console.log(appointment);
      if (oldFrequency === true && oldFrequency !== isFrequencyChecked) {
        const confirmed = await waitForFrequencyDecision();
        appointment.frequency = confirmed ? undefined : appointment.frequency;
        appointment.has_frequency = confirmed;
      }
      try {
        const skippedDateTimes = await updateAppointment({
          ...appointment,
          id,
        });
        if (skippedDateTimes.length === 0) {
          navigate(SCREEN_PATHS.appointments);
        } else {
          callErrorDates(skippedDateTimes);
        }
      } catch (error) {
        console.log(error);
        const errorObj = error as Error;
        setError(errorObj.message || 'Erro ao atualizar o atendimento.');
      }
    } else {
      try {
        const skippedDateTimes = await registerAppointment(appointment);
        if (skippedDateTimes.length === 0) {
          setSuccess((current) => !current);
          reset();
        } else {
          callErrorDates(skippedDateTimes);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const waitForFrequencyDecision = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setFrequencyModalResolver(() => resolve);
      setShowFrequencyModal(true);
    });
  };

  const handleConfirmRemove = () => {
    frequencyModalResolver?.(true);
    setShowFrequencyModal(false);
    setValue('has_frequency', false);
    setValue('frequency', undefined);
  };

  const handleCancelRemove = () => {
    frequencyModalResolver?.(false);
    changeVisibilityOfFrequencyFields(true);
    setShowFrequencyModal(false);
  };

  const changeVisibilityOfFrequencyFields = (hasFrequency: boolean) => {
    setShowFrequencyFields(hasFrequency);
    setValue('has_frequency', hasFrequency);
    setFrequencyChecked(hasFrequency);
  };

  const changeSelectedSlot = (slot: AvailableSlotsDTO) => {
    setSelectedSlot(slot);
    setErrorSlot('');
    setValue('appointment_date', slot.date);
    setValue('professionalId', slot.professionalId);
    setValue('appointment_time', slot.time);
    setSpecialtyId(slot.specialtyId);
    setShowFormFields(true);
  };

  const getAppointmentData = async (id: string) => {
    try {
      const response = await findAppointmentById(id);
      setAppointment(appointmentToFormData(response));
      changeVisibilityOfFrequencyFields(!!response.frequency?.id);
      const date = response.appointment_date.split('T')[0];
      const time = response.appointment_date.split('T')[1];
      const slot: AvailableSlotsDTO = {
        date: date,
        time: time,
        professionalId: response.professionalId,
        professionalName: response.professionalName,
        specialtyId: response.specialtyId || '',
      };
      changeSelectedSlot(slot);
      setAppointmentTypeId(response.appointmentTypeId);
      setValue('appointmentTypeId', response.appointmentTypeId);
      setOldFrequency(!!response.frequency?.id);
    } catch (error) {
      console.log('error' + error);
    }
  };

  const getPatientsData = async () => {
    try {
      const response = await getPatients();

      setPatients(response.content);
    } catch (error) {
      console.log('error' + error);
      setError('Erro ao buscar pacientes.');
    }
  };

  const getProfessionalsData = async () => {
    try {
      const response = await getProfessionals();

      setProfessionals(response.content);
    } catch (error) {
      console.log('error' + error);
      setError('Erro ao buscar profissionais.');
    }
  };

  const getAppointmentTypesData = async () => {
    try {
      const response = await getAppointmentTypes();
      setAppointmentType(response);
    } catch (error) {
      console.log('error' + error);
      setError('Erro ao buscar tipos de atendimento.');
    }
  };

  const getSpecialitiesData = async () => {
    try {
      const response = await getSpecialties();

      setSpecialties(response);
    } catch (error) {
      console.log('error' + error);
      setError('Erro ao buscar especialidades.');
    }
  };

  const handleChangeAppointmentType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setValue('appointmentTypeId', selectedValue);
    setAppointmentTypeId(selectedValue);
    setSpecialtyId('');
  };

  const updateSelectProfessionals = async (specialty_id: string) => {
    try {
      if (specialty_id === '') {
        getProfessionalsData();
        return;
      }
      const response = await getProfessionalsBySpecialty(specialty_id);
      console.log(response);
      setProfessionals(response);
    } catch (error) {
      console.log('error' + error);
    }
  };

  const getAvailableSlots = async () => {
    try {
      const selectedProfessionalId = getValues('professionalId');
      const selectedDate = getValues('appointment_date');

      // Se tiver profissional selecionado, usa só ele
      let professionalIds: string[] = [];

      if (selectedProfessionalId && selectedProfessionalId !== '') {
        professionalIds = [selectedProfessionalId];
      } else if ((professionals ?? []).length > 0) {
        professionalIds = (professionals ?? []).map((p) => p.id);
      } else {
        setErrorSlot('Nenhum profissional disponível.');
        setAvailableSlots([]);
        return;
      }
      console.log(professionalIds, specialtyId, selectedDate);
      const response = await getAllAvailableSlots(
        professionalIds,
        specialtyId,
        selectedDate || ''
      );
      setAvailableSlots(response);
      if (response.length === 0) {
        setErrorSlot('Nenhum horário disponível para os filtros selecionados.');
      } else {
        setErrorSlot('');
      }
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      setErrorSlot('Erro ao buscar horários.');
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
          <S.FirstFieldset>
            <legend>
              <VisuallyHidden>Dados do Atendimento</VisuallyHidden>
            </legend>
            <S.InputContainer>
              <label htmlFor="appointment_type_id">Tipo de Atendimento</label>
              <S.Select
                id="appointment_type_id"
                onChange={(event) => handleChangeAppointmentType(event)}
                value={appointmentTypeId}
                disabled={!!selectedSlot}
              >
                <option value="">Selecione um tipo...</option>
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
            <S.InputContainer>
              <label htmlFor="specialty_id">Especialidade</label>
              <S.Select
                value={specialtyId}
                id="specialty_id"
                onChange={(event) => {
                  const specialty_id = event.target.value;
                  setSpecialtyId(specialty_id);
                  updateSelectProfessionals(specialty_id);
                }}
                disabled={!!selectedSlot}
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
            <S.InputContainer>
              <label htmlFor="appointment_date">Data do Atendimento</label>
              <Input
                id="appointment_date"
                disabled={!!selectedSlot}
                type="date"
                {...register('appointment_date')}
              />
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="professional_id">Profissional</label>
              <S.Select
                defaultValue={''}
                id="professional_id"
                disabled={!!selectedSlot}
                {...register('professionalId')}
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
          </S.FirstFieldset>
          <Button
            className="button-filter"
            type="button"
            variant="primary"
            onClick={getAvailableSlots}
          >
            Filtrar
          </Button>
          <S.TableWrapper>
            {selectedSlot || Boolean(errorSlot) ? (
              <S.SelectedSlot>
                {errorSlot ? (
                  <S.ErrorMessage role="alert">
                    <Icon size={70} icon="error" primaryColor="red" />
                    {errorSlot}
                  </S.ErrorMessage>
                ) : (
                  <>
                    <SlotDetails />
                    <Button
                      variant="primary"
                      className="button-change-slot"
                      onClick={resetSelection}
                    >
                      Alterar Horário
                    </Button>
                  </>
                )}
              </S.SelectedSlot>
            ) : (
              <AvailableSlotsTable
                slots={availableSlots}
                onSelectSlot={(slot) => {
                  changeSelectedSlot(slot);
                }}
              />
            )}
          </S.TableWrapper>
          {showFormFields && (
            <>
              <S.SecondFieldset>
                <S.InputContainer>
                  <label htmlFor="payment_type">Tipo de Pagamento</label>
                  <Input id="payment_type" {...register('payment_type')} />
                  {errors.payment_type?.type &&
                    errors.payment_type?.type !== 'optionality' && (
                      <InputError>
                        {formErrors['payment_type'][errors.payment_type.type]}
                      </InputError>
                    )}
                </S.InputContainer>
                <S.InputContainer>
                  <label htmlFor="patient_id">Paciente</label>
                  <S.Select
                    defaultValue={''}
                    id="patient_id"
                    {...register('patientId')}
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
                  {errors.patientId?.type &&
                    errors.patientId?.type !== 'optionality' && (
                      <InputError>
                        {formErrors['patient_id'][errors.patientId?.type]}
                      </InputError>
                    )}
                </S.InputContainer>
                <S.CheckboxContainer>
                  <input
                    type="checkbox"
                    id="frequency"
                    checked={isFrequencyChecked}
                    onChange={(event) => {
                      changeVisibilityOfFrequencyFields(event.target.checked);
                    }}
                  />
                  <label htmlFor="frequency">Adicionar Recorrência</label>
                </S.CheckboxContainer>
                {showFrequencyFields && (
                  <>
                    <S.InputContainer>
                      <label htmlFor="appointment_date">
                        Término da Frequência
                      </label>
                      <Input
                        id="appointment_date"
                        type="date"
                        {...register('frequency.end_date')}
                      />
                      {frequencyErrors.end_date && (
                        <InputError>{frequencyErrors.end_date}</InputError>
                      )}
                    </S.InputContainer>
                    <S.InputContainer>
                      <label htmlFor="frequency">Frequência</label>
                      <S.Select
                        defaultValue={''}
                        id="frequency"
                        {...register('frequency.frequency')}
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
                      {frequencyErrors.frequency && (
                        <InputError>{frequencyErrors.frequency}</InputError>
                      )}
                    </S.InputContainer>
                    <S.InputContainer>
                      <label htmlFor="interval">Intervalo da Frequência</label>
                      <Input
                        id="interval"
                        type="number"
                        max={30}
                        {...register('frequency.frequency_interval')}
                      />
                    </S.InputContainer>
                  </>
                )}
              </S.SecondFieldset>
              <Button
                className="button-register"
                variant="terciary"
                type="submit"
              >
                {id ? 'Salvar' : 'Cadastrar'}
              </Button>
              <FrequencyModal
                isOpen={showFrequencyModal}
                onConfirm={handleConfirmRemove}
                onCancel={handleCancelRemove}
                onRequestClose={handleCancelRemove}
              />
            </>
          )}
          {success && (
            <S.SuccessMessage>Atendimento Cadastrado!</S.SuccessMessage>
          )}
          {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        </S.Form>
      </S.Main>
    </PageWrapper>
  );
};

export default RegisterAppointment;
