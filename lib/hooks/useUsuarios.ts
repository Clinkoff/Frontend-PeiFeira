// lib/hooks/useUsuarios.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioApi } from '@/lib/api/usuarioApi';
import type { CreateUsuarioRequest, UpdateUsuarioRequest } from '@/lib/types/usuario.types';

export const useUsuarios = () => {
  const queryClient = useQueryClient();

  // Query: Listar todos
  const usuariosQuery = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuarioApi.getAll,
  });

  // Query: Buscar por ID
  const useUsuarioById = (id: string) =>
    useQuery({
      queryKey: ['usuario', id],
      queryFn: () => usuarioApi.getById(id),
      enabled: !!id,
    });

  // Query: Listar apenas professores
  const professoresQuery = useQuery({
    queryKey: ['professores'],
    queryFn: usuarioApi.getProfessores,
  });

  // Query: Listar apenas alunos
  const alunosQuery = useQuery({
    queryKey: ['alunos'],
    queryFn: usuarioApi.getAlunos,
  });

  // Mutation: Criar
  const createMutation = useMutation({
    mutationFn: (data: CreateUsuarioRequest) => usuarioApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
    },
  });

  // Mutation: Atualizar
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioRequest }) =>
      usuarioApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
    },
  });

  // Mutation: Deletar
  const deleteMutation = useMutation({
    mutationFn: (id: string) => usuarioApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
    },
  });

  return {
    // Queries
    usuarios: usuariosQuery.data || [],
    isLoading: usuariosQuery.isLoading,
    error: usuariosQuery.error,
    useUsuarioById,

    // Professores
    professores: professoresQuery.data || [],
    isLoadingProfessores: professoresQuery.isLoading,

    // Alunos
    alunos: alunosQuery.data || [],
    isLoadingAlunos: alunosQuery.isLoading,

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
