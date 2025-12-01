// app/(dashboard)/turmas/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useTurmas } from '@/lib/hooks/useTurmas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Pencil,
  Trash2,
  ArrowLeft,
  School,
  Calendar,
  Hash,
  BookOpen,
  Users,
  Clock,
  GraduationCap,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useState, use } from 'react';

export default function DetalheTurmaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { useTurmaById, useAlunosTurma, delete: deleteTurma, isDeleting } = useTurmas();
  const { data: turma, isLoading, error } = useTurmaById(resolvedParams.id);
  const { data: alunos = [], isLoading: isLoadingAlunos } = useAlunosTurma(resolvedParams.id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTurma(resolvedParams.id);
      router.push('/dashboard/turmas');
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
      alert('Erro ao deletar turma. Tente novamente.');
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

  if (error || !turma) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Erro</h1>
          <p className="text-red-600 mt-2">Turma não encontrada.</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard/turmas')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para turmas
        </Button>
      </div>
    );
  }

  // Filtrar apenas alunos atuais
  const alunosAtuais = alunos.filter((a) => a.isAtual);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/turmas')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <GraduationCap />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
                {turma.nome}
              </h1>
              <Badge variant={turma.isActive ? 'default' : 'secondary'}>
                {turma.isActive ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-muted-foreground mt-1">{turma.codigo}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/turmas/${turma.id}/editar`)}
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
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Total de Alunos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {alunosAtuais.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Período</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {turma.periodo ? `${turma.periodo}º` : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Turno</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {turma.turno || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações da Turma */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <School className="w-5 h-5" />
              Informações da Turma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">Código</p>
                  <p className="font-medium text-gray-900 dark:text-foreground">{turma.codigo}</p>
                </div>
              </div>

              <Separator />

              {turma.curso && (
                <>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-muted-foreground">Curso</p>
                      <p className="font-medium text-gray-900 dark:text-foreground">
                        {turma.curso}
                      </p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {turma.periodo && (
                <>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-muted-foreground">Período</p>
                      <p className="font-medium text-gray-900 dark:text-foreground">
                        {turma.periodo}º Período
                      </p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {turma.turno && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">Turno</p>
                    <p className="font-medium text-gray-900 dark:text-foreground">{turma.turno}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <Calendar className="w-5 h-5" />
              Semestre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {turma.semestre ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">Nome</p>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {turma.semestre.nome}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">Ano/Período</p>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {turma.semestre.ano}.{turma.semestre.periodo}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-muted-foreground">
                Informações do semestre não disponíveis
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alunos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <Users className="w-5 h-5" />
              Alunos Matriculados ({alunosAtuais.length})
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/turmas/${turma.id}/matriculas`)}
            >
              Gerenciar Matrículas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingAlunos ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          ) : alunosAtuais.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <p>Nenhum aluno matriculado nesta turma ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alunosAtuais.map((alunoTurma) => (
                <div
                  key={alunoTurma.id}
                  className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center">
                      <span className="text-white font-bold">
                        {alunoTurma.aluno?.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-foreground">
                        {alunoTurma.aluno?.nome}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        {alunoTurma.aluno?.matricula} • {alunoTurma.aluno?.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">Matrícula em</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-foreground">
                      {new Date(alunoTurma.dataMatricula).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Turma"
        description={`Tem certeza que deseja excluir a turma "${turma.nome}"? Esta ação não pode ser desfeita e removerá todas as matrículas associadas.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmText="Excluir"
      />
    </div>
  );
}
