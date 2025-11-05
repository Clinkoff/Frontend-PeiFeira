// lib/types/disciplinaPI.types.ts
export enum StatusProjetoIntegrador {
  Ativo = 'Ativo',
  Finalizado = 'Finalizado',
  Cancelado = 'Cancelado',
}

export interface DisciplinaPI {
  id: string;
  isActive: boolean;
  semestreId: string;
  perfilProfessorId: string;
  nome: string;
  temaGeral: string;
  descricao?: string | null;
  objetivos?: string | null;
  dataInicio: string;
  dataFim: string;
  status: StatusProjetoIntegrador;
  criadoEm?: string;
  alteradoEm?: string;
}

export interface DisciplinaPIResponse extends DisciplinaPI {
  nomeSemestre?: string;
  nomeProfessor?: string;
  quantidadeTurmas?: number;
  quantidadeProjetos?: number;
}

export interface DisciplinaPIDetailResponse extends DisciplinaPI {
  semestre?: {
    id: string;
    nome: string;
    ano: number;
    periodo: number;
  };
  professor?: {
    id: string;
    nome: string;
    email: string;
    departamento?: string;
  };
  turmas?: {
    id: string;
    nome: string;
    curso?: string;
  }[];
  projetos?: {
    id: string;
    titulo: string;
    nomeEquipe?: string;
  }[];
}

export interface DisciplinaPITurma {
  id: string;
  isActive: boolean;
  disciplinaPIId: string;
  turmaId: string;
  disciplinaPI?: DisciplinaPI;
  turma?: {
    id: string;
    nome: string;
    codigo: string;
    curso?: string;
    periodo?: number;
    turno?: string;
  };
}

export interface CreateDisciplinaPIRequest {
  semestreId: string;
  perfilProfessorId: string;
  nome: string;
  temaGeral: string;
  descricao?: string;
  objetivos?: string;
  dataInicio: string;
  dataFim: string;
  turmaIds: string[];
}

export interface UpdateDisciplinaPIRequest {
  nome: string;
  temaGeral: string;
  descricao?: string;
  objetivos?: string;
  dataInicio: string;
  dataFim: string;
  status: StatusProjetoIntegrador;
  turmaIds: string[];
}

export const StatusProjetoIntegradorLabels: Record<StatusProjetoIntegrador, string> = {
  [StatusProjetoIntegrador.Ativo]: 'Ativo',
  [StatusProjetoIntegrador.Finalizado]: 'Finalizado',
  [StatusProjetoIntegrador.Cancelado]: 'Cancelado',
};

export const StatusProjetoIntegradorColors: Record<StatusProjetoIntegrador, string> = {
  [StatusProjetoIntegrador.Ativo]:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  [StatusProjetoIntegrador.Finalizado]:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  [StatusProjetoIntegrador.Cancelado]:
    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};
