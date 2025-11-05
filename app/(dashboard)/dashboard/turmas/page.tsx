'use client';

import { useState } from 'react';
import { useTurmas } from '@/lib/hooks/useTurmas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Eye, Search, School, Users } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useRouter } from 'next/navigation';
import type { Turma } from '@/lib/types';

export default function TurmasPage() {
  const router = useRouter();
  const { turmas, isLoading, delete: deleteTurma, isDeleting } = useTurmas();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [turmaToDelete, setTurmaToDelete] = useState<Turma | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteClick = (turma: Turma) => {
    setTurmaToDelete(turma);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (turmaToDelete) {
      try {
        await deleteTurma(turmaToDelete.id);
        setDeleteDialogOpen(false);
        setTurmaToDelete(null);
      } catch (error) {
        console.error('Erro ao deletar turma:', error);
      }
    }
  };

  const filteredTurmas = turmas.filter(
    (turma) =>
      turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.curso?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Turmas</h1>
          <p className="text-gray-600 dark:text-muted-foreground mt-2">
            Gerenciar turmas acadêmicas
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/turmas/novo')} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Turma
        </Button>
      </div>

      {/* Barra de Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome, código ou curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Turmas */}
      {filteredTurmas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <School className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-muted-foreground text-center">
              {searchTerm
                ? 'Nenhuma turma encontrada com esse termo de busca.'
                : 'Nenhuma turma cadastrada ainda.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTurmas.map((turma) => (
            <Card key={turma.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center">
                      <School className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-foreground">
                        {turma.nome}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        {turma.codigo}
                      </p>
                    </div>
                  </div>
                  <Badge variant={turma.isActive ? 'default' : 'secondary'}>
                    {turma.isActive ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  {turma.curso && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-muted-foreground">📚 Curso:</span>
                      <span className="font-medium text-gray-900 dark:text-foreground">
                        {turma.curso}
                      </span>
                    </div>
                  )}

                  {turma.periodo && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-muted-foreground">📖 Período:</span>
                      <span className="font-medium text-gray-900 dark:text-foreground">
                        {turma.periodo}º
                      </span>
                    </div>
                  )}

                  {turma.turno && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-muted-foreground">🕐 Turno:</span>
                      <span className="font-medium text-gray-900 dark:text-foreground">
                        {turma.turno}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/turmas/${turma.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/turmas/${turma.id}/editar`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClick(turma)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Turma"
        description={`Tem certeza que deseja excluir a turma "${turmaToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        confirmText="Excluir"
      />
    </div>
  );
}
