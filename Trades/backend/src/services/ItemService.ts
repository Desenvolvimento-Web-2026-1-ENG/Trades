import { Item } from '@entities/Item.js';
import { ItemRepositoryInMemory } from '@infrastructure/database/ItemRepositoryInMemory.js';
import { CriarItemDTO } from './dtos/ItemDTOs.js';

export class ItemService {
  constructor(private itemRepository: ItemRepositoryInMemory) {}

  listarTodas(): Item[] {
    return this.itemRepository.listarTodas();
  }

  buscarPorId(id: number): Item | undefined {
    return this.itemRepository.buscarPorId(id);
  }

  criar(dados: CriarItemDTO): Item {
    return this.itemRepository.criar(dados);
  }

  excluir(id: number): boolean {
    return this.itemRepository.excluir(id);
  }
}