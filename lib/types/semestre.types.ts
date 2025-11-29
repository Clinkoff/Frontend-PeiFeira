export interface Semestre {
  id: string;
  isActive: boolean;
  nome: string;
  ano: number;
  periodo: number; // 1 ou 2
  dataInicio: string; // ISO string
  dataFim: string; // ISO string
  createdAt?: string;
  updatedAt?: string;
}
export interface CreateSemestreRequest {
  nome: string;
  ano: number;
  periodo: number;
  dataInicio: string;
  dataFim: string;
}

export interface UpdateSemestreRequest {
  nome: string;
  dataInicio: string;
  dataFim: string;
}

export interface SemestreWithDetails extends Semestre {
  turmas?: any[]; // tipar melhor quando criar Turma
  totalTurmas?: number;
}
