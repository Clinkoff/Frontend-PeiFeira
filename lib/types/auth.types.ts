export interface LoginRequest {
  matricula: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  usuario: Usuario;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  tipo: UserRole;
  perfilId?: string;
}

export enum UserRole {
  Admin = 'Admin',
  Professor = 'Professor',
  Aluno = 'Aluno',
  Coordenador = 'Coordenador',
}
