import { useContext, useMemo } from 'react';
import { useHttp } from './base/useHttp';
import { AuthContext, User } from '../../context/AuthContext';
import {
  AppointmentDTO,
  AppointmentListDTO,
  Page,
  PatientDTO,
  PatientListDTO,
  ProfessionalDTO,
  ProfessionalListDTO,
  AppointmentTypeListDTO,
  SpecialtyListDTO,
  WorkdayWithShiftsDTO,
} from '../dtos';

export type AuthData = {
  login: string;
  password: string;
};

interface IRoutes {
  auth: (authData: AuthData) => Promise<User>;
  registerPatient: (patient: PatientDTO) => Promise<PatientDTO>;
  updatePatient: (patient: PatientDTO) => Promise<PatientDTO>;
  registerProfessional: (
    professional: ProfessionalDTO
  ) => Promise<ProfessionalDTO>;
  registerAppointment: (appointment: AppointmentDTO) => Promise<AppointmentDTO>;
  updateProfessional: (
    professional: ProfessionalDTO
  ) => Promise<ProfessionalDTO>;
  getPatients: (page?: number, size?: number) => Promise<Page<PatientListDTO>>;
  getProfessionals: (
    page?: number,
    size?: number
  ) => Promise<Page<ProfessionalListDTO>>;
  getAppointments: (
    page?: number,
    size?: number
  ) => Promise<Page<AppointmentListDTO>>;
  getAppointmentTypes: () => Promise<AppointmentTypeListDTO[]>;
  getSpecialties: () => Promise<SpecialtyListDTO[]>;
  getProfessionalsBySpecialty: (
    specialty_id: string
  ) => Promise<ProfessionalListDTO[]>;
  getTopSixProfessionals: () => Promise<ProfessionalListDTO[]>;
  getNumberOfProfessionals: () => Promise<number>;
  getNumberOfPatients: () => Promise<number>;
  getNumberOfAppointments: () => Promise<number>;
  getAllWorkdaysWithShifts: () => Promise<WorkdayWithShiftsDTO[]>;
  findPatientById: (id: string) => Promise<PatientDTO>;
  findProfessionalById: (id: string) => Promise<ProfessionalDTO>;
  verifyToken: () => Promise<string>;
}

export const useClinicApi = () => {
  const { user } = useContext(AuthContext);
  const userLocalStorage = JSON.parse(localStorage.getItem('user') || '');
  const userToken = user?.token || '';

  const httpInstance = useHttp(import.meta.env.VITE_API_URL, {
    Authorization: userToken,
    'Content-Type': 'application/json',
  });

  const httpInstanceVerifyToken = useHttp(import.meta.env.VITE_API_URL, {
    Authorization: userLocalStorage?.token,
    'Content-Type': 'application/json',
    Accept: 'text/plain',
  });

  async function auth({ login, password }: AuthData) {
    return await httpInstance.post<User>('/auth', {
      login,
      password,
    });
  }

  async function registerPatient(patient: PatientDTO) {
    return await httpInstance.post<PatientDTO>('/patient', patient);
  }

  async function registerProfessional(professional: ProfessionalDTO) {
    return await httpInstance.post<ProfessionalDTO>(
      '/professional',
      professional
    );
  }

  async function registerAppointment(appointment: AppointmentDTO) {
    return await httpInstance.post<AppointmentDTO>('/appointment', appointment);
  }

  async function updateProfessional(professional: ProfessionalDTO) {
    return await httpInstance.update<ProfessionalDTO>(
      '/professional',
      professional
    );
  }

  async function getPatients(page: number = 0, size: number = 10) {
    return await httpInstance.get<Page<PatientListDTO>>(
      `/patient?page=${page}&size=${size}`
    );
  }

  async function getProfessionals(page: number = 0, size: number = 10) {
    return await httpInstance.get<Page<ProfessionalListDTO>>(
      `/professional?page=${page}&size=${size}`
    );
  }

  async function getProfessionalsBySpecialty(specialty_id: string) {
    return await httpInstance.get<ProfessionalListDTO[]>(
      `/professional/getBySpecialty?specialty_id=${specialty_id}`
    );
  }

  async function getAppointments(page: number = 0, size: number = 10) {
    return await httpInstance.get<Page<AppointmentListDTO>>(
      `/appointment?page=${page}&size=${size}`
    );
  }

  async function getAppointmentTypes() {
    return await httpInstance.get<AppointmentTypeListDTO[]>(`/appointmentType`);
  }

  async function getSpecialties() {
    return await httpInstance.get<SpecialtyListDTO[]>(`/specialty`);
  }

  async function getTopSixProfessionals() {
    return await httpInstance.get<ProfessionalListDTO[]>(
      '/professional/getRanking'
    );
  }

  async function getNumberOfProfessionals() {
    return await httpInstance.get<number>('/professional/getAmount');
  }

  async function getNumberOfPatients() {
    return await httpInstance.get<number>('/patient/getAmount');
  }

  async function getNumberOfAppointments() {
    return await httpInstance.get<number>('/appointment/getAmount');
  }

  async function getAllWorkdaysWithShifts() {
    return await httpInstance.get<WorkdayWithShiftsDTO[]>(
      '/workday/getWorkdaysWithShifts'
    );
  }

  async function findPatientById(id: string) {
    return await httpInstance.get<PatientDTO>(`/patient/${id}`);
  }
  async function findProfessionalById(id: string) {
    return await httpInstance.get<ProfessionalDTO>(`/professional/${id}`);
  }

  async function updatePatient(patient: PatientDTO) {
    return await httpInstance.update<PatientDTO>('/patient', patient);
  }

  async function verifyToken() {
    if (userLocalStorage) {
      return await httpInstanceVerifyToken.get<string>('auth/verifyToken');
    }
  }

  return useMemo<IRoutes>(
    () =>
      <IRoutes>{
        auth,
        registerPatient,
        registerProfessional,
        registerAppointment,
        getPatients,
        getProfessionals,
        getProfessionalsBySpecialty,
        getAppointments,
        getAppointmentTypes,
        getSpecialties,
        getTopSixProfessionals,
        getNumberOfProfessionals,
        getNumberOfPatients,
        getNumberOfAppointments,
        getAllWorkdaysWithShifts,
        findPatientById,
        updatePatient,
        updateProfessional,
        findProfessionalById,
        verifyToken,
      },

    []
  );
};
