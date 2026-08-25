export type TipoPerfil = 'COLECIONADOR' | 'ADMINISTRADOR';

export interface Colecionador {
  id: number;
  nome: string;
  email: string;
  perfil: TipoPerfil;
}