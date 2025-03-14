import axios from 'axios';

export const useAxios = (
  baseURL: string,
  headers: { [key: string]: string }
) => {
  return axios.create({
    baseURL,
    headers,
  });
};
