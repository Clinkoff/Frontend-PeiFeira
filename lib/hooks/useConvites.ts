import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conviteApi } from '@/lib/api/conviteApi';
import { useAuth } from '@/lib/hooks/useAuth';
import type { CreateConviteEquipeRequest } from '@/lib/types';

export const useConvites = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const perfilAlunoId = user?.perfilAluno?.id;

  // Query: Convites pendentes (Lista completa)
  const convitesPendentesQuery = useQuery({
    queryKey: ['convites-pendentes', perfilAlunoId],
    queryFn: () => conviteApi.getConvitesPendentes(perfilAlunoId!),
    enabled: !!perfilAlunoId,
    refetchInterval: 30000,
  });

  // Query: Apenas contagem (Otimizada para notificação)
  const countPendentesQuery = useQuery({
    queryKey: ['convites-count', perfilAlunoId],
    queryFn: async () => {
      const convites = await conviteApi.getConvitesPendentes(perfilAlunoId!);
      return convites.length;
    },
    enabled: !!perfilAlunoId,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const useConvitesPorEquipe = (equipeId: string) =>
    useQuery({
      queryKey: ['convites-equipe', equipeId],
      queryFn: () => conviteApi.getConvitesPorEquipe(equipeId),
      enabled: !!equipeId,
    });

  const createMutation = useMutation({
    mutationFn: (data: CreateConviteEquipeRequest) => conviteApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites-equipe'] });
    },
  });

  const aceitarMutation = useMutation({
    mutationFn: (id: string) => conviteApi.aceitar(id, perfilAlunoId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['convites-count'] });
      queryClient.invalidateQueries({ queryKey: ['equipe'] });
    },
  });

  const recusarMutation = useMutation({
    mutationFn: (id: string) => conviteApi.recusar(id, perfilAlunoId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['convites-count'] });
    },
  });

  const cancelarMutation = useMutation({
    mutationFn: (id: string) => conviteApi.cancelar(id, perfilAlunoId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites-equipe'] });
    },
  });

  return {
    convitesPendentes: convitesPendentesQuery.data || [],
    isLoadingPendentes: convitesPendentesQuery.isLoading,
    countPendentes: countPendentesQuery.data || 0,
    isLoadingCount: countPendentesQuery.isLoading,

    useConvitesPorEquipe,

    create: createMutation.mutateAsync,
    aceitar: aceitarMutation.mutateAsync,
    recusar: recusarMutation.mutateAsync,
    cancelar: cancelarMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isAceitando: aceitarMutation.isPending,
    isRecusando: recusarMutation.isPending,
    isCancelando: cancelarMutation.isPending,
  };
};
