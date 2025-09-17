import { AppointmentDTO, PatientDTO, ProfessionalDTO } from './dtos';

type PatientForm = {
  name: string;
  birthdate: string;
  street: string;
  number: number;
  city: string;
  neighborhood: string;
  observation: string;
  complement: string;
  guardians: {
    id: string;
    name: string;
    relationship: string;
    cpf: string;
    phoneNumber: string;
    isMain: boolean;
  }[];
};

type PatientFormData = {
  name: string;
  birthdate: string;
  street: string;
  number: number;
  city: string;
  neighborhood: string;
  observation: string;
  complement: string;
};

type ProfessionalFormData = {
  name: string;
  cpf: string;
  crm: string;
  phone_number: string;
  specialty_id: string;
  discount: number;
  workdays: {
    workday_id: string;
    shift_id: string;
  }[];
};

type AppointmentFormData = {
  appointment_date: string;
  appointment_time: string;
  patientId: string;
  appointmentTypeId: string;
  payment_type: string;
  professionalId: string;
  payment_date?: string;
  observation: string;
  has_frequency: boolean;
  frequency: {
    id?: string;
    end_date?: string;
    frequency?: string;
    frequency_interval?: string;
    email_reminder?: boolean;
  };
};

export const patientMapper = (data: PatientForm): PatientDTO => {
  return {
    name: data.name,
    address: {
      street: data.street,
      number: data.number,
      city: data.city,
      neighborhood: data.neighborhood,
      complement: data.complement,
    },
    observation: data.observation,
    birthdate: data.birthdate,
    listGuardian: data.guardians,
  };
};

export const patientToFormData = (data: PatientDTO): PatientFormData => {
  return {
    name: data.name,
    street: data.address.street,
    number: data.address.number,
    city: data.address.city,
    neighborhood: data.address.neighborhood,
    complement: data.address.complement,
    observation: data.observation,
    birthdate: data.birthdate,
  };
};

export const professionalToFormData = (
  data: ProfessionalDTO
): ProfessionalFormData => {
  return {
    name: data.name,
    cpf: data.cpf,
    crm: data.crm,
    phone_number: data.phone_number,
    specialty_id: data.specialty_id,
    discount: data.discount,
    workdays: data.workdays,
  };
};

export const appointmentToFormData = (
  data: AppointmentDTO
): AppointmentFormData => {
  const time = data.appointment_date.split('T')[1],
    date = data.appointment_date.split('T')[0];
  return {
    appointment_date: date,
    appointment_time: time,
    patientId: data.patientId,
    appointmentTypeId: data.appointmentTypeId,
    payment_type: data.payment_type,
    professionalId: data.professionalId,
    payment_date: data.payment_date ?? undefined,
    observation: data.observation ?? undefined,
    has_frequency: data.frequency?.id ? true : false,
    frequency: {
      id: data.frequency?.id,
      end_date: data.frequency?.end_date,
      frequency: data.frequency?.frequency,
      frequency_interval: data.frequency?.frequency_interval,
      email_reminder: data.frequency?.email_reminder,
    },
  };
};
