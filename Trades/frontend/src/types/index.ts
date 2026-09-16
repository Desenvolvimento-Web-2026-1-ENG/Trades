export interface Colecionador {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

export interface Item {
  id: number;
  titulo: string;
  fotoUrl: string;
  estadoConservacao: string; // Ex: "PSA 10", "MINT 9.5"
  raridade: string;          // Ex: "Mítico", "Lendário", "Épico"
  colecionadorId: number;
  categoria?: 'Cartas' | 'Moedas' | 'Selos';
  valorEstimado?: string;     // Ex: "$4,250.00"
  edicao?: string;            // Ex: "#001/500" ou "ORIGEM 1924"
}
// Suporte para relação ManyToMany (Vários itens por Vários itens)
export interface Proposta {
  id: number;
  solicitanteId: number;
  destinatarioId: number;
  itensOferecidos: Item[]; // Itens do Solicitante
  itensDesejados: Item[];   // Itens do Destinatário
  status: 'PENDENTE' | 'ACEITA' | 'RECUSADA';
  dataCriacao?: string;
}

export interface FormItemState {
  titulo: string;
  fotoUrl: string;
  categoria: string;
  condicaoGrade: number;
  raridade: string;
  dataAquisicao: string;
  valorEstimado: string;
  descricao: string;
  colecionadorId: string;
}