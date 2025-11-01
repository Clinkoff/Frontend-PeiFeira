import { apiClient } from './client';
import type { LoginRequest, LoginResponse, Usuario } from '@/lib/types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },

  getCurrentUser: async (): Promise<Usuario> => {
    const response = await apiClient.get<Usuario>('/api/auth/me');
    return response.data;
  },
};
