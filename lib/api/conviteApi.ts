// lib/api/conviteApi.ts
import { apiClient } from './client';
import type {
  ConviteEquipeResponse,
  CreateConviteEquipeRequest,
  RespondConviteRequest,
} from '@/lib/types';

export const conviteApi = {
  // Listar convites pendentes por aluno
  getConvitesPendentes: async (perfilAlunoId: string): Promise<ConviteEquipeResponse[]> => {
    const response = await apiClient.get<ConviteEquipeResponse[]>(
      `/api/convites-equipe/pendentes/${perfilAlunoId}`
    );
    return response.data;
  },

  // Listar convites de uma equipe
  getConvitesPorEquipe: async (equipeId: string): Promise<ConviteEquipeResponse[]> => {
    const response = await apiClient.get<ConviteEquipeResponse[]>(
      `/api/convites-equipe/equipe/${equipeId}`
    );
    return response.data;
  },

  // Buscar convite por ID
  getById: async (id: string): Promise<ConviteEquipeResponse> => {
    const response = await apiClient.get<ConviteEquipeResponse>(`/api/convites-equipe/${id}`);
    return response.data;
  },

  // Criar convite
  create: async (data: CreateConviteEquipeRequest): Promise<ConviteEquipeResponse> => {
    const response = await apiClient.post<ConviteEquipeResponse>('/api/convites-equipe', data);
    return response.data;
  },

  // Aceitar convite
  aceitar: async (id: string, perfilAlunoId: string): Promise<ConviteEquipeResponse> => {
    const response = await apiClient.put<ConviteEquipeResponse>(
      `/api/convites-equipe/${id}/aceitar`,
      { perfilAlunoId }
    );
    return response.data;
  },

  // Recusar convite
  recusar: async (id: string, perfilAlunoId: string): Promise<ConviteEquipeResponse> => {
    const response = await apiClient.put<ConviteEquipeResponse>(
      `/api/convites-equipe/${id}/recusar`,
      { perfilAlunoId }
    );
    return response.data;
  },

  // Cancelar convite
  cancelar: async (id: string, perfilAlunoId: string): Promise<ConviteEquipeResponse> => {
    const response = await apiClient.put<ConviteEquipeResponse>(
      `/api/convites-equipe/${id}/cancelar`,
      { perfilAlunoId }
    );
    return response.data;
  },
};
