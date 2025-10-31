import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/lib/config/env';
import type { ApiError } from '@/lib/types';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor de Request - Adiciona token de autenticação
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Busca token do localStorage
    const token = localStorage.getItem('auth_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (!error.response) {
      return Promise.reject({
        message: 'Erro de conexão. Verifique sua internet.',
        statusCode: 0,
      } as ApiError);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
        break;

      case 403:
        // Proibido
        return Promise.reject({
          message: 'Você não tem permissão para acessar este recurso.',
          statusCode: status,
        } as ApiError);

      case 404:
        return Promise.reject({
          message: 'Recurso não encontrado.',
          statusCode: status,
        } as ApiError);

      case 500:
        return Promise.reject({
          message: 'Erro interno do servidor. Tente novamente mais tarde.',
          statusCode: status,
        } as ApiError);

      default:
        return Promise.reject({
          message: data?.message || 'Ocorreu um erro inesperado.',
          errors: data?.errors,
          statusCode: status,
        } as ApiError);
    }

    return Promise.reject(error);
  }
);
