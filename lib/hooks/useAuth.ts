import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api/authApi';
import type { LoginRequest } from '@/lib/types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuth(data.usuario, data.token);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
  });

  // Query para buscar usuário atual (validar sessão)
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated && !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    user: currentUser || user,
    token,
    isAuthenticated,
    isLoadingUser,

    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
};
