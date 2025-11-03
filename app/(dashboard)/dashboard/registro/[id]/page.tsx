// app/(dashboard)/registro/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useUsuarios } from '@/lib/hooks/useUsuarios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Pencil,
  Trash2,
  ArrowLeft,
  Mail,
  Hash,
  BookOpen,
  GraduationCap,
  Building,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useState, use } from 'react';

export default function DetalheUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { useUsuarioById, delete: deleteUsuario, isDeleting } = useUsuarios();
  const { data: usuario, isLoading, error } = useUsuarioById(resolvedParams.id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteUsuario(resolvedParams.id);
      router.push('/dashboard/registro');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      alert('Erro ao deletar usuário. Tente novamente.');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Professor':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Aluno':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Coordenador':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Aluno':
        return '🎓';
      case 'Professor':
        return '👨‍🏫';
      case 'Admin':
        return '⚙️';
      case 'Coordenador':
        return '👨‍💼';
      default:
        return '👤';
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

  if (error || !usuario) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Erro</h1>
          <p className="text-red-600 mt-2">Usuário não encontrado.</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard/registro')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para usuários
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/registro')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getRoleIcon(usuario.role)}</span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
                {usuario.nome}
              </h1>
              <Badge className={getRoleColor(usuario.role)}>{usuario.role}</Badge>
            </div>
            <p className="text-gray-600 dark:text-muted-foreground mt-1">{usuario.matricula}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/registro/${usuario.id}/editar`)}
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
        {/* Card de Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
              <Mail className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">Matrícula</p>
                  <p className="font-medium text-gray-900 dark:text-foreground">
                    {usuario.matricula}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">Email</p>
                  <p className="font-medium text-gray-900 dark:text-foreground">{usuario.email}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <span className="text-2xl">{getRoleIcon(usuario.role)}</span>
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">Função</p>
                  <Badge className={getRoleColor(usuario.role)}>{usuario.role}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Informações Específicas */}
        {usuario.perfilAluno && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
                <GraduationCap className="w-5 h-5" />
                Informações Acadêmicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">Curso</p>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {usuario.perfilAluno.curso}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <span className="text-lg">🌅</span>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">Turno</p>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {usuario.perfilAluno.turno}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {usuario.perfilProfessor && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
                <GraduationCap className="w-5 h-5" />
                Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎓</span>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">Titulação</p>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {usuario.perfilProfessor.titulacao}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">
                      Área de Especialização
                    </p>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {usuario.perfilProfessor.areaEspecializacao}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">Departamento</p>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {usuario.perfilProfessor.departamento}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-foreground">Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600 dark:text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p>Nenhuma atividade registrada ainda.</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Usuário"
        description={`Tem certeza que deseja excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita e removerá todos os dados associados a este usuário.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmText="Excluir"
      />
    </div>
  );
}
