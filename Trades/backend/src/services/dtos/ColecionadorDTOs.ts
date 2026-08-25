import { TipoPerfil } from '@entities/Colecionador.js';

export interface CriarColecionadorDTO {
  nome: string;
  email: string;
  perfil: TipoPerfil;
}