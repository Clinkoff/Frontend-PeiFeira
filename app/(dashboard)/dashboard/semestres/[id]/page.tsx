'use client';

import { useRouter } from 'next/navigation';
import { useSemestres } from '@/lib/hooks/useSemestres';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Pencil,
  Trash2,
  ArrowLeft,
  Users,
  BookOpen,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useState, use } from 'react';

export default function DetalheSemestrePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { useSemestreById, delete: deleteSemestre, isDeleting } = useSemestres();
  const { data: semestre, isLoading, error } = useSemestreById(resolvedParams.id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteSemestre(resolvedParams.id);
      router.push('/dashboard/semestres');
    } catch (error) {
      console.error('Erro ao deletar semestre:', error);
      alert('Erro ao deletar semestre. Tente novamente.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const calcularDuracao = () => {
    if (!semestre) return '';
    const inicio = new Date(semestre.dataInicio);
    const fim = new Date(semestre.dataFim);
    const dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    const semanas = Math.floor(dias / 7);
    return `${dias} dias (${semanas} semanas)`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !semestre) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Erro</h1>
          <p className="text-red-600 mt-2">Semestre não encontrado.</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard/semestres')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para semestres
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/semestres')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
                {semestre.nome}
              </h1>
              <Badge variant={semestre.isActive ? 'default' : 'secondary'}>
                {semestre.isActive ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Ativo
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Inativo
                  </>
                )}
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-muted-foreground mt-1">
              {semestre.ano} - {semestre.periodo}º Semestre
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/semestres/${semestre.id}/editar`)}
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

      {/* Informações Principais */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card de Informações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <Calendar className="w-5 h-5" />
              Informações do Semestre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-muted-foreground">
                  Data de Início
                </span>
                <span className="font-medium text-gray-900 dark:text-foreground">
                  {formatDate(semestre.dataInicio)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-muted-foreground">
                  Data de Término
                </span>
                <span className="font-medium text-gray-900 dark:text-foreground">
                  {formatDate(semestre.dataFim)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-muted-foreground">Duração</span>
                <span className="font-medium text-gray-900 dark:text-foreground">
                  {calcularDuracao()}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-muted-foreground">Status</span>
                <Badge variant={semestre.isActive ? 'default' : 'secondary'}>
                  {semestre.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <BookOpen className="w-5 h-5" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">Turmas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-foreground">0</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">Projetos</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-foreground">0</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Turmas Vinculadas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-foreground">Turmas Vinculadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600 dark:text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p>Nenhuma turma vinculada a este semestre ainda.</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Semestre"
        description={`Tem certeza que deseja excluir o semestre "${semestre.nome}"? Esta ação não pode ser desfeita e removerá todas as turmas e projetos vinculados.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmText="Excluir"
      />
    </div>
  );
}
