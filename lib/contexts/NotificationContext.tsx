'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useConvites } from '@/lib/hooks/useConvites';
import type { Notificacao, TipoNotificacao } from '@/lib/types';

interface NotificationContextData {
  notificacoes: Notificacao[];
  naoLidas: number;
  adicionarNotificacao: (notificacao: Omit<Notificacao, 'id' | 'criadoEm' | 'lida'>) => void;
  marcarComoLida: (id: string) => void;
  marcarTodasComoLidas: () => void;
  limparNotificacoes: () => void;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { countPendentes } = useConvites();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [ultimoCount, setUltimoCount] = useState(0);

  // Carregar notificações
  useEffect(() => {
    if (!user?.id) return;
    const stored = localStorage.getItem(`notificacoes_${user.id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotificacoes(parsed.map((n: any) => ({ ...n, criadoEm: new Date(n.criadoEm) })));
      } catch (error) {
        console.error(error);
      }
    }
  }, [user?.id]);

  // Salvar notificações
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`notificacoes_${user.id}`, JSON.stringify(notificacoes));
    }
  }, [notificacoes, user?.id]);

  // Detectar novos convites
  useEffect(() => {
    if (countPendentes > ultimoCount && ultimoCount >= 0) {
      const diferenca = countPendentes - ultimoCount;
      // Evita notificação no primeiro load se já tiver convites
      if (ultimoCount !== 0 || countPendentes !== diferenca) {
        adicionarNotificacao({
          tipo: 'ConviteRecebido' as TipoNotificacao,
          titulo: 'Novo convite recebido!',
          mensagem: `Você tem ${diferenca} novo(s) convite(s) de equipe.`,
        });
        playNotificationSound();
      }
    }
    setUltimoCount(countPendentes);
  }, [countPendentes]);

  const adicionarNotificacao = useCallback(
    (notificacao: Omit<Notificacao, 'id' | 'criadoEm' | 'lida'>) => {
      const nova: Notificacao = {
        ...notificacao,
        id: `notif_${Date.now()}_${Math.random()}`,
        criadoEm: new Date(),
        lida: false,
      };
      setNotificacoes((prev) => [nova, ...prev].slice(0, 50));
    },
    []
  );

  const marcarComoLida = useCallback((id: string) => {
    setNotificacoes((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  }, []);

  const marcarTodasComoLidas = useCallback(() => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  }, []);

  const limparNotificacoes = useCallback(() => {
    setNotificacoes([]);
    if (user?.id) localStorage.removeItem(`notificacoes_${user.id}`);
  }, [user?.id]);

  return (
    <NotificationContext.Provider
      value={{
        notificacoes,
        naoLidas: notificacoes.filter((n) => !n.lida).length,
        adicionarNotificacao,
        marcarComoLida,
        marcarTodasComoLidas,
        limparNotificacoes,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}

function playNotificationSound() {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {}
}
