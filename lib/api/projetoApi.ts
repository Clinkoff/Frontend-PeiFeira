// lib/api/projetoApi.ts
import { apiClient } from './client';
import type {
  Projeto,
  ProjetoDetail,
  CreateProjetoRequest,
  UpdateProjetoRequest,
} from '@/lib/types/projetos.types';

export const projetoApi = {
  // Listar todos
  getAll: async (): Promise<Projeto[]> => {
    const response = await apiClient.get<Projeto[]>('/api/projetos');
    return response.data;
  },

  // Listar apenas ativos
  getActive: async (): Promise<Projeto[]> => {
    const response = await apiClient.get<Projeto[]>('/api/projetos/ativos');
    return response.data;
  },

  // Buscar por ID (simples)
  getById: async (id: string): Promise<Projeto> => {
    const response = await apiClient.get<Projeto>(`/api/projetos/${id}`);
    return response.data;
  },

  // Buscar por ID com detalhes (equipe, membros, disciplina, etc)
  getByIdWithDetails: async (id: string): Promise<ProjetoDetail> => {
    const response = await apiClient.get<ProjetoDetail>(`/api/projetos/${id}/detalhes`);
    return response.data;
  },

  // Buscar por equipe
  getByEquipeId: async (equipeId: string): Promise<Projeto> => {
    const response = await apiClient.get<Projeto>(`/api/projetos/equipe/${equipeId}`);
    return response.data;
  },

  // Buscar por disciplina PI
  getByDisciplinaPIId: async (disciplinaPIId: string): Promise<Projeto[]> => {
    const response = await apiClient.get<Projeto[]>(`/api/projetos/disciplina/${disciplinaPIId}`);
    return response.data;
  },

  // Listar projetos com empresa
  getProjetosComEmpresa: async (): Promise<Projeto[]> => {
    const response = await apiClient.get<Projeto[]>('/api/projetos/com-empresa');
    return response.data;
  },

  // Listar projetos acadêmicos (sem empresa)
  getProjetosAcademicos: async (): Promise<Projeto[]> => {
    const response = await apiClient.get<Projeto[]>('/api/projetos/academicos');
    return response.data;
  },

  // Criar
  create: async (data: CreateProjetoRequest): Promise<Projeto> => {
    console.log('Enviando para API:', data); // Debug
    const response = await apiClient.post<Projeto>('/api/projetos', data);
    return response.data;
  },

  // Atualizar
  update: async (id: string, data: UpdateProjetoRequest): Promise<Projeto> => {
    const response = await apiClient.put<Projeto>(`/api/projetos/${id}`, data);
    return response.data;
  },

  // Deletar
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/projetos/${id}`);
  },
};
