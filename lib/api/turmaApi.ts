import { apiClient } from './client';
import type {
  Turma,
  TurmaWithDetails,
  CreateTurmaRequest,
  UpdateTurmaRequest,
  AlunoTurma,
  MatricularAlunoRequest,
  TransferirAlunoRequest,
} from '@/lib/types';

export const turmaApi = {
  // Listar todas
  getAll: async (): Promise<Turma[]> => {
    const response = await apiClient.get<Turma[]>('/api/turmas');
    return response.data;
  },

  // Buscar por ID
  getById: async (id: string): Promise<TurmaWithDetails> => {
    const response = await apiClient.get<TurmaWithDetails>(`/api/turmas/${id}`);
    return response.data;
  },

  // Listar apenas ativas
  getActive: async (): Promise<Turma[]> => {
    const response = await apiClient.get<Turma[]>('/api/turmas/ativos');
    return response.data;
  },

  // Listar por semestre
  getBySemestre: async (semestreId: string): Promise<Turma[]> => {
    const response = await apiClient.get<Turma[]>(`/api/turmas/semestre/${semestreId}`);
    return response.data;
  },

  // Listar por curso
  getByCurso: async (curso: string): Promise<Turma[]> => {
    const response = await apiClient.get<Turma[]>(`/api/turmas/curso/${curso}`);
    return response.data;
  },

  // Buscar por código
  getByCodigo: async (codigo: string): Promise<Turma> => {
    const response = await apiClient.get<Turma>(`/api/turmas/codigo/${codigo}`);
    return response.data;
  },

  // Criar
  create: async (data: CreateTurmaRequest): Promise<Turma> => {
    const response = await apiClient.post<Turma>('/api/turmas', data);
    return response.data;
  },

  // Atualizar
  update: async (id: string, data: UpdateTurmaRequest): Promise<Turma> => {
    const response = await apiClient.put<Turma>(`/api/turmas/${id}`, data);
    return response.data;
  },

  // Deletar
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/turmas/${id}`);
  },

  // Listar alunos de uma turma
  // ✅ Corrigido
  getAlunos: async (turmaId: string): Promise<AlunoTurma[]> => {
    const response = await apiClient.get(`/api/matriculas/turma/${turmaId}`);

    // Mapeia para o formato que o front espera
    return response.data.map((m: any) => ({
      id: m.id,
      perfilAlunoId: m.perfilAlunoId,
      turmaId: m.turmaId,
      dataMatricula: m.dataMatricula,
      isAtual: m.isAtual,
      isActive: m.isActive,
      aluno: {
        nome: m.nomeAluno,
        matricula: m.matriculaAluno,
        email: m.emailAluno || '',
      },
    }));
  },

  // Matricular aluno
  matricularAluno: async (data: MatricularAlunoRequest): Promise<AlunoTurma> => {
    const response = await apiClient.post<AlunoTurma>('/api/matriculas', data);
    return response.data;
  },

  // Transferir aluno
  transferirAluno: async (data: TransferirAlunoRequest): Promise<void> => {
    await apiClient.put('/api/matriculas/transferir', data);
  },

  getAlunosDisponiveis: async (turmaId: string): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/api/turmas/${turmaId}/alunos-disponiveis`);
    return response.data;
  },

  // Remover aluno da turma
  removerAluno: async (turmaId: string, perfilAlunoId: string): Promise<void> => {
    await apiClient.delete(`/api/matriculas`, {
      data: { turmaId, perfilAlunoId },
    });
  },

  // Buscar histórico de matrículas do aluno
  getHistoricoAluno: async (perfilAlunoId: string): Promise<AlunoTurma[]> => {
    const response = await apiClient.get<AlunoTurma[]>(
      `/api/matriculas/aluno/${perfilAlunoId}/historico`
    );
    return response.data;
  },
};
