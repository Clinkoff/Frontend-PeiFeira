import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { semestreApi } from '@/lib/api/semestreApi';
import type { CreateSemestreRequest, UpdateSemestreRequest } from '@/lib/types';

export const useSemestres = () => {
  const queryClient = useQueryClient();

  const semestresQuery = useQuery({
    queryKey: ['semestres'],
    queryFn: semestreApi.getAll,
  });

  const useSemestreById = (id: string) =>
    useQuery({
      queryKey: ['semestre', id],
      queryFn: () => semestreApi.getById(id),
      enabled: !!id,
    });

  const createMutation = useMutation({
    mutationFn: (data: CreateSemestreRequest) => semestreApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semestres'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSemestreRequest }) =>
      semestreApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semestres'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => semestreApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semestres'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => semestreApi.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semestres'] });
    },
  });

  return {
    semestres: semestresQuery.data || [],
    isLoading: semestresQuery.isLoading,
    error: semestresQuery.error,
    useSemestreById,

    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    toggleActive: toggleActiveMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
