'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Check, Trash2, ExternalLink, Inbox } from 'lucide-react';
import { useNotifications } from '@/lib/contexts/NotificationContext';
import { useConvites } from '@/lib/hooks/useConvites'; // <--- IMPORTANTE
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function NotificationPanel() {
  const {
    notificacoes,
    naoLidas: naoLidasLocais, // Renomeia para evitar conflito
    marcarComoLida,
    marcarTodasComoLidas,
    limparNotificacoes,
  } = useNotifications();

  // Pegamos a contagem real da API
  const { countPendentes } = useConvites();

  const [open, setOpen] = useState(false);

  // Calcula o total real para a bolinha vermelha
  // Se quiser que a bolinha conte APENAS convites, use countPendentes.
  // Se quiser somar com outras notificações do sistema, use a soma.
  // Como sua prioridade são os convites, vamos garantir que countPendentes apareça.
  const totalNaoLidas = countPendentes > 0 ? countPendentes : naoLidasLocais;

  // Lógica para injetar um item de "Convite Pendente" na lista se tiver contagem > 0 mas não tiver na lista
  // Isso é um truque visual para garantir que o usuário veja algo na lista
  const conviteFalso =
    countPendentes > 0
      ? [
          {
            id: 'convite-sistema',
            tipo: 'ConviteRecebido',
            titulo: 'Você tem convites pendentes',
            mensagem: `Você possui ${countPendentes} convite(s) de equipe aguardando resposta.`,
            criadoEm: new Date().toISOString(), // Data atual
            lida: false,
          },
        ]
      : [];

  // Junta as notificações reais com o aviso de convite (evitando duplicatas se a lógica do Context já tiver adicionado)
  const temConviteNaLista = notificacoes.some((n) => n.tipo === 'ConviteRecebido' && !n.lida);

  const listaParaExibir = temConviteNaLista
    ? notificacoes.slice(0, 10)
    : [...conviteFalso, ...notificacoes].slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'relative')}
      >
        <Bell className="h-5 w-5" />

        {/* Usa o totalNaoLidas calculado acima */}
        {totalNaoLidas > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
            {totalNaoLidas > 9 ? '9+' : totalNaoLidas}
          </span>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[600px] flex flex-col p-0">
        <DialogHeader className="px-4 py-3 border-b dark:border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Notificações</DialogTitle>
              {totalNaoLidas > 0 && (
                <p className="text-xs text-gray-600 dark:text-muted-foreground mt-1">
                  {totalNaoLidas} não lida{totalNaoLidas > 1 ? 's' : ''}
                </p>
              )}
            </div>
            {/* ... Botões de limpar (mantém igual) ... */}
            <div className="flex gap-2">
              {notificacoes.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limparNotificacoes}
                  className="text-xs h-8"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto max-h-[450px]">
          {listaParaExibir.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Bell className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-muted-foreground">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y dark:divide-border">
              {listaParaExibir.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-accent transition-colors ${
                    !notif.lida ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  {/* ... Resto do card da notificação igual ... */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6F73D2] flex items-center justify-center">
                      <span className="text-white text-sm">
                        <Inbox />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-foreground">
                        {notif.titulo}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-muted-foreground mt-1">
                        {notif.mensagem}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {/* Tratamento para data falsa ou real */}
                        {formatDistanceToNow(new Date(notif.criadoEm), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>

                  {(notif.tipo === 'ConviteRecebido' || notif.id === 'convite-sistema') && (
                    <Link
                      href="/convites" // Redireciona para a página de convites
                      onClick={() => {
                        if (notif.id !== 'convite-sistema') marcarComoLida(notif.id);
                        setOpen(false);
                      }}
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-card px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-accent transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver convites
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
