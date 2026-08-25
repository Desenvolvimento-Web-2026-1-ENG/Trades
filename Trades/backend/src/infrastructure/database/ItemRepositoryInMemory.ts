import { Item } from "@entities/Item.js";

let itens: Item[] = [];
let proximoId = 1;

export class ItemRepositoryInMemory {
  listarTodas(): Item[] {
    return itens;
  }

  buscarPorId(id: number): Item | undefined {
    return itens.find((i) => i.id === id);
  }

  buscarPorColecionador(colecionadorId: number): Item[] {
    return itens.filter((i) => i.colecionadorId === colecionadorId);
  }

  criar(dados: Omit<Item, "id">): Item {
    const novoItem: Item = { id: proximoId++, ...dados };
    itens.push(novoItem);
    return novoItem;
  }

  atualizar(id: number, dados: Partial<Item>): Item | undefined {
    const index = itens.findIndex((i) => i.id === id);
    if (index === -1) return undefined;
    itens[index] = { ...itens[index], ...dados, id };
    return itens[index];
  }

  excluir(id: number): boolean {
    const tamanhoInicial = itens.length;
    itens = itens.filter((i) => i.id !== id);
    return itens.length < tamanhoInicial;
  }
}