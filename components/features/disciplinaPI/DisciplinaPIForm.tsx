'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createDisciplinaPISchema,
  updateDisciplinaPISchema,
  type CreateDisciplinaPIFormData,
  type UpdateDisciplinaPIFormData,
} from '@/lib/schemas/disciplinaPI.schema';
import type { DisciplinaPIResponse, StatusProjetoIntegrador } from '@/lib/types/disciplinaPI.types';
import { StatusProjetoIntegradorLabels } from '@/lib/types/disciplinaPI.types';
import { useSemestres } from '@/lib/hooks/useSemestres';
import { useTurmas } from '@/lib/hooks/useTurmas';
import { useUsuarios } from '@/lib/hooks/useUsuarios';
import { BookOpen, Calendar, Users, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DisciplinaPIFormCreateProps {
  mode: 'create';
  onSubmit: (data: CreateDisciplinaPIFormData) => Promise<void>;
  isLoading?: boolean;
}

interface DisciplinaPIFormEditProps {
  mode: 'edit';
  disciplina: DisciplinaPIResponse;
  onSubmit: (data: UpdateDisciplinaPIFormData) => Promise<void>;
  isLoading?: boolean;
}

type DisciplinaPIFormProps = DisciplinaPIFormCreateProps | DisciplinaPIFormEditProps;

export function DisciplinaPIForm(props: DisciplinaPIFormProps) {
  const { mode, onSubmit, isLoading } = props;
  const isEdit = mode === 'edit';

  const { semestres } = useSemestres();
  const { turmas } = useTurmas();
  const { usuarios } = useUsuarios();

  // Filtrar apenas professores ativos
  const professores = usuarios.filter(
    (usuario) => usuario.role === 'Professor' && usuario.perfilProfessor && usuario.isActive
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isEdit ? updateDisciplinaPISchema : createDisciplinaPISchema),
    defaultValues:
      mode === 'edit'
        ? {
            nome: props.disciplina.nome,
            temaGeral: props.disciplina.temaGeral,
            descricao: props.disciplina.descricao || '',
            objetivos: props.disciplina.objetivos || '',
            dataInicio: new Date(props.disciplina.dataInicio).toISOString().split('T')[0],
            dataFim: new Date(props.disciplina.dataFim).toISOString().split('T')[0],
            status: props.disciplina.status,
            turmaIds: [], // Será preenchido pelo backend
          }
        : {
            turmaIds: [],
          },
  });

  const semestreId = watch('semestreId');
  const perfilProfessorId = watch('perfilProfessorId');
  const turmaIds = watch('turmaIds') || [];
  const status = watch('status');

  const handleAddTurma = (turmaId: string) => {
    if (!turmaIds.includes(turmaId)) {
      setValue('turmaIds', [...turmaIds, turmaId], { shouldValidate: true });
    }
  };

  const handleRemoveTurma = (turmaId: string) => {
    setValue(
      'turmaIds',
      turmaIds.filter((id: string) => id !== turmaId),
      { shouldValidate: true }
    );
  };

  const turmasDisponiveis = turmas.filter(
    (turma) => !turmaIds.includes(turma.id) && turma.isActive
  );
  const turmasSelecionadas = turmas.filter((turma) => turmaIds.includes(turma.id));

  const statusOptions = Object.entries(StatusProjetoIntegradorLabels).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#6F73D2] dark:bg-[#5A5FB8] flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-gray-900 dark:text-foreground">
            {isEdit ? 'Editar Disciplina PI' : 'Nova Disciplina PI'}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          {/* Semestre e Professor (apenas na criação) */}
          {!isEdit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label>Professor Responsável *</Label>
                <Select
                  value={perfilProfessorId || ''}
                  onValueChange={(value) =>
                    setValue('perfilProfessorId', value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className={errors.perfilProfessorId ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPopup>
                    {professores.map((professor) => (
                      <SelectItem
                        key={professor.perfilProfessor!.id}
                        value={professor.perfilProfessor!.id!}
                      >
                        {professor.nome} -{' '}
                        {professor.perfilProfessor?.departamento || 'Sem departamento'}
                      </SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
                {errors.perfilProfessorId && (
                  <p className="text-sm text-red-600">
                    {errors.perfilProfessorId?.message as string}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Disciplina *</Label>
            <Input
              id="nome"
              placeholder="Ex: Projeto Integrador I"
              {...register('nome')}
              className={errors.nome ? 'border-red-500' : ''}
            />
            {errors.nome && (
              <p className="text-sm text-red-600">{errors.nome?.message as string}</p>
            )}
          </div>

          {/* Tema Geral */}
          <div className="space-y-2">
            <Label htmlFor="temaGeral">Tema Geral *</Label>
            <Input
              id="temaGeral"
              placeholder="Ex: Desenvolvimento de Sistemas Web"
              {...register('temaGeral')}
              className={errors.temaGeral ? 'border-red-500' : ''}
            />
            {errors.temaGeral && (
              <p className="text-sm text-red-600">{errors.temaGeral?.message as string}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descrição detalhada da disciplina..."
              {...register('descricao')}
              className={errors.descricao ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.descricao && (
              <p className="text-sm text-red-600">{errors.descricao?.message as string}</p>
            )}
          </div>

          {/* Objetivos */}
          <div className="space-y-2">
            <Label htmlFor="objetivos">Objetivos</Label>
            <Textarea
              id="objetivos"
              placeholder="Objetivos de aprendizagem..."
              {...register('objetivos')}
              className={errors.objetivos ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.objetivos && (
              <p className="text-sm text-red-600">{errors.objetivos?.message as string}</p>
            )}
          </div>

          {/* Datas e Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="dataInicio"
                  type="date"
                  {...register('dataInicio')}
                  className={`pl-10 ${errors.dataInicio ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.dataInicio && (
                <p className="text-sm text-red-600">{errors.dataInicio?.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data de Fim *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="dataFim"
                  type="date"
                  {...register('dataFim')}
                  className={`pl-10 ${errors.dataFim ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.dataFim && (
                <p className="text-sm text-red-600">{errors.dataFim?.message as string}</p>
              )}
            </div>

            {isEdit && (
              <div className="space-y-2">
                <Label>Status *</Label>
                <Select
                  value={status || ''}
                  onValueChange={(value) => setValue('status', value, { shouldValidate: true })}
                >
                  <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPopup>
                    {statusOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600">{errors.status?.message as string}</p>
                )}
              </div>
            )}
          </div>

          {/* Turmas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Turmas Associadas *</Label>
              <span className="text-sm text-gray-600 dark:text-muted-foreground">
                {turmasSelecionadas.length} turma(s) selecionada(s)
              </span>
            </div>

            {/* Turmas Selecionadas */}
            {turmasSelecionadas.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Turmas selecionadas:</Label>
                <div className="flex flex-wrap gap-2">
                  {turmasSelecionadas.map((turma) => (
                    <Badge
                      key={turma.id}
                      variant="secondary"
                      className="flex items-center gap-2 pr-1"
                    >
                      <span>
                        {turma.nome} ({turma.codigo})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTurma(turma.id)}
                        className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Adicionar Turma */}
            <div className="space-y-2">
              <Label>Adicionar turma:</Label>
              <Select value="" onValueChange={handleAddTurma}>
                <SelectTrigger className={errors.turmaIds ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {turmasDisponiveis.length === 0 ? (
                    <div className="p-4 text-center text-gray-600 dark:text-muted-foreground">
                      Todas as turmas já foram adicionadas
                    </div>
                  ) : (
                    turmasDisponiveis.map((turma) => (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.nome} ({turma.codigo}) - {turma.curso || 'Sem curso'}
                      </SelectItem>
                    ))
                  )}
                </SelectPopup>
              </Select>
              {errors.turmaIds && (
                <p className="text-sm text-red-600">{errors.turmaIds?.message as string}</p>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Salvando...' : isEdit ? 'Atualizar Disciplina' : 'Criar Disciplina'}
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
