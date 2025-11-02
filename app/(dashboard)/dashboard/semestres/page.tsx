'use client';

import { useState } from 'react';
import { useSemestres } from '@/lib/hooks/useSemestres';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Calendar, Eye } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useRouter } from 'next/navigation';
import type { Semestre } from '@/lib/types';

export default function SemestresPage() {
  const router = useRouter();
  const { semestres, isLoading, delete: deleteSemestre, isDeleting } = useSemestres();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [semestreToDelete, setSemestreToDelete] = useState<Semestre | null>(null);

  const handleDeleteClick = (semestre: Semestre) => {
    setSemestreToDelete(semestre);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (semestreToDelete) {
      try {
        await deleteSemestre(semestreToDelete.id);
        setDeleteDialogOpen(false);
        setSemestreToDelete(null);
      } catch (error) {
        console.error('Erro ao deletar semestre:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Semestres</h1>
          <p className="text-gray-600 dark:text-muted-foreground mt-2">
            Gerenciar semestres acadêmicos
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/semestres/novo')} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Semestre
        </Button>
      </div>

      {/* Lista de Semestres */}
      {semestres.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-muted-foreground text-center">
              Nenhum semestre cadastrado ainda.
              <br />
              Clique em "Novo Semestre" para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {semestres.map((semestre) => (
            <Card key={semestre.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-foreground">
                      {semestre.nome}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground mt-1">
                      {semestre.ano} - {semestre.periodo}º Semestre
                    </p>
                  </div>
                  <Badge variant={semestre.isActive ? 'default' : 'secondary'}>
                    {semestre.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-muted-foreground">Início:</span>
                    <span className="font-medium text-gray-900 dark:text-foreground">
                      {formatDate(semestre.dataInicio)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-muted-foreground">Fim:</span>
                    <span className="font-medium text-gray-900 dark:text-foreground">
                      {formatDate(semestre.dataFim)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/semestres/${semestre.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/semestres/${semestre.id}/editar`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClick(semestre)}>
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
        title="Excluir Semestre"
        description={`Tem certeza que deseja excluir o semestre "${semestreToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        confirmText="Excluir"
      />
    </div>
  );
}
