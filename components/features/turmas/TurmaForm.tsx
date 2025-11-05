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
  createTurmaSchema,
  updateTurmaSchema,
  type CreateTurmaFormData,
  type UpdateTurmaFormData,
} from '@/lib/schemas/turma.schema';
import type { Turma } from '@/lib/types';
import { useSemestres } from '@/lib/hooks/useSemestres';
import { Hash, School, BookOpen } from 'lucide-react';

interface TurmaFormCreateProps {
  mode: 'create';
  onSubmit: (data: CreateTurmaFormData) => Promise<void>;
  isLoading?: boolean;
}

interface TurmaFormEditProps {
  mode: 'edit';
  turma: Turma;
  onSubmit: (data: UpdateTurmaFormData) => Promise<void>;
  isLoading?: boolean;
}

type TurmaFormProps = TurmaFormCreateProps | TurmaFormEditProps;

export function TurmaForm(props: TurmaFormProps) {
  const { mode, onSubmit, isLoading } = props;
  const isEdit = mode === 'edit';

  const { semestres } = useSemestres();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isEdit ? updateTurmaSchema : createTurmaSchema),
    defaultValues:
      mode === 'edit'
        ? {
            nome: props.turma.nome,
            curso: props.turma.curso || '',
            periodo: props.turma.periodo || '',
            turno: props.turma.turno || '',
          }
        : undefined,
  });

  const turnoItems = [
    { label: 'Matutino', value: 'Matutino' },
    { label: 'Vespertino', value: 'Vespertino' },
    { label: 'Noturno', value: 'Noturno' },
    { label: 'Integral', value: 'Integral' },
  ];

  const periodoItems = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}º Período`,
    value: (i + 1).toString(),
  }));

  const semestreId = watch('semestreId');
  const turno = watch('turno');
  const periodo = watch('periodo');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center">
            <School className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-gray-900 dark:text-foreground">
            {isEdit ? 'Editar Turma' : 'Nova Turma'}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          {/* Semestre (apenas na criação) */}
          {!isEdit && (
            <div className="space-y-2">
              <Label>Semestre *</Label>
              <Select
                value={semestreId || ''}
                onValueChange={(value) => setValue('semestreId', value, { shouldValidate: true })}
              >
                <SelectTrigger className={errors.semestreId ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {semestres.map((semestre) => (
                    <SelectItem key={semestre.id} value={semestre.id}>
                      {semestre.nome} ({semestre.ano}.{semestre.periodo})
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
              {errors.semestreId && (
                <p className="text-sm text-red-600">{errors.semestreId?.message as string}</p>
              )}
            </div>
          )}

          {/* Nome e Código */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Turma *</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="nome"
                  placeholder="Ex: Turma A - 2º Período ADS"
                  {...register('nome')}
                  className={`pl-10 ${errors.nome ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.nome && (
                <p className="text-sm text-red-600">{errors.nome?.message as string}</p>
              )}
            </div>

            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="codigo">Código da Turma *</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    id="codigo"
                    placeholder="Ex: ADS-2A"
                    {...register('codigo')}
                    className={`pl-10 ${errors.codigo ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.codigo && (
                  <p className="text-sm text-red-600">{errors.codigo?.message as string}</p>
                )}
                <p className="text-xs text-gray-600 dark:text-muted-foreground">
                  Use apenas letras maiúsculas, números e hífen
                </p>
              </div>
            )}
          </div>

          {/* Curso, Período e Turno */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="curso">Curso</Label>
              <Input
                id="curso"
                placeholder="Ex: ADS, SI, Engenharia"
                {...register('curso')}
                className={errors.curso ? 'border-red-500' : ''}
              />
              {errors.curso && (
                <p className="text-sm text-red-600">{errors.curso?.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select
                value={periodo?.toString() || ''}
                onValueChange={(value) =>
                  setValue('periodo', value ? parseInt(value) : undefined, { shouldValidate: true })
                }
              >
                <SelectTrigger className={errors.periodo ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {periodoItems.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
              {errors.periodo && (
                <p className="text-sm text-red-600">{errors.periodo?.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Turno</Label>
              <Select
                value={turno || ''}
                onValueChange={(value) => setValue('turno', value, { shouldValidate: true })}
              >
                <SelectTrigger className={errors.turno ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {turnoItems.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
              {errors.turno && (
                <p className="text-sm text-red-600">{errors.turno?.message as string}</p>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Salvando...' : isEdit ? 'Atualizar Turma' : 'Criar Turma'}
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
