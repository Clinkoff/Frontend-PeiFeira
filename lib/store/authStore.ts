import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { Usuario } from '@/lib/types';

interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (user: Usuario, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<Usuario>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));

        Cookies.set('auth_token', token, { expires: 7 });

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        // Limpar localStorage e cookies
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        Cookies.remove('auth_token');

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'peifeira-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
