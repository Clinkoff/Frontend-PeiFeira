import { z } from 'zod';

export const createConviteSchema = z.object({
  equipeId: z.string().min(1, 'Equipe é obrigatória'),

  convidadoPorId: z.string().min(1, 'Convidado por é obrigatório'),

  convidadoId: z.string().min(1, 'Aluno é obrigatório'),

  mensagem: z.string().max(500, 'Mensagem não pode exceder 500 caracteres').optional(),
});

export type CreateConviteFormData = z.infer<typeof createConviteSchema>;
