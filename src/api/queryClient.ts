import axios, { AxiosError } from 'axios';
import { QueryClient } from '@tanstack/query-core';
import { useAuthStore } from '../stores/authStore';

export const APIService = axios.create({
  baseURL: 'http://api.aal.vn/api/',
  responseType: 'json',
  withCredentials: true,
  timeout: 50000,
  headers: {},
});

const isSuccessRequest = (status: number) => {
  return status === 200 || status === 201 || status === 204;
};

APIService.interceptors.request.use(
  config => {
    const newConfig = { ...config };
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken && newConfig?.headers && !newConfig.headers.Authorization)
      newConfig.headers.Authorization = 'Bearer ' + accessToken;

    return newConfig;
  },
  error => {
    return Promise.reject(error);
  },
);

APIService.interceptors.response.use(
  response => {
    if (isSuccessRequest(response.status)) {
      return response;
    }

    return Promise.reject(response.data);
  },
  (err: AxiosError) => {
    if (err.status === 401) {
      useAuthStore().actions.setAuthState({
        accessToken: null,
        refreshToken: null,
      });

      return Promise.reject(err);
    }

    return Promise.reject(err);
  },
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 20,
      gcTime: 1000 * 60 * 60 * 6,
      retry: (failureCount, error) => {
        const err = error as AxiosError;

        return err.response?.status === 500 && failureCount < 2;
      },
      retryDelay: 1000 * 3,
      // Configure your default query options here
    },
    mutations: {
      // Configure your default mutation options here
    },
  },
});
