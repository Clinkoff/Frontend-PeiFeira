// lib/schemas/projeto.schema.ts
import { z } from 'zod';

// Schema para criação de projeto
export const createProjetoSchema = z.object({
  disciplinaPIId: z.string().uuid('Selecione uma disciplina PI válida'),
  equipeId: z.string().uuid('Selecione uma equipe válida'),
  titulo: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  desafioProposto: z
    .string()
    .min(10, 'Desafio proposto deve ter no mínimo 10 caracteres')
    .max(2000, 'Desafio proposto deve ter no máximo 2000 caracteres'),

  // Dados da empresa (opcionais)
  nomeEmpresa: z.string().max(200).optional().or(z.literal('')),
  enderecoCompleto: z.string().max(500).optional().or(z.literal('')),
  cidade: z.string().max(100).optional().or(z.literal('')),
  redeSocial: z.string().max(200).optional().or(z.literal('')),
  contato: z.string().max(100).optional().or(z.literal('')),

  // Dados do responsável (opcionais)
  nomeResponsavel: z.string().max(200).optional().or(z.literal('')),
  cargoResponsavel: z.string().max(100).optional().or(z.literal('')),
  telefoneResponsavel: z
    .string()
    .max(20)
    .regex(/^[\d\s()+-]*$/, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  emailResponsavel: z
    .string()
    .email('E-mail inválido')
    .optional()
    .or(z.literal('')),
  redesSociaisResponsavel: z.string().max(500).optional().or(z.literal('')),
});

// Schema para atualização de projeto
export const updateProjetoSchema = z.object({
  titulo: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  desafioProposto: z
    .string()
    .min(10, 'Desafio proposto deve ter no mínimo 10 caracteres')
    .max(2000, 'Desafio proposto deve ter no máximo 2000 caracteres'),
  status: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),

  // Dados da empresa (opcionais)
  nomeEmpresa: z.string().max(200).optional().or(z.literal('')),
  enderecoCompleto: z.string().max(500).optional().or(z.literal('')),
  cidade: z.string().max(100).optional().or(z.literal('')),
  redeSocial: z.string().max(200).optional().or(z.literal('')),
  contato: z.string().max(100).optional().or(z.literal('')),

  // Dados do responsável (opcionais)
  nomeResponsavel: z.string().max(200).optional().or(z.literal('')),
  cargoResponsavel: z.string().max(100).optional().or(z.literal('')),
  telefoneResponsavel: z
    .string()
    .max(20)
    .regex(/^[\d\s()+-]*$/, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  emailResponsavel: z
    .string()
    .email('E-mail inválido')
    .optional()
    .or(z.literal('')),
  redesSociaisResponsavel: z.string().max(500).optional().or(z.literal('')),
});

export type CreateProjetoFormData = z.infer<typeof createProjetoSchema>;
export type UpdateProjetoFormData = z.infer<typeof updateProjetoSchema>;
