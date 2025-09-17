import { Guardian } from '../pages/RegisterPatient';

export type PatientDTO = {
  id?: string;
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
  crm: string;
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

export type ProfessionalListDTO = {
  id: string;
  name: string;
  cpf: string;
  crm: string;
};

export type AppointmentDTO = {
  id?: string;
  appointment_date: string;
  patient_id: string;
  appointment_type_id: string;
  specialty_id?: string;
  payment_type: string;
  professional_id: string;
  payment_date?: string;
  observation: string;
  appointment_frequency?: {
    end_date: string;
    frequency: string;
    frequency_interval?: number;
    email_reminder?: boolean;
  };
};

export type AppointmentListDTO = {
  id: string;
  date: string;
  patient: string;
  professional: string;
  type: string;
  isPaid: boolean;
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
