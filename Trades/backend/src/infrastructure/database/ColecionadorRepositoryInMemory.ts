import { Colecionador } from "@entities/Colecionador.js";

let colecionadores: Colecionador[] = [];
let proximoId = 1;

export class ColecionadorRepositoryInMemory {
  listarTodas(): Colecionador[] {
    return colecionadores;
  }

  buscarPorId(id: number): Colecionador | undefined {
    return colecionadores.find((c) => c.id === id);
  }

  criar(dados: Omit<Colecionador, "id">): Colecionador {
    const novoColecionador: Colecionador = { id: proximoId++, ...dados };
    colecionadores.push(novoColecionador);
    return novoColecionador;
  }

  excluir(id: number): boolean {
    const tamanhoInicial = colecionadores.length;
    colecionadores = colecionadores.filter((c) => c.id !== id);
    return colecionadores.length < tamanhoInicial;
  }
}