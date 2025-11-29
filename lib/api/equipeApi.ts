// lib/api/equipeApi.ts
import { apiClient } from './client';
import type {
  EquipeResponse,
  EquipeDetailResponse,
  CreateEquipeRequest,
  UpdateEquipeRequest,
} from '@/lib/types/equipes.types';

export const equipeApi = {
  // Listar todas
  getAll: async (): Promise<EquipeResponse[]> => {
    const response = await apiClient.get<EquipeResponse[]>('/api/equipes');
    return response.data;
  },

  // Buscar por ID (básico)
  getById: async (id: string): Promise<EquipeResponse> => {
    const response = await apiClient.get<EquipeResponse>(`/api/equipes/${id}`);
    return response.data;
  },

  // Buscar por ID com detalhes completos
  getByIdWithDetails: async (id: string): Promise<EquipeDetailResponse> => {
    const response = await apiClient.get<EquipeDetailResponse>(`/api/equipes/${id}/detalhes`);
    return response.data;
  },

  // Listar apenas ativas
  getActive: async (): Promise<EquipeResponse[]> => {
    const response = await apiClient.get<EquipeResponse[]>('/api/equipes/ativas');
    return response.data;
  },

  // Buscar por líder
  getByLider: async (liderId: string): Promise<EquipeResponse> => {
    const response = await apiClient.get<EquipeResponse>(`/api/equipes/lider/${liderId}`);
    return response.data;
  },

  // Buscar por código de convite
  getByCodigoConvite: async (codigo: string): Promise<EquipeResponse> => {
    const response = await apiClient.get<EquipeResponse>(`/api/equipes/codigo/${codigo}`);
    return response.data;
  },

  // Criar
  create: async (data: CreateEquipeRequest): Promise<EquipeResponse> => {
    const response = await apiClient.post<EquipeResponse>('/api/equipes', data);
    return response.data;
  },

  // Atualizar
  update: async (id: string, data: UpdateEquipeRequest): Promise<EquipeResponse> => {
    const response = await apiClient.put<EquipeResponse>(`/api/equipes/${id}`, data);
    return response.data;
  },

  // Deletar
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/equipes/${id}`);
  },

  // Regenerar código de convite
  regenerarCodigoConvite: async (id: string): Promise<EquipeResponse> => {
    const response = await apiClient.post<EquipeResponse>(
      `/api/equipes/${id}/regenerar-codigo-convite`
    );
    return response.data;
  },
};
