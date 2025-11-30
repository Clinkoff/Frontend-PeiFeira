// app/(dashboard)/convites/page.tsx
'use client';

import { useState } from 'react';
import { Mail, Send, Inbox } from 'lucide-react';
import { useConvites } from '@/lib/hooks/useConvites';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { ConviteCard } from '@/components/features/convites/ConviteCard';

export default function ConvitesPage() {
  const { user } = useAuth();
  const { convitesPendentes, isLoadingPendentes } = useConvites();
  const [activeTab, setActiveTab] = useState<'recebidos' | 'enviados'>('recebidos');

  // Filtrar convites recebidos e enviados
  const convitesRecebidos = convitesPendentes.filter(
    (c) => c.convidadoId === user?.perfilAluno?.id
  );

  const convitesEnviados = convitesPendentes.filter(
    (c) => c.convidadoPorId === user?.perfilAluno?.id
  );

  const convitesAtivos = activeTab === 'recebidos' ? convitesRecebidos : convitesEnviados;

  if (isLoadingPendentes) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Meus Convites</h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Gerencie seus convites de equipes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b dark:border-gray-700">
        <button
          onClick={() => setActiveTab('recebidos')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
            activeTab === 'recebidos'
              ? 'text-[#6F73D2] dark:text-[#5A5FB8]'
              : 'text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Recebidos
          {convitesRecebidos.length > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-[#6F73D2] text-white">
              {convitesRecebidos.length}
            </span>
          )}
          {activeTab === 'recebidos' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F73D2] dark:bg-[#5A5FB8]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('enviados')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
            activeTab === 'enviados'
              ? 'text-[#6F73D2] dark:text-[#5A5FB8]'
              : 'text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
          }`}
        >
          <Send className="w-4 h-4" />
          Enviados
          {convitesEnviados.length > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-500 text-white">
              {convitesEnviados.length}
            </span>
          )}
          {activeTab === 'enviados' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F73D2] dark:bg-[#5A5FB8]" />
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Inbox className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                  Convites Recebidos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {convitesRecebidos.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Send className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                  Convites Enviados
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {convitesEnviados.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Total Pendentes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {convitesPendentes.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Convites */}
      {convitesAtivos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {activeTab === 'recebidos' ? (
              <>
                <Inbox className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-muted-foreground text-center">
                  Você não tem convites recebidos pendentes.
                </p>
              </>
            ) : (
              <>
                <Send className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-muted-foreground text-center">
                  Você não enviou nenhum convite pendente.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {convitesAtivos.map((convite) => (
            <ConviteCard 
              key={convite.id} 
              convite={convite} 
              tipo={activeTab === 'recebidos' ? 'recebido' : 'enviado'} 
            />
          ))}
        </div>
      )}
    </div>
  );
}