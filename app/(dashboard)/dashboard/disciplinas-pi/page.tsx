// app/(dashboard)/disciplinaspi/page.tsx
'use client';

import { useState } from 'react';
import { useDisciplinasPI } from '@/lib/hooks/useDisciplinasPI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Eye, Search, BookOpen, Calendar } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useRouter } from 'next/navigation';
import type { DisciplinaPIResponse } from '@/lib/types/disciplinaPI.types';
import {
  StatusProjetoIntegradorLabels,
  StatusProjetoIntegradorColors,
} from '@/lib/types/disciplinaPI.types';

export default function DisciplinasPIPage() {
  const router = useRouter();
  const { disciplinasPI, isLoading, delete: deleteDisciplina, isDeleting } = useDisciplinasPI();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [disciplinaToDelete, setDisciplinaToDelete] = useState<DisciplinaPIResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteClick = (disciplina: DisciplinaPIResponse) => {
    setDisciplinaToDelete(disciplina);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (disciplinaToDelete) {
      try {
        await deleteDisciplina(disciplinaToDelete.id);
        setDeleteDialogOpen(false);
        setDisciplinaToDelete(null);
      } catch (error) {
        console.error('Erro ao deletar disciplina:', error);
      }
    }
  };

  const filteredDisciplinas = disciplinasPI.filter(
    (disciplina) =>
      disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disciplina.temaGeral.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disciplina.nomeProfessor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Disciplinas PI</h1>
          <p className="text-gray-600 dark:text-muted-foreground mt-2">
            Gerenciar disciplinas de Projeto Integrador
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/disciplinas-pi/novo')} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Disciplina
        </Button>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome, tema ou professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Disciplinas */}
      {filteredDisciplinas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-muted-foreground text-center">
              {searchTerm
                ? 'Nenhuma disciplina encontrada com esse termo de busca.'
                : 'Nenhuma disciplina cadastrada ainda.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDisciplinas.map((disciplina) => (
            <Card key={disciplina.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg text-gray-900 dark:text-foreground truncate">
                        {disciplina.nome}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-muted-foreground truncate">
                        {disciplina.temaGeral}
                      </p>
                    </div>
                  </div>
                  <Badge className={StatusProjetoIntegradorColors[disciplina.status]}>
                    {StatusProjetoIntegradorLabels[disciplina.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  {disciplina.nomeProfessor && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-muted-foreground">
                        👨‍🏫 Professor:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-foreground truncate">
                        {disciplina.nomeProfessor}
                      </span>
                    </div>
                  )}

                  {disciplina.nomeSemestre && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-muted-foreground">📅 Semestre:</span>
                      <span className="font-medium text-gray-900 dark:text-foreground">
                        {disciplina.nomeSemestre}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-muted-foreground">🎓 Turmas:</span>
                    <span className="font-medium text-gray-900 dark:text-foreground">
                      {disciplina.quantidadeTurmas || 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-muted-foreground text-xs">
                      {new Date(disciplina.dataInicio).toLocaleDateString('pt-BR')} -{' '}
                      {new Date(disciplina.dataFim).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/disciplinaspi/${disciplina.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/disciplinaspi/${disciplina.id}/editar`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClick(disciplina)}>
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
        title="Excluir Disciplina"
        description={`Tem certeza que deseja excluir a disciplina "${disciplinaToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        confirmText="Excluir"
      />
    </div>
  );
}
