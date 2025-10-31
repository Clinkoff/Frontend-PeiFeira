import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');

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
      name: 'peifeira-auth', // Nome no localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
