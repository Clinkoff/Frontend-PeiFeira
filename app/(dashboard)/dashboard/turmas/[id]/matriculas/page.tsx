// app/(dashboard)/turmas/[id]/matriculas/page.tsx
'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTurmas } from '@/lib/hooks/useTurmas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserPlus, Search, Users, Trash2, ArrowRightLeft, Calendar } from 'lucide-react';
import { AdicionarAlunoDialog } from '@/components/features/turmas/AdicionarAlunoDialog';
import { TransferirAlunoDialog } from '@/components/features/turmas/TransferirAlunoDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { AlunoTurma } from '@/lib/types';
import type { MatricularAlunoRequest } from '@/lib/types';

export default function GerenciarMatriculasPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const {
    useTurmaById,
    useAlunosTurma,
    matricularAluno,
    removerAluno,
    transferirAluno,
    isMatriculando,
    isRemovendo,
    isTransferindo,
  } = useTurmas();

  const { data: turma, isLoading: isLoadingTurma } = useTurmaById(resolvedParams.id);
  const { data: alunos = [], isLoading: isLoadingAlunos } = useAlunosTurma(resolvedParams.id);

  const [searchTerm, setSearchTerm] = useState('');
  const [adicionarDialogOpen, setAdicionarDialogOpen] = useState(false);
  const [transferirDialogOpen, setTransferirDialogOpen] = useState(false);
  const [removerDialogOpen, setRemoverDialogOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<AlunoTurma | null>(null);

  // Filtrar apenas alunos atuais
  const alunosAtuais = alunos.filter((a) => a.isAtual);

  // Filtrar por busca
  const alunosFiltrados = alunosAtuais.filter(
    (alunoTurma) =>
      alunoTurma.aluno?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alunoTurma.aluno?.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alunoTurma.aluno?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMatricular = async (usuarioId: string) => {
    await matricularAluno({
      usuarioId,
      turmaId: resolvedParams.id,
    });
  };

  const handleRemover = async () => {
    if (!selectedAluno) return;
    await removerAluno({
      turmaId: resolvedParams.id,
      perfilAlunoId: selectedAluno.perfilAlunoId,
    });
    setRemoverDialogOpen(false);
    setSelectedAluno(null);
  };

  const handleTransferir = async (novaTurmaId: string) => {
    if (!selectedAluno) return;
    await transferirAluno({
      usuarioId: selectedAluno.perfilAlunoId,
      novaTurmaId,
    });
    setTransferirDialogOpen(false);
    setSelectedAluno(null);
  };

  if (isLoadingTurma) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (!turma) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/dashboard/turmas/${resolvedParams.id}`)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
              Gerenciar Matrículas
            </h1>
            <p className="text-gray-600 dark:text-muted-foreground mt-1">
              {turma.nome} ({turma.codigo})
            </p>
          </div>
        </div>

        <Button onClick={() => setAdicionarDialogOpen(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Adicionar Aluno
        </Button>
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
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                  Matrículas Ativas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {alunosAtuais.filter((a) => a.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Histórico Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {alunos.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar aluno por nome, matrícula ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alunos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
            <Users className="w-5 h-5" />
            Alunos Matriculados ({alunosFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAlunos ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          ) : alunosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-gray-600 dark:text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <p>
                {searchTerm
                  ? 'Nenhum aluno encontrado com esse termo.'
                  : 'Nenhum aluno matriculado ainda.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alunosFiltrados.map((alunoTurma) => (
                <div
                  key={alunoTurma.id}
                  className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
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
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          Matrícula em{' '}
                          {new Date(alunoTurma.dataMatricula).toLocaleDateString('pt-BR')}
                        </Badge>
                        {alunoTurma.isActive && (
                          <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Ativo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAluno(alunoTurma);
                        setTransferirDialogOpen(true);
                      }}
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-1" />
                      Transferir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAluno(alunoTurma);
                        setRemoverDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AdicionarAlunoDialog
        open={adicionarDialogOpen}
        onOpenChange={setAdicionarDialogOpen}
        turmaId={resolvedParams.id}
        alunosMatriculados={alunosAtuais.map((a) => a.perfilAlunoId)}
        onMatricular={handleMatricular}
        isLoading={isMatriculando}
      />

      <TransferirAlunoDialog
        open={transferirDialogOpen}
        onOpenChange={setTransferirDialogOpen}
        alunoTurma={selectedAluno}
        turmaAtualId={resolvedParams.id}
        onTransferir={handleTransferir}
        isLoading={isTransferindo}
      />

      <ConfirmDialog
        open={removerDialogOpen}
        onOpenChange={setRemoverDialogOpen}
        title="Remover Aluno da Turma"
        description={`Tem certeza que deseja remover ${selectedAluno?.aluno?.nome} desta turma? Esta ação moverá a matrícula para o histórico.`}
        onConfirm={handleRemover}
        isLoading={isRemovendo}
        confirmText="Remover"
      />
    </div>
  );
}
