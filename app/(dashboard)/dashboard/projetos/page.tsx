'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, Building2, GraduationCap } from 'lucide-react';
import { useProjetos } from '@/lib/hooks/useProjeto';
import {
  StatusProjetoLabels,
  StatusProjetoColors,
  parseProjetoStatus, // Importe a nova função
} from '@/lib/types/projetos.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function ProjetosPage() {
  const { projetos, isLoading, delete: deleteProjeto, isDeleting } = useProjetos();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [tipoFilter, setTipoFilter] = useState<string>('Todos');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projetoToDelete, setProjetoToDelete] = useState<string | null>(null);

  // ✅ CORREÇÃO: Normaliza os dados assim que chegam
  // Isso converte "EmAndamento" ou "1" (string) para 1 (number)
  const normalizedProjetos = useMemo(() => {
    return projetos.map((projeto) => ({
      ...projeto,
      status: parseProjetoStatus(projeto.status),
    }));
  }, [projetos]);

  // Filtros usando a lista normalizada
  const filteredProjetos = normalizedProjetos.filter((projeto) => {
    const matchesSearch =
      projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.nomeEquipe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.nomeDisciplinaPI?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' || projeto.status === Number(statusFilter);

    const matchesTipo =
      tipoFilter === 'Todos' ||
      (tipoFilter === 'empresa' && projeto.nomeEmpresa) ||
      (tipoFilter === 'academico' && !projeto.nomeEmpresa);

    return matchesSearch && matchesStatus && matchesTipo;
  });

  const handleDeleteClick = (id: string) => {
    setProjetoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (projetoToDelete) {
      try {
        await deleteProjeto(projetoToDelete);
        setDeleteDialogOpen(false);
        setProjetoToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir projeto:', error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
            Projetos
          </h1>
          <p className="text-gray-600 dark:text-muted-foreground">
            Gerencie os projetos integradores
          </p>
        </div>
        <Link href="/dashboard/projetos/novo">
          <Button className="gap-2">
            <Plus className="h-4! w-4!" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar por título, equipe ou disciplina..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os status</SelectItem>
            <SelectItem value="1">Em Andamento</SelectItem>
            <SelectItem value="2">Concluído</SelectItem>
            <SelectItem value="3">Cancelado</SelectItem>
            <SelectItem value="4">Aprovado</SelectItem>
            <SelectItem value="5">Reprovado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os tipos</SelectItem>
            <SelectItem value="empresa">Com Empresa</SelectItem>
            <SelectItem value="academico">Acadêmico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-4">
          <p className="text-sm text-gray-600 dark:text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
            {normalizedProjetos.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-4">
          <p className="text-sm text-gray-600 dark:text-muted-foreground">Em Andamento</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
            {normalizedProjetos.filter((p) => p.status === 1).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-4">
          <p className="text-sm text-gray-600 dark:text-muted-foreground">Com Empresa</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
            {normalizedProjetos.filter((p) => p.nomeEmpresa).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-4">
          <p className="text-sm text-gray-600 dark:text-muted-foreground">Concluídos</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
            {normalizedProjetos.filter((p) => p.status === 2).length}
          </p>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-border bg-gray-50 dark:bg-accent">
              <tr>
                <th className="px-4! py-3! text-left text-sm font-medium text-gray-900 dark:text-foreground">
                  Título
                </th>
                <th className="px-4! py-3! text-left text-sm font-medium text-gray-900 dark:text-foreground">
                  Equipe
                </th>
                <th className="px-4! py-3! text-left text-sm font-medium text-gray-900 dark:text-foreground">
                  Disciplina PI
                </th>
                <th className="px-4! py-3! text-left text-sm font-medium text-gray-900 dark:text-foreground">
                  Status
                </th>
                <th className="px-4! py-3! text-left text-sm font-medium text-gray-900 dark:text-foreground">
                  Tipo
                </th>
                <th className="px-4! py-3! text-left text-sm font-medium text-gray-900 dark:text-foreground">
                  Membros
                </th>
                <th className="px-4! py-3! text-right text-sm font-medium text-gray-900 dark:text-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-border">
              {filteredProjetos.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4! py-8! text-center text-sm text-gray-600 dark:text-muted-foreground"
                  >
                    Nenhum projeto encontrado
                  </td>
                </tr>
              ) : (
                filteredProjetos.map((projeto) => (
                  <tr
                    key={projeto.id}
                    className="hover:bg-gray-50 dark:hover:bg-accent transition-colors"
                  >
                    <td className="px-4! py-3!">
                      <div className="font-medium text-gray-900 dark:text-foreground">
                        {projeto.titulo}
                      </div>
                      {projeto.nomeEmpresa && (
                        <div className="text-xs text-gray-600 dark:text-muted-foreground mt-1">
                          {projeto.nomeEmpresa}
                        </div>
                      )}
                    </td>
                    <td className="px-4! py-3! text-sm text-gray-700 dark:text-foreground">
                      {projeto.nomeEquipe}
                    </td>
                    <td className="px-4! py-3! text-sm text-gray-700 dark:text-foreground">
                      {projeto.nomeDisciplinaPI}
                    </td>
                    <td className="px-4! py-3!">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5! py-0.5! text-xs font-medium ${StatusProjetoColors[projeto.status]}`}
                      >
                        {StatusProjetoLabels[projeto.status]}
                      </span>
                    </td>
                    <td className="px-4! py-3!">
                      {projeto.nomeEmpresa ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-muted-foreground">
                          <Building2 className="h-3.5! w-3.5!" />
                          <span>Empresa</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-muted-foreground">
                          <GraduationCap className="h-3.5! w-3.5!" />
                          <span>Acadêmico</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4! py-3! text-sm text-gray-700 dark:text-foreground">
                      {projeto.quantidadeMembros || 0}
                    </td>
                    <td className="px-4! py-3!">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/projetos/${projeto.id}`}>
                          <Button variant="ghost" size="icon" title="Ver detalhes">
                            <Eye className="h-4! w-4!" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/projetos/${projeto.id}/editar`}>
                          <Button variant="ghost" size="icon" title="Editar">
                            <Pencil className="h-4! w-4!" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(projeto.id)}
                          disabled={isDeleting}
                          title="Excluir"
                          className="hover:text-red-600"
                        >
                          <Trash2 className="h-4! w-4!" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Projeto"
        description="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}
