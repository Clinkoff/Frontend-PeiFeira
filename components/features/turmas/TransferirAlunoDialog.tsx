'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { useTurmas } from '@/lib/hooks/useTurmas';
import type { AlunoTurma } from '@/lib/types';

interface TransferirAlunoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alunoTurma: AlunoTurma | null;
  turmaAtualId: string;
  onTransferir: (novaTurmaId: string) => Promise<void>;
  isLoading?: boolean;
}

export function TransferirAlunoDialog({
  open,
  onOpenChange,
  alunoTurma,
  turmaAtualId,
  onTransferir,
  isLoading,
}: TransferirAlunoDialogProps) {
  const { turmas } = useTurmas();
  const [novaTurmaId, setNovaTurmaId] = useState('');

  const turmasDisponiveis = turmas.filter((turma) => turma.id !== turmaAtualId && turma.isActive);

  const handleTransferir = async () => {
    if (!novaTurmaId) return;

    try {
      await onTransferir(novaTurmaId);
      setNovaTurmaId('');
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao transferir aluno:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Transferir Aluno para Outra Turma
          </DialogTitle>
          <DialogDescription>
            {alunoTurma?.aluno && `Transferir ${alunoTurma.aluno.nome} para outra turma.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {alunoTurma?.aluno && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm text-gray-600 dark:text-muted-foreground mb-1">
                Aluno selecionado:
              </p>
              <p className="font-medium text-gray-900 dark:text-foreground">
                {alunoTurma.aluno.nome}
              </p>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">
                {alunoTurma.aluno.matricula}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Nova Turma *</Label>
            <Select value={novaTurmaId} onValueChange={setNovaTurmaId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {turmasDisponiveis.length === 0 ? (
                  <div className="p-4 text-center text-gray-600 dark:text-muted-foreground">
                    Nenhuma turma disponível para transferência
                  </div>
                ) : (
                  turmasDisponiveis.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome} ({turma.codigo})
                    </SelectItem>
                  ))
                )}
              </SelectPopup>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleTransferir} disabled={!novaTurmaId || isLoading}>
            {isLoading ? 'Transferindo...' : 'Transferir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
