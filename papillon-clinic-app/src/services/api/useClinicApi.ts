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
  AvailableSlotsDTO,
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
  registerAppointment: (appointment: AppointmentDTO) => Promise<String[]>;
  updateProfessional: (
    professional: ProfessionalDTO
  ) => Promise<ProfessionalDTO>;
  updateAppointment: (appointment: AppointmentDTO) => Promise<String[]>;
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
  getAllAvailableSlots: (
    professionalIds: string[],
    specialty: string,
    date: string
  ) => Promise<AvailableSlotsDTO[]>;
  getAllWorkdaysWithShifts: () => Promise<WorkdayWithShiftsDTO[]>;
  findPatientById: (id: string) => Promise<PatientDTO>;
  findProfessionalById: (id: string) => Promise<ProfessionalDTO>;
  findAppointmentById: (id: string) => Promise<AppointmentDTO>;
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
    return await httpInstance.post<String[]>('/appointment', appointment);
  }

  async function updateProfessional(professional: ProfessionalDTO) {
    return await httpInstance.update<ProfessionalDTO>(
      '/professional',
      professional
    );
  }

  async function updateAppointment(appointment: AppointmentDTO) {
    return await httpInstance.update<String[]>(`/appointment`, appointment);
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

  async function getAllAvailableSlots(
    professionalIds: string[],
    specialty?: string,
    date?: string
  ) {
    const queryParams = professionalIds.map((id) => `ids=${id}`);

    if (specialty) {
      queryParams.push(`specialty=${specialty}`);
    }

    if (date) {
      queryParams.push(`date=${date}`);
    }

    const url = `/professional/all-available-slots?${queryParams.join('&')}`;
    console.log('URL:', url);

    return await httpInstance.get<AvailableSlotsDTO[]>(url);
  }

  async function findPatientById(id: string) {
    return await httpInstance.get<PatientDTO>(`/patient/${id}`);
  }
  async function findProfessionalById(id: string) {
    return await httpInstance.get<ProfessionalDTO>(`/professional/${id}`);
  }

  async function findAppointmentById(id: string) {
    return await httpInstance.get<AppointmentDTO>(`/appointment/${id}`);
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
        getAllAvailableSlots,
        getAllWorkdaysWithShifts,
        findPatientById,
        findAppointmentById,
        updatePatient,
        updateProfessional,
        updateAppointment,
        findProfessionalById,
        verifyToken,
      },

    []
  );
};
