import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioApi } from '@/lib/api/usuarioApi';
import type { CreateUsuarioRequest, UpdateUsuarioRequest } from '@/lib/types/usuario.types';

export const useUsuarios = () => {
  const queryClient = useQueryClient();

  const usuariosQuery = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuarioApi.getAll,
  });

  const useUsuarioById = (id: string) =>
    useQuery({
      queryKey: ['usuario', id],
      queryFn: () => usuarioApi.getById(id),
      enabled: !!id,
    });

  const createMutation = useMutation({
    mutationFn: (data: CreateUsuarioRequest) => usuarioApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioRequest }) =>
      usuarioApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usuarioApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { senhaAntiga: string; novaSenha: string } }) =>
      usuarioApi.changePassword(id, data),
  });

  return {
    usuarios: usuariosQuery.data || [],
    isLoading: usuariosQuery.isLoading,
    error: usuariosQuery.error,
    useUsuarioById,

    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
