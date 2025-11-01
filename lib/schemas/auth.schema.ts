import { z } from 'zod';

export const loginSchema = z.object({
  matricula: z.string().min(1, 'Matricula é obrigatório'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
