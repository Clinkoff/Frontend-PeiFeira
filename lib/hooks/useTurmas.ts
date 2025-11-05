import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { turmaApi } from '@/lib/api/turmaApi';
import type {
  CreateTurmaRequest,
  MatricularAlunoRequest,
  TransferirAlunoRequest,
  UpdateTurmaRequest,
} from '@/lib/types';

export const useTurmas = () => {
  const queryClient = useQueryClient();

  // Query: Listar todas
  const turmasQuery = useQuery({
    queryKey: ['turmas'],
    queryFn: turmaApi.getAll,
  });

  // Query: Buscar por ID
  const useTurmaById = (id: string) =>
    useQuery({
      queryKey: ['turma', id],
      queryFn: () => turmaApi.getById(id),
      enabled: !!id,
    });

  // Query: Listar alunos de uma turma
  const useAlunosTurma = (turmaId: string) =>
    useQuery({
      queryKey: ['turma-alunos', turmaId],
      queryFn: () => turmaApi.getAlunos(turmaId),
      enabled: !!turmaId,
    });

  // Query: Alunos disponíveis para matrícula
  const useAlunosDisponiveis = (turmaId: string) =>
    useQuery({
      queryKey: ['turma-alunos-disponiveis', turmaId],
      queryFn: () => turmaApi.getAlunosDisponiveis(turmaId),
      enabled: !!turmaId,
    });

  // Query: Histórico de matrículas do aluno
  const useHistoricoAluno = (perfilAlunoId: string) =>
    useQuery({
      queryKey: ['aluno-historico', perfilAlunoId],
      queryFn: () => turmaApi.getHistoricoAluno(perfilAlunoId),
      enabled: !!perfilAlunoId,
    });

  // Mutation: Criar
  const createMutation = useMutation({
    mutationFn: (data: CreateTurmaRequest) => turmaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });

  // Mutation: Atualizar
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTurmaRequest }) =>
      turmaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });

  // Mutation: Deletar
  const deleteMutation = useMutation({
    mutationFn: (id: string) => turmaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });

  const matricularMutation = useMutation({
    mutationFn: (data: MatricularAlunoRequest) => turmaApi.matricularAluno(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['turma-alunos', variables.turmaId] });
      queryClient.invalidateQueries({ queryKey: ['turma-alunos-disponiveis', variables.turmaId] });
    },
  });

  // Mutation: Remover aluno
  const removerAlunoMutation = useMutation({
    mutationFn: ({ turmaId, perfilAlunoId }: { turmaId: string; perfilAlunoId: string }) =>
      turmaApi.removerAluno(turmaId, perfilAlunoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['turma-alunos', variables.turmaId] });
      queryClient.invalidateQueries({ queryKey: ['turma-alunos-disponiveis', variables.turmaId] });
    },
  });

  // Mutation: Transferir aluno
  const transferirMutation = useMutation({
    mutationFn: (data: TransferirAlunoRequest) => turmaApi.transferirAluno(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['turma-alunos'] });
      queryClient.invalidateQueries({ queryKey: ['turma-alunos-disponiveis'] });
      queryClient.invalidateQueries({ queryKey: ['aluno-historico', variables.usuarioId] });
    },
  });
  return {
    // Queries
    turmas: turmasQuery.data || [],
    isLoading: turmasQuery.isLoading,
    error: turmasQuery.error,
    useTurmaById,
    useAlunosTurma,
    useAlunosDisponiveis,
    useHistoricoAluno,
    // Mutations
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    matricularAluno: matricularMutation.mutateAsync,
    removerAluno: removerAlunoMutation.mutateAsync,
    transferirAluno: transferirMutation.mutateAsync,

    // Status
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isMatriculando: matricularMutation.isPending,
    isRemovendo: removerAlunoMutation.isPending,
    isTransferindo: transferirMutation.isPending,
  };
};
