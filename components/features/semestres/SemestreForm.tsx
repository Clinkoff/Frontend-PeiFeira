// components/features/semestres/SemestreForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  createSemestreSchema,
  updateSemestreSchema,
  type CreateSemestreFormData,
  type UpdateSemestreFormData,
} from '@/lib/schemas/semestre.schema';
import type { Semestre } from '@/lib/types';

interface SemestreFormCreateProps {
  mode: 'create';
  onSubmit: (data: CreateSemestreFormData) => Promise<void>;
  isLoading?: boolean;
}

interface SemestreFormEditProps {
  mode: 'edit';
  semestre: Semestre;
  onSubmit: (data: UpdateSemestreFormData) => Promise<void>;
  isLoading?: boolean;
}

type SemestreFormProps = SemestreFormCreateProps | SemestreFormEditProps;

export function SemestreForm(props: SemestreFormProps) {
  const { mode, onSubmit, isLoading } = props;
  const isEdit = mode === 'edit';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isEdit ? updateSemestreSchema : createSemestreSchema),
    defaultValues:
      mode === 'edit'
        ? {
            nome: props.semestre.nome,
            dataInicio: props.semestre.dataInicio.split('T')[0],
            dataFim: props.semestre.dataFim.split('T')[0],
          }
        : undefined,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-foreground">
          {isEdit ? 'Editar Semestre' : 'Novo Semestre'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Semestre</Label>
            <Input
              id="nome"
              placeholder="Ex: 2024.1"
              {...register('nome')}
              className={errors.nome ? 'border-red-500' : ''}
            />
            {errors.nome && (
              <p className="text-sm text-red-600">{errors.nome?.message as string}</p>
            )}
          </div>

          {/* Ano e Período (apenas na criação) */}
          {!isEdit && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  placeholder="2024"
                  {...register('ano', { valueAsNumber: true })}
                  className={errors.ano ? 'border-red-500' : ''}
                />
                {errors.ano && (
                  <p className="text-sm text-red-600">{errors.ano?.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodo">Período</Label>
                <Input
                  id="periodo"
                  type="number"
                  placeholder="1 ou 2"
                  {...register('periodo', { valueAsNumber: true })}
                  className={errors.periodo ? 'border-red-500' : ''}
                />
                {errors.periodo && (
                  <p className="text-sm text-red-600">{errors.periodo?.message as string}</p>
                )}
              </div>
            </div>
          )}

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início</Label>
              <Input
                id="dataInicio"
                type="date"
                {...register('dataInicio')}
                className={errors.dataInicio ? 'border-red-500' : ''}
              />
              {errors.dataInicio && (
                <p className="text-sm text-red-600">{errors.dataInicio?.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data de Fim</Label>
              <Input
                id="dataFim"
                type="date"
                {...register('dataFim')}
                className={errors.dataFim ? 'border-red-500' : ''}
              />
              {errors.dataFim && (
                <p className="text-sm text-red-600">{errors.dataFim?.message as string}</p>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar Semestre'}
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
