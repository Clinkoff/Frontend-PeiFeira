'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTurmas } from '@/lib/hooks/useTurmas';
import type { Usuario } from '@/lib/types/usuario.types';

interface AdicionarAlunoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turmaId: string;
  alunosMatriculados: string[]; // IDs dos alunos já matriculados
  onMatricular: (usuarioId: string) => Promise<void>; // ⚠️ agora envia Usuario.Id
  isLoading?: boolean;
}

export function AdicionarAlunoDialog({
  open,
  onOpenChange,
  turmaId,
  alunosMatriculados,
  onMatricular,
  isLoading,
}: AdicionarAlunoDialogProps) {
  const { useAlunosDisponiveis } = useTurmas();
  const { data: alunosDisponiveis = [], isLoading: isLoadingAlunos } =
    useAlunosDisponiveis(turmaId);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAluno, setSelectedAluno] = useState<Usuario | null>(null);

  const alunosFiltrados = alunosDisponiveis.filter((aluno) => {
    const termo = searchTerm.toLowerCase();
    return (
      aluno.nome?.toLowerCase().includes(termo) ||
      aluno.matricula?.toLowerCase().includes(termo) ||
      aluno.email?.toLowerCase().includes(termo)
    );
  });

  const handleMatricular = async () => {
    if (!selectedAluno?.id) {
      console.error('ERRO: Usuário selecionado não possui ID!');
      console.log('Aluno selecionado:', selectedAluno);
      return;
    }

    try {
      console.log('Matriculando aluno (Usuario.Id):', selectedAluno.id);
      await onMatricular(selectedAluno.id);
      setSelectedAluno(null);
      setSearchTerm('');
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao matricular aluno:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Adicionar Aluno à Turma
          </DialogTitle>
          <DialogDescription>
            Busque e selecione um aluno para matricular na turma.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Campo de busca */}
          <div className="space-y-2">
            <Label>Buscar Aluno</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Nome, matrícula ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de alunos */}
          <div className="flex-1 overflow-y-auto border dark:border-gray-700 rounded-lg">
            {isLoadingAlunos ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <p>Carregando alunos disponíveis...</p>
              </div>
            ) : alunosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-600 dark:text-muted-foreground">
                <UserPlus className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-600" />
                <p className="text-center">
                  {searchTerm
                    ? 'Nenhum aluno encontrado com esse termo.'
                    : 'Todos os alunos já estão matriculados nesta turma.'}
                </p>
              </div>
            ) : (
              <div className="divide-y dark:divide-gray-700">
                {alunosFiltrados.map((aluno) => (
                  <button
                    key={aluno.id}
                    onClick={() => {
                      console.log('Aluno selecionado:', aluno);
                      setSelectedAluno(aluno);
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      selectedAluno?.id === aluno.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center">
                          <span className="text-white font-bold">
                            {aluno.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-foreground">
                            {aluno.nome}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-muted-foreground">
                            {aluno.matricula} • {aluno.email}
                          </p>
                          {aluno.perfilAluno && (
                            <div className="flex gap-2 mt-1">
                              {aluno.perfilAluno.curso && (
                                <Badge variant="secondary" className="text-xs">
                                  {aluno.perfilAluno.curso}
                                </Badge>
                              )}
                              {aluno.perfilAluno.turno && (
                                <Badge variant="secondary" className="text-xs">
                                  {aluno.perfilAluno.turno}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedAluno?.id === aluno.id && (
                        <div className="text-blue-600 dark:text-blue-400">✓</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleMatricular} disabled={!selectedAluno || isLoading}>
            {isLoading ? 'Matriculando...' : 'Matricular Aluno'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
