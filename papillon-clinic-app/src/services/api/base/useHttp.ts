import { AxiosError, AxiosResponse } from 'axios';
import { useAxios } from './useAxios';
import { redirect } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

export const useHttp = (
  baseURL: string,
  headers: { [key: string]: string }
) => {
  const axiosInstace = useAxios(baseURL, headers);
  const responseBody = <T>(response: AxiosResponse<T>) => response.data;
  const { logout } = useContext(AuthContext);

  axiosInstace.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      const { status } = error.response!;

      if (status === 401) {
        logout();
        redirect('/');
      }

      return Promise.reject(error);
    }
  );

  const get = <T>(url: string) => axiosInstace.get<T>(url).then(responseBody);

  const post = <T>(url: string, body: {}) =>
    axiosInstace.post<T>(url, body).then(responseBody);

  const update = <T>(url: string, body: {}) =>
    axiosInstace.put<T>(url, body).then(responseBody);

  return { get, post, update };
};
