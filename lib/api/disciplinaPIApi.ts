// lib/api/disciplinaPIApi.ts
import { apiClient } from './client';
import type {
  DisciplinaPIResponse,
  DisciplinaPIDetailResponse,
  CreateDisciplinaPIRequest,
  UpdateDisciplinaPIRequest,
} from '@/lib/types/disciplinaPi.types';

export const disciplinaPIApi = {
  // Listar todas
  getAll: async (): Promise<DisciplinaPIResponse[]> => {
    const response = await apiClient.get<DisciplinaPIResponse[]>('/api/disciplinaspi');
    return response.data;
  },

  // Buscar por ID (básico)
  getById: async (id: string): Promise<DisciplinaPIResponse> => {
    const response = await apiClient.get<DisciplinaPIResponse>(`/api/disciplinaspi/${id}`);
    return response.data;
  },

  // Buscar por ID com detalhes completos
  getByIdWithDetails: async (id: string): Promise<DisciplinaPIDetailResponse> => {
    const response = await apiClient.get<DisciplinaPIDetailResponse>(
      `/api/disciplinaspi/${id}/detalhes`
    );
    return response.data;
  },

  // Listar apenas ativas
  getActive: async (): Promise<DisciplinaPIResponse[]> => {
    const response = await apiClient.get<DisciplinaPIResponse[]>('/api/disciplinaspi/ativas');
    return response.data;
  },

  // Listar por semestre
  getBySemestre: async (semestreId: string): Promise<DisciplinaPIResponse[]> => {
    const response = await apiClient.get<DisciplinaPIResponse[]>(
      `/api/disciplinaspi/semestre/${semestreId}`
    );
    return response.data;
  },

  // Listar por professor
  getByProfessor: async (perfilProfessorId: string): Promise<DisciplinaPIResponse[]> => {
    const response = await apiClient.get<DisciplinaPIResponse[]>(
      `/api/disciplinaspi/professor/${perfilProfessorId}`
    );
    return response.data;
  },

  // Listar por turma
  getByTurma: async (turmaId: string): Promise<DisciplinaPIResponse[]> => {
    const response = await apiClient.get<DisciplinaPIResponse[]>(
      `/api/disciplinaspi/turma/${turmaId}`
    );
    return response.data;
  },

  // Criar
  create: async (data: CreateDisciplinaPIRequest): Promise<DisciplinaPIResponse> => {
    const response = await apiClient.post<DisciplinaPIResponse>('/api/disciplinaspi', data);
    return response.data;
  },

  // Atualizar
  update: async (id: string, data: UpdateDisciplinaPIRequest): Promise<DisciplinaPIResponse> => {
    const response = await apiClient.put<DisciplinaPIResponse>(`/api/disciplinaspi/${id}`, data);
    return response.data;
  },

  // Deletar
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/disciplinaspi/${id}`);
  },

  // Associar turma à disciplina
  associarTurma: async (disciplinaPIId: string, turmaId: string): Promise<void> => {
    await apiClient.post(`/api/disciplinaspi/${disciplinaPIId}/turmas/${turmaId}`);
  },

  // Remover turma da disciplina
  removerTurma: async (disciplinaPIId: string, turmaId: string): Promise<void> => {
    await apiClient.delete(`/api/disciplinaspi/${disciplinaPIId}/turmas/${turmaId}`);
  },
};
