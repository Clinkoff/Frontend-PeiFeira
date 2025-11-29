import { Usuario } from './usuario.types';

export interface LoginRequest {
  matricula: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  usuario: Usuario;
}
