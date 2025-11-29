// lib/hooks/useProjetos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projetoApi } from '@/lib/api/projetoApi';
import type { CreateProjetoRequest, UpdateProjetoRequest } from '@/lib/types/projetos.types';

export const useProjetos = () => {
  const queryClient = useQueryClient();

  // Query: Listar todos
  const projetosQuery = useQuery({
    queryKey: ['projetos'],
    queryFn: projetoApi.getAll,
  });

  // Query: Listar apenas ativos
  const projetosAtivosQuery = useQuery({
    queryKey: ['projetos', 'ativos'],
    queryFn: projetoApi.getActive,
  });

  // Query: Buscar por ID (simples)
  const useProjetoById = (id: string) =>
    useQuery({
      queryKey: ['projeto', id],
      queryFn: () => projetoApi.getById(id),
      enabled: !!id,
    });

  // Query: Buscar por ID com detalhes
  const useProjetoByIdWithDetails = (id: string) =>
    useQuery({
      queryKey: ['projeto', id, 'detalhes'],
      queryFn: () => projetoApi.getByIdWithDetails(id),
      enabled: !!id,
    });

  // Query: Buscar por equipe
  const useProjetoByEquipeId = (equipeId: string) =>
    useQuery({
      queryKey: ['projeto', 'equipe', equipeId],
      queryFn: () => projetoApi.getByEquipeId(equipeId),
      enabled: !!equipeId,
    });

  // Query: Buscar por disciplina PI
  const useProjetosByDisciplinaPIId = (disciplinaPIId: string) =>
    useQuery({
      queryKey: ['projetos', 'disciplina', disciplinaPIId],
      queryFn: () => projetoApi.getByDisciplinaPIId(disciplinaPIId),
      enabled: !!disciplinaPIId,
    });

  // Query: Projetos com empresa
  const projetosComEmpresaQuery = useQuery({
    queryKey: ['projetos', 'com-empresa'],
    queryFn: projetoApi.getProjetosComEmpresa,
  });

  // Query: Projetos acadêmicos
  const projetosAcademicosQuery = useQuery({
    queryKey: ['projetos', 'academicos'],
    queryFn: projetoApi.getProjetosAcademicos,
  });

  // Mutation: Criar
  const createMutation = useMutation({
    mutationFn: (data: CreateProjetoRequest) => projetoApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
    },
  });

  // Mutation: Atualizar
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjetoRequest }) =>
      projetoApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      queryClient.invalidateQueries({ queryKey: ['projeto'] });
    },
  });

  // Mutation: Deletar
  const deleteMutation = useMutation({
    mutationFn: (id: string) => projetoApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
    },
  });

  return {
    // Queries
    projetos: projetosQuery.data || [],
    isLoading: projetosQuery.isLoading,
    error: projetosQuery.error,

    projetosAtivos: projetosAtivosQuery.data || [],
    isLoadingAtivos: projetosAtivosQuery.isLoading,

    projetosComEmpresa: projetosComEmpresaQuery.data || [],
    isLoadingComEmpresa: projetosComEmpresaQuery.isLoading,

    projetosAcademicos: projetosAcademicosQuery.data || [],
    isLoadingAcademicos: projetosAcademicosQuery.isLoading,

    // Query hooks individuais
    useProjetoById,
    useProjetoByIdWithDetails,
    useProjetoByEquipeId,
    useProjetosByDisciplinaPIId,

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
