'use client';

import { useRouter } from 'next/navigation';
import { useEquipes } from '@/lib/hooks/useEquipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Pencil,
  Trash2,
  ArrowLeft,
  Users,
  Crown,
  Code,
  QrCode,
  UserPlus,
  RefreshCw,
  Calendar,
  FileText,
  UserMinus,
  Send,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { AdicionarMembroDialog } from '@/components/features/equipes/AdicionarMembroDialog';
import { EnviarConviteDialog } from '@/components/features/convites/EnviarConviteDialog';
import { useState, use } from 'react';

export default function DetalheEquipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const {
    useEquipeById,
    delete: deleteEquipe,
    isDeleting,
    regenerarCodigoConvite,
    isRegenerandoCodigo,
    addMembro,
    isAddingMembro,
    removeMembro,
    isRemovingMembro,
  } = useEquipes();
  const { data: equipe, isLoading, error } = useEquipeById(resolvedParams.id);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMembroDialogOpen, setDeleteMembroDialogOpen] = useState(false);
  const [adicionarMembroDialogOpen, setAdicionarMembroDialogOpen] = useState(false);
  const [enviarConviteDialogOpen, setEnviarConviteDialogOpen] = useState(false);
  const [regenerarCodigoDialogOpen, setRegenerarCodigoDialogOpen] = useState(false);
  const [selectedMembro, setSelectedMembro] = useState<any>(null);

  const handleDelete = async () => {
    try {
      await deleteEquipe(resolvedParams.id);
      router.push('/dashboard/equipes');
    } catch (error) {
      console.error('Erro ao deletar equipe:', error);
      alert('Erro ao deletar equipe. Tente novamente.');
    }
  };

  const handleRegenerarCodigo = async () => {
    try {
      await regenerarCodigoConvite(resolvedParams.id);
      setRegenerarCodigoDialogOpen(false);
    } catch (error) {
      console.error('Erro ao regenerar código:', error);
      alert('Erro ao regenerar código de convite. Tente novamente.');
    }
  };

  const handleAdicionarMembro = async (perfilAlunoId: string) => {
    try {
      await addMembro({
        equipeId: resolvedParams.id,
        perfilAlunoId,
      });
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      alert('Erro ao adicionar membro. Tente novamente.');
    }
  };

  const handleRemoverMembro = async () => {
    if (!selectedMembro) return;

    try {
      await removeMembro({
        equipeId: resolvedParams.id,
        perfilAlunoId: selectedMembro.perfilAlunoId,
      });
      setDeleteMembroDialogOpen(false);
      setSelectedMembro(null);
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      alert('Erro ao remover membro. Tente novamente.');
    }
  };

  const handleCopiarCodigo = () => {
    if (equipe?.codigoConvite) {
      navigator.clipboard.writeText(equipe.codigoConvite);
      alert('Código copiado para a área de transferência!');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !equipe) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Erro</h1>
          <p className="text-red-600 mt-2">Equipe não encontrada.</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard/equipes')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para equipes
        </Button>
      </div>
    );
  }

  // Pegar IDs dos membros atuais (incluindo líder)
  const membrosAtuaisIds = [
    equipe.liderPerfilAlunoId,
    ...(equipe.membros?.map((m: any) => m.perfilAlunoId) || []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/equipes')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">👥</span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
                {equipe.nome}
              </h1>
              <Badge variant={equipe.isActive ? 'default' : 'secondary'}>
                {equipe.isActive ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
            {equipe.lider && (
              <p className="text-gray-600 dark:text-muted-foreground mt-1 flex items-center gap-1">
                <Crown className="w-4 h-4 text-yellow-600" />
                Líder: {equipe.lider.nome}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/equipes/${equipe.id}/editar`)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Total de Membros</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {equipe.quantidadeMembros}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Projeto</p>
                <p className="text-lg font-bold text-gray-900 dark:text-foreground">
                  {equipe.temProjeto ? 'Vinculado' : 'Sem projeto'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Criada em</p>
                <p className="text-sm font-bold text-gray-900 dark:text-foreground">
                  {equipe.criadoEm ? new Date(equipe.criadoEm).toLocaleDateString('pt-BR') : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações da Equipe e Código de Convite */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <Users className="w-5 h-5" />
              Informações da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">Líder</p>
                  <p className="font-medium text-gray-900 dark:text-foreground">
                    {equipe.lider?.nome}
                  </p>
                  {equipe.lider?.email && (
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                      {equipe.lider.email}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">
                    Total de Membros
                  </p>
                  <p className="font-medium text-gray-900 dark:text-foreground">
                    {equipe.quantidadeMembros}
                  </p>
                </div>
              </div>

              {equipe.projeto && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-muted-foreground">Projeto</p>
                      <p className="font-medium text-gray-900 dark:text-foreground">
                        {equipe.projeto.titulo}
                      </p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {equipe.projeto.status}
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Código de Convite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <Code className="w-5 h-5" />
              Código de Convite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipe.codigoConvite ? (
              <>
                <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 dark:text-muted-foreground mb-2">
                      Código da Equipe
                    </p>
                    <div className="text-4xl font-bold font-mono text-[#6F73D2] dark:text-[#5A5FB8]">
                      {equipe.codigoConvite}
                    </div>
                  </div>
                </div>

                {equipe.urlQrCode && (
                  <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700">
                    <img src={equipe.urlQrCode} alt="QR Code" className="w-32 h-32" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleCopiarCodigo}
                  >
                    <Code className="w-4 h-4 mr-1" />
                    Copiar Código
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setRegenerarCodigoDialogOpen(true)}
                    disabled={isRegenerandoCodigo}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Regenerar
                  </Button>
                </div>

                <p className="text-xs text-gray-600 dark:text-muted-foreground text-center">
                  Compartilhe este código para que outros alunos possam ingressar na equipe
                </p>
              </>
            ) : (
              <div className="text-center py-8 text-gray-600 dark:text-muted-foreground">
                <QrCode className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <p>Código de convite não disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Membros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <Users className="w-5 h-5" />
              Membros ({equipe.membros?.length || 0})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEnviarConviteDialogOpen(true)}
              >
                <Send className="w-4 h-4 mr-1" />
                Enviar Convite
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdicionarMembroDialogOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Adicionar Membro
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!equipe.membros || equipe.membros.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <p>Nenhum membro além do líder ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {equipe.membros.map((membro: any) => (
                <div
                  key={membro.email}
                  className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center">
                      <span className="text-white font-bold">
                        {membro.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-foreground">
                        {membro.nome}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        {membro.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Entrou em {new Date(membro.dataEntrada).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMembro(membro);
                      setDeleteMembroDialogOpen(true);
                    }}
                  >
                    <UserMinus className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Equipe"
        description={`Tem certeza que deseja excluir a equipe "${equipe.nome}"? Esta ação não pode ser desfeita e removerá todos os membros associados.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmText="Excluir"
      />

      <ConfirmDialog
        open={regenerarCodigoDialogOpen}
        onOpenChange={setRegenerarCodigoDialogOpen}
        title="Regenerar Código de Convite"
        description="Tem certeza que deseja gerar um novo código? O código anterior não funcionará mais e você precisará compartilhar o novo código com os membros."
        onConfirm={handleRegenerarCodigo}
        isLoading={isRegenerandoCodigo}
        confirmText="Regenerar"
      />

      <ConfirmDialog
        open={deleteMembroDialogOpen}
        onOpenChange={setDeleteMembroDialogOpen}
        title="Remover Membro"
        description={`Tem certeza que deseja remover ${selectedMembro?.nome} da equipe?`}
        onConfirm={handleRemoverMembro}
        isLoading={isRemovingMembro}
        confirmText="Remover"
      />

      <AdicionarMembroDialog
        open={adicionarMembroDialogOpen}
        onOpenChange={setAdicionarMembroDialogOpen}
        equipeId={resolvedParams.id}
        membrosAtuais={membrosAtuaisIds}
        onAdicionar={handleAdicionarMembro}
        isLoading={isAddingMembro}
      />

      <EnviarConviteDialog
        open={enviarConviteDialogOpen}
        onOpenChange={setEnviarConviteDialogOpen}
        equipeId={resolvedParams.id}
        liderPerfilAlunoId={equipe.liderPerfilAlunoId}
        membrosAtuais={membrosAtuaisIds}
      />
    </div>
  );
}