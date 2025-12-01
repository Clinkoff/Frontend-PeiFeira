import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { authApi } from '@/lib/api/authApi';
import type { LoginRequest } from '@/lib/types/auth.types';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(data);

      // Validação silenciosa de segurança
      if (response.usuario.role === 'Aluno' && !response.usuario.perfilAluno) {
        console.warn('Aviso: Aluno sem perfil detectado.');
      }

      setAuth(response.usuario, response.token);

      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      router.replace('/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.replace('/login');
    },
  });

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
};
