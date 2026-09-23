import { PropostaTrocaRepositoryInMemory } from '@infrastructure/database/PropostaTrocaRepositoryInMemory.js';
import { ItemRepositoryInMemory } from '@infrastructure/database/ItemRepositoryInMemory.js';
import { PropostaTrocaService } from '@services/PropostaTrocaService.js';
import { PropostaTrocaController } from '@interfaces/controllers/PropostaTrocaController.js';

export class PropostaTrocaFactory {
  static criarController(): PropostaTrocaController {
    const propostaRepo = new PropostaTrocaRepositoryInMemory();
    const itemRepo = new ItemRepositoryInMemory();
    const service = new PropostaTrocaService(propostaRepo, itemRepo);
    return new PropostaTrocaController(service);
  }
}
