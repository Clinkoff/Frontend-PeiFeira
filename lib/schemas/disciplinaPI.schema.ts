import { z } from 'zod';
import { StatusProjetoIntegrador } from '@/lib/types/disciplinaPI.types';

export const createDisciplinaPISchema = z
  .object({
    semestreId: z.string().min(1, 'Semestre é obrigatório'),

    perfilProfessorId: z.string().min(1, 'Professor é obrigatório'),

    nome: z
      .string()
      .min(3, 'Nome deve ter entre 3 e 200 caracteres')
      .max(200, 'Nome deve ter entre 3 e 200 caracteres'),

    temaGeral: z
      .string()
      .min(5, 'Tema geral deve ter entre 5 e 500 caracteres')
      .max(500, 'Tema geral deve ter entre 5 e 500 caracteres'),

    descricao: z.string().max(2000, 'Descrição não pode exceder 2000 caracteres').optional(),

    objetivos: z.string().max(2000, 'Objetivos não podem exceder 2000 caracteres').optional(),

    dataInicio: z.string().min(1, 'Data de início é obrigatória'),

    dataFim: z.string().min(1, 'Data de fim é obrigatória'),

    turmaIds: z
      .array(z.string())
      .min(1, 'Ao menos uma turma deve ser associada')
      .refine((ids) => ids.every((id) => id.length > 0), {
        message: 'IDs de turma inválidos',
      }),
  })
  .refine(
    (data) => {
      const inicio = new Date(data.dataInicio);
      const fim = new Date(data.dataFim);
      return inicio < fim;
    },
    {
      message: 'Data de início deve ser anterior à data de fim',
      path: ['dataFim'],
    }
  );

export const updateDisciplinaPISchema = z
  .object({
    nome: z
      .string()
      .min(3, 'Nome deve ter entre 3 e 200 caracteres')
      .max(200, 'Nome deve ter entre 3 e 200 caracteres'),

    temaGeral: z
      .string()
      .min(5, 'Tema geral deve ter entre 5 e 500 caracteres')
      .max(500, 'Tema geral deve ter entre 5 e 500 caracteres'),

    descricao: z.string().max(2000, 'Descrição não pode exceder 2000 caracteres').optional(),

    objetivos: z.string().max(2000, 'Objetivos não podem exceder 2000 caracteres').optional(),

    dataInicio: z.string().min(1, 'Data de início é obrigatória'),

    dataFim: z.string().min(1, 'Data de fim é obrigatória'),

    status: z.nativeEnum(StatusProjetoIntegrador, {
      error: () => ({ message: 'Status inválido' }),
    }),

    turmaIds: z
      .array(z.string())
      .min(1, 'Ao menos uma turma deve ser associada')
      .refine((ids) => ids.every((id) => id.length > 0), {
        message: 'IDs de turma inválidos',
      }),
  })
  .refine(
    (data) => {
      const inicio = new Date(data.dataInicio);
      const fim = new Date(data.dataFim);
      return inicio < fim;
    },
    {
      message: 'Data de início deve ser anterior à data de fim',
      path: ['dataFim'],
    }
  );

export type CreateDisciplinaPIFormData = z.infer<typeof createDisciplinaPISchema>;
export type UpdateDisciplinaPIFormData = z.infer<typeof updateDisciplinaPISchema>;
