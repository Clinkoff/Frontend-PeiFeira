import { apiClient } from './client';
import type {
  Usuario,
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
  UsuarioWithDetails,
} from '@/lib/types/usuario.types';

export const usuarioApi = {
  // Listar todos
  getAll: async (): Promise<Usuario[]> => {
    const response = await apiClient.get<Usuario[]>('/api/usuarios');
    return response.data;
  },

  // Buscar por ID
  getById: async (id: string): Promise<UsuarioWithDetails> => {
    const response = await apiClient.get<UsuarioWithDetails>(`/api/usuarios/${id}`);
    return response.data;
  },

  // Criar
  create: async (data: CreateUsuarioRequest): Promise<Usuario> => {
    console.log('Enviando para API:', data); // Debug
    const response = await apiClient.post<Usuario>('/api/usuarios', data);
    return response.data;
  },

  // Atualizar
  update: async (id: string, data: UpdateUsuarioRequest): Promise<Usuario> => {
    const response = await apiClient.put<Usuario>(`/api/usuarios/${id}`, data);
    return response.data;
  },

  // Deletar
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/usuarios/${id}`);
  },
  // Listar apenas ativos
  getActive: async (): Promise<Usuario[]> => {
    const response = await apiClient.get<Usuario[]>('/api/usuarios/ativos');
    return response.data;
  },

  // Listar professores
  getProfessores: async (): Promise<Usuario[]> => {
    const response = await apiClient.get<Usuario[]>('/api/usuarios/professores');
    return response.data;
  },

  // Listar alunos
  getAlunos: async (): Promise<Usuario[]> => {
    const response = await apiClient.get<Usuario[]>('/api/usuarios/alunos');
    return response.data;
  },

  // Mudar senha
  changePassword: async (
    id: string,
    data: { senhaAntiga: string; novaSenha: string }
  ): Promise<void> => {
    await apiClient.put(`/api/usuarios/${id}/mudar-senha`, data);
  },

  // Verificar se matrícula já existe
  existsMatricula: async (matricula: string): Promise<boolean> => {
    const response = await apiClient.get<boolean>(`/api/usuarios/exists/matricula/${matricula}`);
    return response.data;
  },

  // Verificar se email já existe
  existsEmail: async (email: string): Promise<boolean> => {
    const response = await apiClient.get<boolean>(`/api/usuarios/exists/email/${email}`);
    return response.data;
  },
};
