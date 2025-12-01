'use client';

import { useEffect } from 'react';
import { Inbox, X } from 'lucide-react';
import { useNotifications } from '@/lib/contexts/NotificationContext';
import { Button } from '@/components/ui/button';

export function NotificationToast() {
  const { notificacoes, marcarComoLida } = useNotifications();

  const recentNotifications = notificacoes
    .filter((n) => !n.lida)
    .filter((n) => {
      const diff = Date.now() - new Date(n.criadoEm).getTime();
      return diff < 10000;
    })
    .slice(0, 3);

  useEffect(() => {
    recentNotifications.forEach((notif) => {
      const timer = setTimeout(() => {
        marcarComoLida(notif.id);
      }, 8000);

      return () => clearTimeout(timer);
    });
  }, [recentNotifications.length, marcarComoLida]);

  if (recentNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
      {recentNotifications.map((notif) => (
        <div
          key={notif.id}
          className="animate-in slide-in-from-right-full bg-white dark:bg-card border dark:border-border rounded-lg shadow-lg p-4 flex items-start gap-3"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#6F73D2] flex items-center justify-center">
            <span className="text-white text-xl">
              <Inbox />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-foreground">{notif.titulo}</p>
            <p className="text-sm text-gray-600 dark:text-muted-foreground mt-1">
              {notif.mensagem}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-6 w-6"
            onClick={() => marcarComoLida(notif.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
