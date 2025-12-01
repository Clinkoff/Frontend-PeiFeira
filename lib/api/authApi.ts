import { apiClient } from './client';
import type { LoginRequest, LoginResponse } from '@/lib/types/auth.types';
import type { Usuario } from '@/lib/types/usuario.types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    console.log('📡 API RECEBEU:', response.data);
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
