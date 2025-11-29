export interface Projeto {
  id: string;
  isActive: boolean;
  disciplinaPIId: string;
  equipeId: string;
  titulo: string;
  desafioProposto: string;
  status: StatusProjeto;
  // Dados da empresa/local (opcionais)
  nomeEmpresa?: string;
  enderecoCompleto?: string;
  cidade?: string;
  redeSocial?: string;
  contato?: string;
  // Dados do responsável na empresa (opcionais)
  nomeResponsavel?: string;
  cargoResponsavel?: string;
  telefoneResponsavel?: string;
  emailResponsavel?: string;
  redesSociaisResponsavel?: string;
  // Dados relacionados
  nomeEquipe?: string;
  nomeDisciplinaPI?: string;
  quantidadeMembros?: number;
  criadoEm?: string;
  alteradoEm?: string;
}

export interface ProjetoDetail extends Projeto {
  equipe?: EquipeProjetoInfo;
  disciplinaPI?: DisciplinaPIProjetoInfo;
  avaliacoes?: AvaliacaoResumo[];
}

export interface EquipeProjetoInfo {
  id: string;
  nome: string;
  lider?: LiderProjetoInfo;
  membros: MembroProjetoInfo[];
}

export interface LiderProjetoInfo {
  id: string;
  nome: string;
  email: string;
}

export interface MembroProjetoInfo {
  id: string;
  nome: string;
  email: string;
}

export interface DisciplinaPIProjetoInfo {
  id: string;
  nome: string;
  professor?: string;
}

export interface AvaliacaoResumo {
  id: string;
  nota: number;
  avaliador: string;
  dataAvaliacao: string;
}

export interface CreateProjetoRequest {
  disciplinaPIId: string;
  equipeId: string;
  titulo: string;
  desafioProposto: string;
  // Dados da empresa/local (opcionais)
  nomeEmpresa?: string;
  enderecoCompleto?: string;
  cidade?: string;
  redeSocial?: string;
  contato?: string;
  // Dados do responsável na empresa (opcionais)
  nomeResponsavel?: string;
  cargoResponsavel?: string;
  telefoneResponsavel?: string;
  emailResponsavel?: string;
  redesSociaisResponsavel?: string;
}

export interface UpdateProjetoRequest {
  titulo: string;
  desafioProposto: string;
  status: StatusProjeto;
  // Dados da empresa/local (opcionais)
  nomeEmpresa?: string;
  enderecoCompleto?: string;
  cidade?: string;
  redeSocial?: string;
  contato?: string;
  // Dados do responsável na empresa (opcionais)
  nomeResponsavel?: string;
  cargoResponsavel?: string;
  telefoneResponsavel?: string;
  emailResponsavel?: string;
  redesSociaisResponsavel?: string;
}

export type StatusProjeto = 1 | 2 | 3 | 4 | 5; // EmAndamento | Concluido | Cancelado | Aprovado | Reprovado

export const StatusProjetoLabels: Record<StatusProjeto, string> = {
  1: 'Em Andamento',
  2: 'Concluído',
  3: 'Cancelado',
  4: 'Aprovado',
  5: 'Reprovado',
};

export const StatusProjetoColors: Record<StatusProjeto, string> = {
  1: 'bg-blue-500/10 text-blue-700 dark:text-blue-400', // Em Andamento
  2: 'bg-green-500/10 text-green-700 dark:text-green-400', // Concluído
  3: 'bg-red-500/10 text-red-700 dark:text-red-400', // Cancelado
  4: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', // Aprovado
  5: 'bg-orange-500/10 text-orange-700 dark:text-orange-400', // Reprovado
};

// Helper para converter retorno do backend (String Name ou String Number) para Enum Number
export function parseProjetoStatus(status: string | number): StatusProjeto {
  // Se já for número, retorna ele mesmo
  if (typeof status === 'number') return status as StatusProjeto;

  // Se for string numérica ("1", "2"), converte
  if (!isNaN(Number(status))) {
    return Number(status) as StatusProjeto;
  }

  // Se for string do Enum ("EmAndamento", etc), converte
  const s = status.toLowerCase();
  if (s === 'emndamento') return 1;
  if (s === 'concluido') return 2;
  if (s === 'cancelado') return 3;
  if (s === 'aprovado') return 4;
  if (s === 'reprovado') return 5;

  return 1;
}
