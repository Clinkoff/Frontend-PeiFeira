export enum TeamMemberRole {
  Lider = 'Lider',
  Membro = 'Membro',
}

export const TeamMemberRoleLabels: Record<TeamMemberRole, string> = {
  [TeamMemberRole.Lider]: 'Líder',
  [TeamMemberRole.Membro]: 'Membro',
};

export interface Equipe {
  id: string;
  isActive: boolean;
  liderPerfilAlunoId: string;
  nome: string;
  urlQrCode?: string | null;
  codigoConvite?: string | null;
  criadoEm?: string;
  alteradoEm?: string;
}

export interface EquipeResponse extends Equipe {
  nomeLider?: string;
  quantidadeMembros?: number;
  temProjeto?: boolean;
}

export interface EquipeDetailResponse extends Equipe {
  quantidadeMembros: number;
  temProjeto: boolean;
  lider?: {
    id: string;
    nome: string;
    email: string;
  };
  membros?: {
    nome: string;
    email: string;
    dataEntrada: string;
  }[];
  projeto?: {
    id: string;
    titulo: string;
    status: string;
  };
}

export interface MembroEquipe {
  id: string;
  isActive: boolean;
  equipeId: string;
  perfilAlunoId: string;
  cargo: TeamMemberRole;
  funcao?: string | null;
  ingressouEm: string;
  saiuEm?: string | null;
}

export interface MembroEquipeResponse extends MembroEquipe {
  nomeAluno?: string;
  emailAluno?: string;
  matriculaAluno?: string;
  nomeEquipe?: string;
}

export interface CreateEquipeRequest {
  liderPerfilAlunoId: string;
  nome: string;
}

export interface UpdateEquipeRequest {
  nome: string;
}

export interface AddMembroEquipeRequest {
  equipeId: string;
  perfilAlunoId: string;
  cargo?: TeamMemberRole;
  funcao?: string;
}
