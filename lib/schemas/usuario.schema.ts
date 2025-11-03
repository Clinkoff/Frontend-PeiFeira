// lib/schemas/usuario.schema.ts
import { z } from 'zod';

const baseUsuarioSchema = z.object({
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  nome: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.email(),
  senha: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(60, 'Senha não pode exceder 60 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
  role: z.enum(['Admin', 'Professor', 'Aluno', 'Coordenador'], {
    error: 'Selecione uma função válida',
  }),
});

const alunoSchema = baseUsuarioSchema.extend({
  role: z.literal('Aluno'),
  perfilAluno: z.object({
    curso: z.string().min(1, 'Curso é obrigatório'),
    turno: z.string().min(1, 'Turno é obrigatório'),
  }),
});

const professorSchema = baseUsuarioSchema.extend({
  role: z.literal('Professor'),
  perfilProfessor: z.object({
    titulacao: z.string().min(1, 'Titulação é obrigatória'),
    areaEspecializacao: z.string().min(1, 'Área de especialização é obrigatória'),
    departamento: z.string().min(1, 'Departamento é obrigatório'),
  }),
});

const adminCoordenadorSchema = baseUsuarioSchema.extend({
  role: z.enum(['Admin', 'Coordenador']),
});

export const createUsuarioSchema = z
  .discriminatedUnion('role', [alunoSchema, professorSchema, adminCoordenadorSchema])
  .and(
    z.object({
      senha: z.string(),
    })
  );

export const updateUsuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter entre 2 e 200 caracteres').max(200),
  email: z.email(),
  role: z.enum(['Admin', 'Professor', 'Aluno', 'Coordenador']),
});

export type CreateUsuarioFormData = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioFormData = z.infer<typeof updateUsuarioSchema>;
