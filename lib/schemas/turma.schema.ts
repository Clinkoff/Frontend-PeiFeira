import { z } from 'zod';

export const createTurmaSchema = z.object({
  semestreId: z.string().min(1, 'Semestre é obrigatório'),

  nome: z
    .string()
    .min(3, 'Nome deve ter entre 3 e 100 caracteres')
    .max(100, 'Nome deve ter entre 3 e 100 caracteres'),

  codigo: z
    .string()
    .min(3, 'Código deve ter entre 3 e 20 caracteres')
    .max(20, 'Código deve ter entre 3 e 20 caracteres')
    .regex(/^[A-Z0-9-]+$/, 'Código deve conter apenas letras maiúsculas, números e hífen'),

  curso: z.string().max(100, 'Curso deve ter no máximo 100 caracteres').optional(),

  periodo: z
    .number({
      error: 'Período deve ser um número',
    })
    .int('Período deve ser um número inteiro')
    .min(1, 'Período deve ser maior que 0')
    .max(10, 'Período deve ser menor ou igual a 10')
    .optional(),

  turno: z.string().max(20, 'Turno deve ter no máximo 20 caracteres').optional(),
});

export const updateTurmaSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter entre 3 e 100 caracteres')
    .max(100, 'Nome deve ter entre 3 e 100 caracteres'),

  curso: z.string().max(100, 'Curso deve ter no máximo 100 caracteres').optional(),

  periodo: z
    .number({
      error: 'Período deve ser um número',
    })
    .int('Período deve ser um número inteiro')
    .min(1, 'Período deve ser maior que 0')
    .max(10, 'Período deve ser menor ou igual a 10')
    .optional(),

  turno: z.string().max(20, 'Turno deve ter no máximo 20 caracteres').optional(),
});

export type CreateTurmaFormData = z.infer<typeof createTurmaSchema>;
export type UpdateTurmaFormData = z.infer<typeof updateTurmaSchema>;
