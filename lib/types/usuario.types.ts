export interface Usuario {
  id: string;
  matricula: string;
  nome: string;
  email: string;
  role: UserRole;
  senhaHash?: string;
  isActive?: boolean;
  criadoEm?: string;
  alteradoEm?: string;
  perfilAluno?: PerfilAluno;
  perfilProfessor?: PerfilProfessor;
}

export interface PerfilAluno {
  id?: string;
  usuarioId?: string;
  curso: string;
  turno: string;
  isActive?: boolean;
}

export interface PerfilProfessor {
  id?: string;
  usuarioId?: string;
  departamento: string;
  titulacao: string;
  areaEspecializacao: string;
  isActive?: boolean;
}

export interface CreateUsuarioRequest {
  matricula: string;
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
  perfilProfessor?: PerfilProfessor;
  perfilAluno?: PerfilAluno;
}

export interface UpdateUsuarioRequest {
  nome: string;
  email: string;
  role: UserRole;
}

export interface UsuarioWithDetails extends Usuario {
  totalProjetos?: number;
}

export enum UserRole {
  Admin = 'Admin',
  Professor = 'Professor',
  Aluno = 'Aluno',
  Coordenador = 'Coordenador',
}
