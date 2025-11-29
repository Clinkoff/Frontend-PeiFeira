// lib/hooks/useEquipes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equipeApi } from '@/lib/api/equipeApi';
import { membroEquipeApi } from '@/lib/api/membroEquipeApi';
import type {
  CreateEquipeRequest,
  UpdateEquipeRequest,
  AddMembroEquipeRequest,
} from '@/lib/types/equipes.types';

export const useEquipes = () => {
  const queryClient = useQueryClient();

  // Query: Listar todas
  const equipesQuery = useQuery({
    queryKey: ['equipes'],
    queryFn: equipeApi.getAll,
  });

  // Query: Buscar por ID com detalhes
  const useEquipeById = (id: string) =>
    useQuery({
      queryKey: ['equipe', id],
      queryFn: () => equipeApi.getByIdWithDetails(id),
      enabled: !!id,
    });

  // Query: Listar membros por equipe
  const useMembrosPorEquipe = (equipeId: string) =>
    useQuery({
      queryKey: ['membros-equipe', equipeId],
      queryFn: () => membroEquipeApi.getByEquipe(equipeId),
      enabled: !!equipeId,
    });

  // Mutation: Criar
  const createMutation = useMutation({
    mutationFn: (data: CreateEquipeRequest) => equipeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipes'] });
    },
  });

  // Mutation: Atualizar
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEquipeRequest }) =>
      equipeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipes'] });
    },
  });

  // Mutation: Deletar
  const deleteMutation = useMutation({
    mutationFn: (id: string) => equipeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipes'] });
    },
  });

  // Mutation: Regenerar código de convite
  const regenerarCodigoMutation = useMutation({
    mutationFn: (id: string) => equipeApi.regenerarCodigoConvite(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['equipe', id] });
      queryClient.invalidateQueries({ queryKey: ['equipes'] });
    },
  });

  // Mutation: Adicionar membro
  const addMembroMutation = useMutation({
    mutationFn: (data: AddMembroEquipeRequest) => membroEquipeApi.add(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipe', variables.equipeId] });
      queryClient.invalidateQueries({ queryKey: ['membros-equipe', variables.equipeId] });
      queryClient.invalidateQueries({ queryKey: ['equipes'] });
    },
  });

  // Mutation: Remover membro
  const removeMembroMutation = useMutation({
    mutationFn: ({ equipeId, perfilAlunoId }: { equipeId: string; perfilAlunoId: string }) =>
      membroEquipeApi.remove(equipeId, perfilAlunoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipe', variables.equipeId] });
      queryClient.invalidateQueries({ queryKey: ['membros-equipe', variables.equipeId] });
      queryClient.invalidateQueries({ queryKey: ['equipes'] });
    },
  });

  return {
    // Queries
    equipes: equipesQuery.data || [],
    isLoading: equipesQuery.isLoading,
    error: equipesQuery.error,
    useEquipeById,
    useMembrosPorEquipe,

    // Mutations
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    regenerarCodigoConvite: regenerarCodigoMutation.mutateAsync,
    addMembro: addMembroMutation.mutateAsync,
    removeMembro: removeMembroMutation.mutateAsync,

    // Status
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRegenerandoCodigo: regenerarCodigoMutation.isPending,
    isAddingMembro: addMembroMutation.isPending,
    isRemovingMembro: removeMembroMutation.isPending,
  };
};
