// app/(dashboard)/equipes/page.tsx
'use client';

import { useState } from 'react';
import { useEquipes } from '@/lib/hooks/useEquipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Eye, Search, Users, Crown, Code, User } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useRouter } from 'next/navigation';
import type { EquipeResponse } from '@/lib/types/equipes.types';

export default function EquipesPage() {
  const router = useRouter();
  const { equipes, isLoading, delete: deleteEquipe, isDeleting } = useEquipes();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [equipeToDelete, setEquipeToDelete] = useState<EquipeResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteClick = (equipe: EquipeResponse) => {
    setEquipeToDelete(equipe);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (equipeToDelete) {
      try {
        await deleteEquipe(equipeToDelete.id);
        setDeleteDialogOpen(false);
        setEquipeToDelete(null);
      } catch (error) {
        console.error('Erro ao deletar equipe:', error);
      }
    }
  };

  const filteredEquipes = equipes.filter(
    (equipe) =>
      equipe.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipe.nomeLider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipe.codigoConvite?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Equipes</h1>
          <p className="text-gray-600 dark:text-muted-foreground mt-2">
            Gerenciar equipes de projetos
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/equipes/novo')} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Equipe
        </Button>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome, líder ou código de convite..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Equipes */}
      {filteredEquipes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-muted-foreground text-center">
              {searchTerm
                ? 'Nenhuma equipe encontrada com esse termo de busca.'
                : 'Nenhuma equipe cadastrada ainda.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEquipes.map((equipe) => (
            <Card key={equipe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg text-gray-900 dark:text-foreground truncate">
                        {equipe.nome}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-muted-foreground flex items-center gap-1 truncate">
                        <Crown className="w-3 h-3" />
                        {equipe.nomeLider || 'Sem líder'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={equipe.isActive ? 'default' : 'secondary'}>
                    {equipe.isActive ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-muted-foreground flex items-center gap-1">
                      <User className="w-4 h-4" /> Membros:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-foreground">
                      {equipe.quantidadeMembros || 0}
                    </span>
                  </div>

                  {equipe.codigoConvite && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-muted-foreground flex items-center gap-1">
                        <Code className="w-3 h-3" />
                        Código:
                      </span>
                      <Badge variant="outline" className="font-mono">
                        {equipe.codigoConvite}
                      </Badge>
                    </div>
                  )}

                  {equipe.temProjeto && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                        ✓ Com Projeto
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/equipes/${equipe.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/equipes/${equipe.id}/editar`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClick(equipe)}>
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
        title="Excluir Equipe"
        description={`Tem certeza que deseja excluir a equipe "${equipeToDelete?.nome}"? Esta ação não pode ser desfeita e removerá todos os membros associados.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        confirmText="Excluir"
      />
    </div>
  );
}
