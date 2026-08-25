import { ItemRepositoryInMemory } from '@infrastructure/database/ItemRepositoryInMemory.js';
import { ItemService } from '@services/ItemService.js';
import { ItemController } from '@interfaces/controllers/ItemController.js';

export class ItemFactory {
  static criarController(): ItemController {
    const repository = new ItemRepositoryInMemory();
    const service = new ItemService(repository);
    return new ItemController(service);
  }
}