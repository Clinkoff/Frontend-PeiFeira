import { apiClient } from './client';
import type {
  Semestre,
  CreateSemestreRequest,
  UpdateSemestreRequest,
  SemestreWithDetails,
} from '@/lib/types';

export const semestreApi = {
  // Listar todos os semestres
  getAll: async (): Promise<Semestre[]> => {
    const response = await apiClient.get<Semestre[]>('/api/semestres');
    return response.data;
  },

  // Buscar semestre por ID
  getById: async (id: string): Promise<SemestreWithDetails> => {
    const response = await apiClient.get<SemestreWithDetails>(`/api/semestres/${id}`);
    return response.data;
  },

  // Criar semestre
  create: async (data: CreateSemestreRequest): Promise<Semestre> => {
    const response = await apiClient.post<Semestre>('/api/semestres', data);
    return response.data;
  },

  // Atualizar semestre
  update: async (id: string, data: UpdateSemestreRequest): Promise<Semestre> => {
    const response = await apiClient.put<Semestre>(`/api/semestres/${id}`, data);
    return response.data;
  },

  // Deletar semestre
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/semestres/${id}`);
  },

  // Ativar/Desativar semestre
  toggleActive: async (id: string): Promise<Semestre> => {
    const response = await apiClient.patch<Semestre>(`/api/semestres/${id}/toggle-active`);
    return response.data;
  },
};
