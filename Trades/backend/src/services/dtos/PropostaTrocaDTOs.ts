export interface CriarPropostaTrocaDTO {
  solicitanteId: number;
  destinatarioId: number;
  itensSolicitanteIds: number[];
  itensDestinatarioIds: number[];
}

export interface ResponderPropostaDTO {
  aceitar: boolean;
}