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

export type ProfessionalDTO = {
  id?: string;
  name: string;
  cpf: string;
  crm: string;
  phone_number: string;
  speciality: string;
  discount: number;
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

export type AppointmentListDTO = {
  id: string;
  date: string;
  patient: string;
  professional: string;
  type: string;
  isPaid: boolean;
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
