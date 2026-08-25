import { ColecionadorRepositoryInMemory } from '@infrastructure/database/ColecionadorRepositoryInMemory.js';
import { ColecionadorService } from '@services/ColecionadorService.js';
import { ColecionadorController } from '@interfaces/controllers/ColecionadorController.js';

export class ColecionadorFactory {
  static criarController(): ColecionadorController {
    const repository = new ColecionadorRepositoryInMemory();
    const service = new ColecionadorService(repository);
    return new ColecionadorController(service);
  }
}