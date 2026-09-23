export type StatusProposta = 'PENDENTE' | 'ACEITA' | 'RECUSADA';

export interface PropostaTroca {
  id: number;
  solicitanteId: number;
  destinatarioId: number;
  itensSolicitanteIds: number[]; // Relação ManyToMany (Itens oferecidos)
  itensDestinatarioIds: number[]; // Relação ManyToMany (Itens desejados)
  status: StatusProposta;
  dataCriacao: string;
}