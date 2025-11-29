'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createEquipeSchema,
  updateEquipeSchema,
  type CreateEquipeFormData,
  type UpdateEquipeFormData,
} from '@/lib/schemas/equipes.schema';
import type { EquipeResponse } from '@/lib/types/equipes.types';
import { useUsuarios } from '@/lib/hooks/useUsuarios';
import { Users, Crown, Loader2, AlertCircle } from 'lucide-react';

interface EquipeFormCreateProps {
  mode: 'create';
  onSubmit: (data: CreateEquipeFormData) => Promise<void>;
  isLoading?: boolean;
}

interface EquipeFormEditProps {
  mode: 'edit';
  equipe: EquipeResponse;
  onSubmit: (data: UpdateEquipeFormData) => Promise<void>;
  isLoading?: boolean;
}

type EquipeFormProps = EquipeFormCreateProps | EquipeFormEditProps;

export function EquipeForm(props: EquipeFormProps) {
  const { mode, onSubmit, isLoading } = props;
  const isEdit = mode === 'edit';

  const { alunos, isLoadingAlunos } = useUsuarios();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isEdit ? updateEquipeSchema : createEquipeSchema),
    defaultValues:
      mode === 'edit'
        ? {
            nome: props.equipe.nome,
          }
        : undefined,
  });

  const liderPerfilAlunoId = watch('liderPerfilAlunoId');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-gray-900 dark:text-foreground">
            {isEdit ? 'Editar Equipe' : 'Nova Equipe'}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          {/* Líder (apenas na criação) */}
          {!isEdit && (
            <div className="space-y-2">
              <Label>Líder da Equipe *</Label>
              {isLoadingAlunos ? (
                <div className="flex items-center gap-2 p-2 border rounded-md">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-muted-foreground">
                    Carregando alunos...
                  </span>
                </div>
              ) : alunos.length === 0 ? (
                <div className="flex flex-col gap-2 p-3 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Nenhum aluno cadastrado
                    </span>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    É necessário cadastrar alunos antes de criar uma equipe.
                  </p>
                </div>
              ) : (
                <>
                  <Select
                    value={liderPerfilAlunoId || ''}
                    onValueChange={(value) =>
                      setValue('liderPerfilAlunoId', value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className={errors.liderPerfilAlunoId ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      {alunos.map((aluno) => (
                        <SelectItem key={aluno.perfilAluno!.id} value={aluno.perfilAluno!.id!}>
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-600" />
                            <div className="flex flex-col">
                              <span className="font-medium">{aluno.nome}</span>
                              <span className="text-xs text-gray-600 dark:text-muted-foreground">
                                {aluno.matricula} • {aluno.email}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                  {errors.liderPerfilAlunoId && (
                    <p className="text-sm text-red-600">
                      {errors.liderPerfilAlunoId?.message as string}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">
                    O líder será o responsável pela equipe e seus membros
                  </p>
                </>
              )}
            </div>
          )}

          {/* Nome da Equipe */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Equipe *</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <Input
                id="nome"
                placeholder="Ex: Tech Innovators, Code Warriors, etc."
                {...register('nome')}
                className={`pl-10 ${errors.nome ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.nome && (
              <p className="text-sm text-red-600">{errors.nome?.message as string}</p>
            )}
          </div>

          {/* Informações sobre código de convite (apenas criação) */}
          {!isEdit && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                ℹ️ Um código de convite único será gerado automaticamente para esta equipe. Os
                membros poderão usar esse código para ingressar na equipe.
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading || (alunos.length === 0 && !isEdit)}
              className="flex-1"
            >
              {isLoading ? 'Salvando...' : isEdit ? 'Atualizar Equipe' : 'Criar Equipe'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
