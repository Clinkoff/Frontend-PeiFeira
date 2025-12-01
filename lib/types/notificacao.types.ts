export enum TipoNotificacao {
  ConviteRecebido = 'ConviteRecebido',
  ConviteAceito = 'ConviteAceito',
  ConviteRecusado = 'ConviteRecusado',
  ConviteCancelado = 'ConviteCancelado',
}

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  lida: boolean;
  criadoEm: Date;
  dados?: {
    conviteId?: string;
    equipeId?: string;
    equipeNome?: string;
    remetenteNome?: string;
  };
}
