// app/(dashboard)/registro/page.tsx
'use client';

import { useState } from 'react';
import { useUsuarios } from '@/lib/hooks/useUsuarios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Eye, Search, Users, Mail } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useRouter } from 'next/navigation';
import type { Usuario } from '@/lib/types/usuario.types';

export default function RegistrosPage() {
  const router = useRouter();
  const { usuarios, isLoading, delete: deleteUsuario, isDeleting } = useUsuarios();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteClick = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (usuarioToDelete) {
      try {
        await deleteUsuario(usuarioToDelete.id);
        setDeleteDialogOpen(false);
        setUsuarioToDelete(null);
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
      }
    }
  };

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.matricula.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
            Gerenciar Usuários
          </h1>
          <p className="text-gray-600 dark:text-muted-foreground mt-2">
            Cadastro de usuários do sistema PeiFeira
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/registro/novo')} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Barra de Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome, email ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-muted-foreground">Total</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-foreground">
                {usuarios.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-muted-foreground">Alunos</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {usuarios.filter((u) => u.role === 'Aluno').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-muted-foreground">Professores</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {usuarios.filter((u) => u.role === 'Professor').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-muted-foreground">Admins</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {usuarios.filter((u) => u.role === 'Admin').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      {filteredUsuarios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-muted-foreground text-center">
              {searchTerm
                ? 'Nenhum usuário encontrado com esse termo de busca.'
                : 'Nenhum usuário cadastrado ainda.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsuarios.map((usuario) => (
            <Card key={usuario.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-foreground">
                        {usuario.nome}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        {usuario.matricula}
                      </p>
                    </div>
                  </div>
                  <Badge className={getRoleColor(usuario.role)}>{usuario.role}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="text-gray-600 dark:text-muted-foreground" />
                    <span className="text-gray-900 dark:text-foreground truncate">
                      {usuario.email}
                    </span>
                  </div>

                  {usuario.perfilAluno && (
                    <div className="pt-2 space-y-1 border-t dark:border-gray-700">
                      <p className="text-gray-600 dark:text-muted-foreground text-xs">
                        Curso: {usuario.perfilAluno.curso}
                      </p>
                      <p className="text-gray-600 dark:text-muted-foreground text-xs">
                        Turno: {usuario.perfilAluno.turno}
                      </p>
                    </div>
                  )}

                  {usuario.perfilProfessor && (
                    <div className="pt-2 space-y-1 border-t dark:border-gray-700">
                      <p className="text-gray-600 dark:text-muted-foreground text-xs">
                        Titulação: {usuario.perfilProfessor.titulacao}
                      </p>
                      <p className="text-gray-600 dark:text-muted-foreground text-xs">
                        Depto: {usuario.perfilProfessor.departamento}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/registro/${usuario.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/registro/${usuario.id}/editar`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClick(usuario)}>
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
        title="Excluir Usuário"
        description={`Tem certeza que deseja excluir o usuário "${usuarioToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        confirmText="Excluir"
      />
    </div>
  );
}
