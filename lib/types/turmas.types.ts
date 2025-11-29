export interface Turma {
  id: string;
  isActive: boolean;
  semestreId: string;
  nome: string;
  codigo: string;
  curso?: string | null;
  periodo?: number | null;
  turno?: string | null;
  criadoEm?: string;
  alteradoEm?: string;
}

export interface TurmaWithDetails extends Turma {
  semestre?: {
    id: string;
    nome: string;
    ano: number;
    periodo: number;
  };
  alunosTurma?: AlunoTurma[];
  totalAlunos?: number;
  disciplinasPI?: any[]; // tipar melhor quando criar DisciplinaPI
}

export interface AlunoTurma {
  id: string;
  perfilAlunoId: string;
  turmaId: string;
  dataMatricula: string;
  isAtual: boolean;
  isActive: boolean;
  aluno?: {
    nome: string;
    matricula: string;
    email: string;
  };
}

export interface CreateTurmaRequest {
  semestreId: string;
  nome: string;
  codigo: string;
  curso?: string;
  periodo?: number;
  turno?: string;
}

export interface UpdateTurmaRequest {
  nome: string;
  curso?: string;
  periodo?: number;
  turno?: string;
}

export interface MatricularAlunoRequest {
  usuarioId: string;
  turmaId: string;
}

export interface TransferirAlunoRequest {
  usuarioId: string;
  novaTurmaId: string;
}
