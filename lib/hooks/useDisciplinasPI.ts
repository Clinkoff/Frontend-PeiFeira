// lib/hooks/useDisciplinasPI.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { disciplinaPIApi } from '@/lib/api/disciplinaPiApi';
import type {
  CreateDisciplinaPIRequest,
  UpdateDisciplinaPIRequest,
} from '@/lib/types/disciplinaPi.types';

export const useDisciplinasPI = () => {
  const queryClient = useQueryClient();

  // Query: Listar todas
  const disciplinasQuery = useQuery({
    queryKey: ['disciplinasPI'],
    queryFn: disciplinaPIApi.getAll,
  });

  // Query: Buscar por ID com detalhes
  const useDisciplinaPIById = (id: string) =>
    useQuery({
      queryKey: ['disciplinaPI', id],
      queryFn: () => disciplinaPIApi.getByIdWithDetails(id),
      enabled: !!id,
    });

  // Query: Listar por turma
  const useDisciplinasPorTurma = (turmaId: string) =>
    useQuery({
      queryKey: ['disciplinasPI-turma', turmaId],
      queryFn: () => disciplinaPIApi.getByTurma(turmaId),
      enabled: !!turmaId,
    });

  // Query: Listar por semestre
  const useDisciplinasPorSemestre = (semestreId: string) =>
    useQuery({
      queryKey: ['disciplinasPI-semestre', semestreId],
      queryFn: () => disciplinaPIApi.getBySemestre(semestreId),
      enabled: !!semestreId,
    });

  // Mutation: Criar
  const createMutation = useMutation({
    mutationFn: (data: CreateDisciplinaPIRequest) => disciplinaPIApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplinasPI'] });
    },
  });

  // Mutation: Atualizar
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDisciplinaPIRequest }) =>
      disciplinaPIApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplinasPI'] });
    },
  });

  // Mutation: Deletar
  const deleteMutation = useMutation({
    mutationFn: (id: string) => disciplinaPIApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplinasPI'] });
    },
  });

  return {
    // Queries
    disciplinasPI: disciplinasQuery.data || [],
    isLoading: disciplinasQuery.isLoading,
    error: disciplinasQuery.error,
    useDisciplinaPIById,
    useDisciplinasPorTurma,
    useDisciplinasPorSemestre,

    // Mutations
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,

    // Status
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
