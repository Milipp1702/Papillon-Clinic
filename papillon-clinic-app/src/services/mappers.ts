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
    workshift: data.workshift,
  };
};
