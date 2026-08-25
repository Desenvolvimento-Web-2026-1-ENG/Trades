export interface CriarItemDTO {
  titulo: string;
  descricao?: string;
  fotoUrl: string;
  estadoConservacao: 'Novo' | 'Excelente' | 'Marcas de Uso' | 'Danificado';
  raridade: 'Comum' | 'Raro' | 'Épico' | 'Lendário';
  colecionadorId: number;
}