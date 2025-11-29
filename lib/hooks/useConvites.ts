// lib/hooks/useConvites.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conviteApi } from '@/lib/api/conviteApi';
import { useAuth } from '@/lib/hooks/useAuth';
import type { CreateConviteEquipeRequest } from '@/lib/types';

export const useConvites = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Pegar perfilAlunoId do usuário logado
  const perfilAlunoId = user?.perfilAluno?.id;

  // Query: Convites pendentes do usuário logado
  const convitesPendentesQuery = useQuery({
    queryKey: ['convites-pendentes', perfilAlunoId],
    queryFn: () => conviteApi.getConvitesPendentes(perfilAlunoId!),
    enabled: !!perfilAlunoId,
    refetchInterval: 30000, // Refetch a cada 30s
  });

  // Query: Convites por equipe
  const useConvitesPorEquipe = (equipeId: string) =>
    useQuery({
      queryKey: ['convites-equipe', equipeId],
      queryFn: () => conviteApi.getConvitesPorEquipe(equipeId),
      enabled: !!equipeId,
    });

  // Query: Convite por ID
  const useConviteById = (id: string) =>
    useQuery({
      queryKey: ['convite', id],
      queryFn: () => conviteApi.getById(id),
      enabled: !!id,
    });

  // Mutation: Criar convite
  const createMutation = useMutation({
    mutationFn: (data: CreateConviteEquipeRequest) => conviteApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites-equipe'] });
    },
  });

  // Mutation: Aceitar convite
  const aceitarMutation = useMutation({
    mutationFn: (id: string) => conviteApi.aceitar(id, perfilAlunoId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['equipe'] });
      queryClient.invalidateQueries({ queryKey: ['equipes'] });
      queryClient.invalidateQueries({ queryKey: ['membros-equipe'] });
    },
  });

  // Mutation: Recusar convite
  const recusarMutation = useMutation({
    mutationFn: (id: string) => conviteApi.recusar(id, perfilAlunoId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['convites-equipe'] });
    },
  });

  // Mutation: Cancelar convite
  const cancelarMutation = useMutation({
    mutationFn: (id: string) => conviteApi.cancelar(id, perfilAlunoId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites-equipe'] });
    },
  });

  return {
    // Queries
    convitesPendentes: convitesPendentesQuery.data || [],
    isLoadingPendentes: convitesPendentesQuery.isLoading,
    countPendentes: convitesPendentesQuery.data?.length || 0,

    useConvitesPorEquipe,
    useConviteById,

    // Mutations
    create: createMutation.mutateAsync,
    aceitar: aceitarMutation.mutateAsync,
    recusar: recusarMutation.mutateAsync,
    cancelar: cancelarMutation.mutateAsync,

    // Status
    isCreating: createMutation.isPending,
    isAceitando: aceitarMutation.isPending,
    isRecusando: recusarMutation.isPending,
    isCancelando: cancelarMutation.isPending,
  };
};
