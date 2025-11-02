import { z } from 'zod';

export const createSemestreSchema = z
  .object({
    nome: z
      .string()
      .min(1, 'Nome do semestre é obrigatório')
      .max(10, 'Nome deve ter no máximo 10 caracteres'),

    ano: z
      .number({
        error: 'Ano deve ser um número',
      })
      .int('Ano deve ser um número inteiro')
      .gte(2020, 'Ano deve ser maior ou igual a 2020')
      .lte(2100, 'Ano inválido'),

    periodo: z
      .number({
        error: 'Período é obrigatório',
      })
      .int('Período deve ser 1 ou 2')
      .min(1, 'Período deve ser 1 ou 2')
      .max(2, 'Período deve ser 1 ou 2'),

    dataInicio: z.string().min(1, 'Data de início é obrigatória'),

    dataFim: z.string().min(1, 'Data de fim é obrigatória'),
  })
  .refine(
    (data) => {
      const inicio = new Date(data.dataInicio);
      const fim = new Date(data.dataFim);
      return inicio < fim;
    },
    {
      message: 'Data de início deve ser anterior à data de fim',
      path: ['dataInicio'],
    }
  );

export const updateSemestreSchema = z
  .object({
    nome: z
      .string()
      .min(3, 'Nome deve ter entre 3 e 100 caracteres')
      .max(100, 'Nome deve ter entre 3 e 100 caracteres'),

    dataInicio: z.string().min(1, 'Data de início é obrigatória'),

    dataFim: z.string().min(1, 'Data de fim é obrigatória'),
  })
  .refine(
    (data) => {
      const inicio = new Date(data.dataInicio);
      const fim = new Date(data.dataFim);
      return inicio < fim;
    },
    {
      message: 'Data de início deve ser anterior à data de fim',
      path: ['dataInicio'],
    }
  );

export type CreateSemestreFormData = z.infer<typeof createSemestreSchema>;
export type UpdateSemestreFormData = z.infer<typeof updateSemestreSchema>;
