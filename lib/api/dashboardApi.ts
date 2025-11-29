import { apiClient } from './client';
import type {
  DashboardStats,
  ProjetosPorStatus,
  DisciplinasPorSemestre,
  ProjetosPorMes,
  AlunosPorTurma,
  AtividadeRecente,
} from '@/lib/types';

export const dashboardApi = {
  // Estatísticas gerais
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/api/dashboard/stats');
    return response.data;
  },

  // Projetos por status
  getProjetosPorStatus: async (): Promise<ProjetosPorStatus[]> => {
    const response = await apiClient.get<ProjetosPorStatus[]>('/api/dashboard/projetos-por-status');
    return response.data;
  },

  // Disciplinas por semestre
  getDisciplinasPorSemestre: async (): Promise<DisciplinasPorSemestre[]> => {
    const response = await apiClient.get<DisciplinasPorSemestre[]>(
      '/api/dashboard/disciplinas-por-semestre'
    );
    return response.data;
  },

  // Evolução de projetos por mês
  getProjetosPorMes: async (): Promise<ProjetosPorMes[]> => {
    const response = await apiClient.get<ProjetosPorMes[]>('/api/dashboard/projetos-por-mes');
    return response.data;
  },

  // Alunos por turma
  getAlunosPorTurma: async (): Promise<AlunosPorTurma[]> => {
    const response = await apiClient.get<AlunosPorTurma[]>('/api/dashboard/alunos-por-turma');
    return response.data;
  },

  // Atividades recentes
  getAtividadesRecentes: async (): Promise<AtividadeRecente[]> => {
    const response = await apiClient.get<AtividadeRecente[]>('/api/dashboard/atividades-recentes');
    return response.data;
  },
};
