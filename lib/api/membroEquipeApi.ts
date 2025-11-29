// lib/api/membroEquipeApi.ts
import { apiClient } from './client';
import type { MembroEquipeResponse, AddMembroEquipeRequest } from '@/lib/types/equipes.types';

export const membroEquipeApi = {
  // Listar membros por equipe
  getByEquipe: async (equipeId: string): Promise<MembroEquipeResponse[]> => {
    const response = await apiClient.get<MembroEquipeResponse[]>(
      `/api/membros-equipe/equipe/${equipeId}`
    );
    return response.data;
  },

  // Listar equipes por aluno
  getByAluno: async (perfilAlunoId: string): Promise<MembroEquipeResponse[]> => {
    const response = await apiClient.get<MembroEquipeResponse[]>(
      `/api/membros-equipe/aluno/${perfilAlunoId}`
    );
    return response.data;
  },

  // Buscar por ID
  getById: async (id: string): Promise<MembroEquipeResponse> => {
    const response = await apiClient.get<MembroEquipeResponse>(`/api/membros-equipe/${id}`);
    return response.data;
  },

  // Adicionar membro
  add: async (data: AddMembroEquipeRequest): Promise<MembroEquipeResponse> => {
    const response = await apiClient.post<MembroEquipeResponse>('/api/membros-equipe', data);
    return response.data;
  },

  // Remover membro
  remove: async (equipeId: string, perfilAlunoId: string): Promise<void> => {
    await apiClient.delete(`/api/membros-equipe/${equipeId}/${perfilAlunoId}`);
  },

  // Verificar se é membro
  isMembro: async (equipeId: string, perfilAlunoId: string): Promise<boolean> => {
    const response = await apiClient.get<boolean>(
      `/api/membros-equipe/${equipeId}/${perfilAlunoId}/is-membro`
    );
    return response.data;
  },
};
