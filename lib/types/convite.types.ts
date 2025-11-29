export enum StatusConvite {
  Pendente = 'Pendente',
  Aceito = 'Aceito',
  Rejeitado = 'Rejeitado',
  Cancelado = 'Cancelado',
}

export const StatusConviteLabels: Record<StatusConvite, string> = {
  [StatusConvite.Pendente]: 'Pendente',
  [StatusConvite.Aceito]: 'Aceito',
  [StatusConvite.Rejeitado]: 'Recusado',
  [StatusConvite.Cancelado]: 'Cancelado',
};

export const StatusConviteColors: Record<StatusConvite, string> = {
  [StatusConvite.Pendente]:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  [StatusConvite.Aceito]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  [StatusConvite.Rejeitado]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  [StatusConvite.Cancelado]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

export interface ConviteEquipe {
  id: string;
  isActive: boolean;
  equipeId: string;
  convidadoPorId: string;
  convidadoId: string;
  mensagem?: string | null;
  status: StatusConvite;
  motivoResposta?: string | null;
  dataResposta?: string | null;
  criadoEm: string;
  alteradoEm?: string;
}

export interface ConviteEquipeResponse extends ConviteEquipe {
  nomeEquipe?: string;
  nomeConvidadoPor?: string;
  nomeConvidado?: string;
}

export interface CreateConviteEquipeRequest {
  equipeId: string;
  convidadoPorId: string;
  convidadoId: string;
  mensagem?: string;
}

export interface RespondConviteRequest {
  perfilAlunoId: string;
}
