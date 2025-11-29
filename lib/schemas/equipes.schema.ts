import { z } from 'zod';
import { TeamMemberRole } from '@/lib/types/equipes.types';

export const createEquipeSchema = z.object({
  liderPerfilAlunoId: z.string().min(1, 'Líder é obrigatório'),

  nome: z
    .string()
    .min(3, 'Nome deve ter entre 3 e 100 caracteres')
    .max(100, 'Nome deve ter entre 3 e 100 caracteres'),
});

export const updateEquipeSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter entre 3 e 100 caracteres')
    .max(100, 'Nome deve ter entre 3 e 100 caracteres'),
});

export const addMembroEquipeSchema = z.object({
  equipeId: z.string().min(1, 'Equipe é obrigatória'),

  perfilAlunoId: z.string().min(1, 'Aluno é obrigatório'),

  cargo: z.nativeEnum(TeamMemberRole).optional(),

  funcao: z.string().max(100, 'Função não pode exceder 100 caracteres').optional(),
});

export type CreateEquipeFormData = z.infer<typeof createEquipeSchema>;
export type UpdateEquipeFormData = z.infer<typeof updateEquipeSchema>;
export type AddMembroEquipeFormData = z.infer<typeof addMembroEquipeSchema>;
