import { Colecionador } from '@entities/Colecionador.js';
import { ColecionadorRepositoryInMemory } from '@infrastructure/database/ColecionadorRepositoryInMemory.js';
import { CriarColecionadorDTO } from './dtos/ColecionadorDTOs.js';

export class ColecionadorService {
  constructor(private colecionadorRepository: ColecionadorRepositoryInMemory) {}

  listarTodas(): Colecionador[] {
    return this.colecionadorRepository.listarTodas();
  }

  buscarPorId(id: number): Colecionador | undefined {
    return this.colecionadorRepository.buscarPorId(id);
  }

  criar(dados: CriarColecionadorDTO): Colecionador {
    return this.colecionadorRepository.criar(dados);
  }

  excluir(id: number): boolean {
    return this.colecionadorRepository.excluir(id);
  }
}