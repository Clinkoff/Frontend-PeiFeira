export interface DashboardStats {
  totalSemestres: number;
  totalUsuarios: number;
  totalAlunos: number;
  totalProfessores: number;
  totalTurmas: number;
  totalDisciplinasPI: number;
  totalEquipes: number;
  totalProjetos: number;
  disciplinasPIAtivas: number;
  projetosEmAndamento: number;
  equipesAtivas: number;
}

export interface ProjetosPorStatus {
  status: string;
  quantidade: number;
  cor: string;
}

export interface DisciplinasPorSemestre {
  semestre: string;
  quantidade: number;
}

export interface ProjetosPorMes {
  mes: string;
  criados: number;
  concluidos: number;
}

export interface AlunosPorTurma {
  turma: string;
  quantidade: number;
}

export interface AtividadeRecente {
  id: string;
  tipo: 'projeto' | 'equipe' | 'disciplina' | 'usuario';
  titulo: string;
  descricao: string;
  data: string;
  icone?: string;
}
