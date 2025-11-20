import { Guardian } from '../pages/RegisterPatient';

export type PatientDTO = {
  id?: string;
  cpf: string;
  name: string;
  address: {
    street: string;
    number: number;
    city: string;
    neighborhood: string;
    complement: string;
  };
  observation: string;
  birthdate: string;
  listGuardian: Guardian[];
};

export type Workday = {
  workday_id: string;
  shift_id: string;
};

export type ProfessionalDTO = {
  id?: string;
  name: string;
  cpf: string;
  email: string;
  registerNumber: string;
  phone_number: string;
  specialty_id: string;
  discount: number;
  workdays: Workday[];
};

export type PatientListDTO = {
  id: string;
  name: string;
  age: number;
  guardian: string;
};

export type AppointmentFinancialDTO = {
  appointmentDate: string;
  professionalName: string;
  appoitmentType: string;
  specialtyName: string;
  isPaid: boolean;
  amount: number;
  amountProfessional: number;
};

export type ProfessionalListDTO = {
  id: string;
  name: string;
  cpf: string;
  specialty: string;
};

type Frequency = {
  id?: string;
  end_date?: string;
  frequency?: string;
  frequency_interval?: string;
  email_reminder?: boolean;
};

export type AppointmentDTO = {
  id?: string;
  appointment_date: string;
  patientId: string;
  appointmentTypeId: string;
  payment_type: string;
  professionalId: string;
  specialtyId?: string;
  professionalName?: string;
  paymentDate?: string;
  observation: string;
  frequency?: Frequency;
};

export type AppointmentListDTO = {
  id: string;
  appointmentDate: string;
  patientName: string;
  professionalName: string;
  typeName: string;
  isPaid: boolean;
  specialtyName: string;
};

export type AvailableSlotsDTO = {
  date: string;
  time: string;
  professionalName?: string;
  professionalId: string;
  specialtyId: string;
};

export type AppointmentTypeListDTO = {
  id: string;
  name: string;
  amount: number;
};

export type SpecialtyListDTO = {
  id: string;
  name: string;
};

export type WorkdayWithShiftsDTO = {
  id: string;
  name: string;
  shifts: { id: string; shift: string; start_time: string; end_time: string }[];
};

export type Page<T> = {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};
