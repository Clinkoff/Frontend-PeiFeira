'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, Send, UserPlus, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUsuarios } from '@/lib/hooks/useUsuarios';
import { useConvites } from '@/lib/hooks/useConvites';
import { createConviteSchema, type CreateConviteFormData } from '@/lib/schemas/convite.schema';
import type { Usuario } from '@/lib/types/usuario.types';

interface EnviarConviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipeId: string;
  liderPerfilAlunoId: string;
  membrosAtuais: string[];
}

export function EnviarConviteDialog({
  open,
  onOpenChange,
  equipeId,
  liderPerfilAlunoId,
  membrosAtuais,
}: EnviarConviteDialogProps) {
  const { alunos } = useUsuarios();
  const { create, isCreating, useConvitesPorEquipe } = useConvites();
  const { data: convitesEquipe = [] } = useConvitesPorEquipe(equipeId);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAluno, setSelectedAluno] = useState<Usuario | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateConviteFormData>({
    resolver: zodResolver(createConviteSchema),
    defaultValues: {
      equipeId,
      convidadoPorId: liderPerfilAlunoId,
      convidadoId: '',
      mensagem: '',
    },
  });

  useEffect(() => {
    if (selectedAluno?.perfilAluno?.id) {
      setValue('convidadoId', selectedAluno.perfilAluno.id, { shouldValidate: true });
    } else {
      setValue('convidadoId', '', { shouldValidate: true });
    }
  }, [selectedAluno, setValue]);

  useEffect(() => {
    setValue('equipeId', equipeId);
    setValue('convidadoPorId', liderPerfilAlunoId);
  }, [equipeId, liderPerfilAlunoId, setValue]);

  const alunosConvidados = convitesEquipe
    .filter((c) => c.status === 'Pendente')
    .map((c) => c.convidadoId);

  const alunosDisponiveis = alunos.filter(
    (aluno) =>
      aluno.perfilAluno &&
      !membrosAtuais.includes(aluno.perfilAluno.id!) &&
      !alunosConvidados.includes(aluno.perfilAluno.id!) &&
      aluno.perfilAluno.id !== liderPerfilAlunoId &&
      (aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const onSubmit = async (data: CreateConviteFormData) => {
    if (!selectedAluno?.perfilAluno?.id) return;

    try {
      await create({
        equipeId: data.equipeId,
        convidadoPorId: data.convidadoPorId,
        convidadoId: data.convidadoId,
        mensagem: data.mensagem,
      });
      reset();
      setSelectedAluno(null);
      setSearchTerm('');
      onOpenChange(false);
    } catch (error) {
      console.error('❌ Erro no envio:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col h-full">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Enviar Convite
          </DialogTitle>
          <DialogDescription>Convide um aluno para participar da equipe.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="space-y-2">
              <Label>Buscar Aluno</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Nome, matrícula ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border dark:border-gray-700 rounded-lg overflow-hidden min-h-[150px]">
              {alunosDisponiveis.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-muted-foreground">
                  <UserPlus className="w-10 h-10 mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-center text-sm px-4">
                    {searchTerm
                      ? 'Nenhum aluno encontrado.'
                      : 'Todos os alunos disponíveis já estão na equipe.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y dark:divide-gray-700">
                  {alunosDisponiveis.map((aluno) => (
                    <button
                      key={aluno.id}
                      type="button"
                      onClick={() => setSelectedAluno(aluno)}
                      className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all ${
                        selectedAluno?.id === aluno.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 pl-[1.2rem]'
                          : 'border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                            {aluno.nome.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-gray-900 dark:text-foreground truncate">
                              {aluno.nome}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-muted-foreground truncate">
                              {aluno.matricula} • {aluno.email}
                            </p>
                            {aluno.perfilAluno?.curso && (
                              <div className="mt-1">
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1 py-0 h-5 font-normal"
                                >
                                  {aluno.perfilAluno.curso}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedAluno?.id === aluno.id && (
                          <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedAluno && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 pb-2">
                <Label htmlFor="mensagem">Mensagem (opcional)</Label>
                <Textarea
                  {...register('mensagem')}
                  id="mensagem"
                  rows={3}
                  placeholder="Adicione uma mensagem..."
                  className={errors.mensagem ? 'border-red-500' : ''}
                />
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-transparent shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedAluno || isCreating}>
              {isCreating ? 'Enviando...' : 'Enviar Convite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
