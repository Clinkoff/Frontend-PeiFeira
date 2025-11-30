'use client';

import { useState } from 'react';
import { Check, X, Trash2, Users, Mail, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useConvites } from '@/lib/hooks/useConvites';
import { StatusConviteLabels, StatusConviteColors } from '@/lib/types';
import type { ConviteEquipeResponse } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface ConviteCardProps {
  convite: ConviteEquipeResponse;
  tipo: 'recebido' | 'enviado';
}

export function ConviteCard({ convite, tipo }: ConviteCardProps) {
  const { aceitar, recusar, cancelar, isAceitando, isRecusando, isCancelando } = useConvites();
  const [aceitarDialogOpen, setAceitarDialogOpen] = useState(false);
  const [recusarDialogOpen, setRecusarDialogOpen] = useState(false);
  const [cancelarDialogOpen, setCancelarDialogOpen] = useState(false);

  const handleAceitar = async () => {
    try {
      await aceitar(convite.id);
      setAceitarDialogOpen(false);
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      alert('Erro ao aceitar convite. Tente novamente.');
    }
  };

  const handleRecusar = async () => {
    try {
      await recusar(convite.id);
      setRecusarDialogOpen(false);
    } catch (error) {
      console.error('Erro ao recusar convite:', error);
      alert('Erro ao recusar convite. Tente novamente.');
    }
  };

  const handleCancelar = async () => {
    try {
      await cancelar(convite.id);
      setCancelarDialogOpen(false);
    } catch (error) {
      console.error('Erro ao cancelar convite:', error);
      alert('Erro ao cancelar convite. Tente novamente.');
    }
  };

  const isPendente = convite.status === 'Pendente';
  const isRecebido = tipo === 'recebido';

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-foreground truncate">
                    {convite.nomeEquipe}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground">
                    {isRecebido ? (
                      <>
                        Convidado por: <span className="font-medium">{convite.nomeConvidadoPor}</span>
                      </>
                    ) : (
                      <>
                        Convidado: <span className="font-medium">{convite.nomeConvidado}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <Badge className={StatusConviteColors[convite.status]}>
                {StatusConviteLabels[convite.status]}
              </Badge>
            </div>

            {/* Mensagem */}
            {convite.mensagem && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-foreground">{convite.mensagem}</p>
                </div>
              </div>
            )}

            {/* Data */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Mail className="w-3 h-3" />
              {isPendente ? (
                <span>
                  Enviado em {new Date(convite.criadoEm).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(convite.criadoEm).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              ) : (
                <span>
                  Respondido em {new Date(convite.dataResposta!).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(convite.dataResposta!).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>

            {/* Ações */}
            {isPendente && (
              <div className="flex gap-2 pt-2">
                {isRecebido ? (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => setAceitarDialogOpen(true)}
                      disabled={isAceitando}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      {isAceitando ? 'Aceitando...' : 'Aceitar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setRecusarDialogOpen(true)}
                      disabled={isRecusando}
                    >
                      <X className="w-4 h-4 mr-1" />
                      {isRecusando ? 'Recusando...' : 'Recusar'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => setCancelarDialogOpen(true)}
                    disabled={isCancelando}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {isCancelando ? 'Cancelando...' : 'Cancelar Convite'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs de confirmação */}
      <ConfirmDialog
        open={aceitarDialogOpen}
        onOpenChange={setAceitarDialogOpen}
        title="Aceitar Convite"
        description={`Tem certeza que deseja aceitar o convite para participar da equipe "${convite.nomeEquipe}"? Você será adicionado automaticamente como membro.`}
        onConfirm={handleAceitar}
        isLoading={isAceitando}
        confirmText="Aceitar Convite"
      />

      <ConfirmDialog
        open={recusarDialogOpen}
        onOpenChange={setRecusarDialogOpen}
        title="Recusar Convite"
        description={`Tem certeza que deseja recusar o convite para participar da equipe "${convite.nomeEquipe}"?`}
        onConfirm={handleRecusar}
        isLoading={isRecusando}
        confirmText="Recusar Convite"
      />

      <ConfirmDialog
        open={cancelarDialogOpen}
        onOpenChange={setCancelarDialogOpen}
        title="Cancelar Convite"
        description={`Tem certeza que deseja cancelar o convite enviado para ${convite.nomeConvidado}?`}
        onConfirm={handleCancelar}
        isLoading={isCancelando}
        confirmText="Cancelar Convite"
      />
    </>
  );
}