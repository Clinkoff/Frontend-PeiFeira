'use client';

import { useRouter } from 'next/navigation';
import { useDisciplinasPI } from '@/lib/hooks/useDisciplinasPI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Pencil,
  Trash2,
  ArrowLeft,
  BookOpen,
  Calendar,
  Users,
  User,
  Target,
  FileText,
  School,
  BookOpenText,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useState, use } from 'react';
import {
  StatusProjetoIntegradorLabels,
  StatusProjetoIntegradorColors,
} from '@/lib/types/disciplinaPI.types';

export default function DetalheDisciplinaPIPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { useDisciplinaPIById, delete: deleteDisciplina, isDeleting } = useDisciplinasPI();
  const { data: disciplina, isLoading, error } = useDisciplinaPIById(resolvedParams.id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteDisciplina(resolvedParams.id);
      router.push('/dashboard/disciplinas-pi');
    } catch (error) {
      console.error('Erro ao deletar disciplina:', error);
      alert('Erro ao deletar disciplina. Tente novamente.');
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

  if (error || !disciplina) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Erro</h1>
          <p className="text-red-600 mt-2">Disciplina não encontrada.</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard/disciplinas-pi')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para disciplinas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/dashboard/disciplinas-pi')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <BookOpenText />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
                {disciplina.nome}
              </h1>
              <Badge
                className={`${StatusProjetoIntegradorColors[disciplina.status]} text-xs px-2 py-0.5`}
              >
                {StatusProjetoIntegradorLabels[disciplina.status]}
              </Badge>
            </div>

            <p className="text-gray-600 dark:text-muted-foreground mt-1">{disciplina.temaGeral}</p>
          </div>
        </div>

        <div className="flex gap-2 self-start">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/disciplinas-pi/${disciplina.id}/editar`)}
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Turmas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {disciplina.turmas?.length || 0}
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
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Projetos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {disciplina.projetos?.length || 0}
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
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Início</p>
                <p className="text-lg font-bold text-gray-900 dark:text-foreground">
                  {new Date(disciplina.dataInicio).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Término</p>
                <p className="text-lg font-bold text-gray-900 dark:text-foreground">
                  {new Date(disciplina.dataFim).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Principais */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <BookOpen className="w-5 h-5" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <School className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">Semestre</p>
                  <p className="font-medium text-gray-900 dark:text-foreground">
                    {disciplina.semestre?.nome} ({disciplina.semestre?.ano}.
                    {disciplina.semestre?.periodo})
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">
                    Professor Responsável
                  </p>
                  <p className="font-medium text-gray-900 dark:text-foreground">
                    {disciplina.professor?.nome}
                  </p>
                  {disciplina.professor?.email && (
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                      {disciplina.professor.email}
                    </p>
                  )}
                  {disciplina.professor?.departamento && (
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">
                      {disciplina.professor.departamento}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">Tema Geral</p>
                  <p className="font-medium text-gray-900 dark:text-foreground">
                    {disciplina.temaGeral}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Descrição e Objetivos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <FileText className="w-5 h-5" />
              Descrição e Objetivos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {disciplina.descricao && (
              <div>
                <p className="text-xs text-gray-600 dark:text-muted-foreground mb-1">Descrição</p>
                <p className="text-sm text-gray-900 dark:text-foreground whitespace-pre-wrap">
                  {disciplina.descricao}
                </p>
              </div>
            )}

            {disciplina.objetivos && (
              <>
                {disciplina.descricao && <Separator />}
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground mb-1">Objetivos</p>
                  <p className="text-sm text-gray-900 dark:text-foreground whitespace-pre-wrap">
                    {disciplina.objetivos}
                  </p>
                </div>
              </>
            )}

            {!disciplina.descricao && !disciplina.objetivos && (
              <p className="text-gray-600 dark:text-muted-foreground text-center py-4">
                Nenhuma descrição ou objetivo cadastrado
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Turmas Associadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
            <Users className="w-5 h-5" />
            Turmas Associadas ({disciplina.turmas?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!disciplina.turmas || disciplina.turmas.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <p>Nenhuma turma associada a esta disciplina ainda.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {disciplina.turmas.map((turma) => (
                <div
                  key={turma.id}
                  className="flex items-center gap-3 p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/turmas/${turma.id}`)}
                >
                  <div className="w-10 h-10 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center">
                    <School className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-foreground truncate">
                      {turma.nome}
                    </p>
                    {turma.curso && (
                      <p className="text-sm text-gray-600 dark:text-muted-foreground truncate">
                        {turma.curso}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projetos */}
      {disciplina.projetos && disciplina.projetos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <FileText className="w-5 h-5" />
              Projetos ({disciplina.projetos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {disciplina.projetos.map((projeto) => (
                <div
                  key={projeto.id}
                  className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-foreground">
                        {projeto.titulo}
                      </p>
                      {projeto.nomeEquipe && (
                        <p className="text-sm text-gray-600 dark:text-muted-foreground">
                          Equipe: {projeto.nomeEquipe}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/projetos/${projeto.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Disciplina"
        description={`Tem certeza que deseja excluir a disciplina "${disciplina.nome}"? Esta ação não pode ser desfeita e removerá todas as associações com turmas e projetos.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmText="Excluir"
      />
    </div>
  );
}
