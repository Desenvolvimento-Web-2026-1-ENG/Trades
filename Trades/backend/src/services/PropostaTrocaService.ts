import { PropostaTroca } from '@entities/PropostaTroca.js';
import { CriarPropostaTrocaDTO } from './dtos/PropostaTrocaDTOs.js';
import { ItemRepositoryInMemory } from '@infrastructure/database/ItemRepositoryInMemory.js';
import { PropostaTrocaRepositoryInMemory } from '@infrastructure/database/PropostaTrocaRepositoryInMemory.js';

export class PropostaTrocaService {
  constructor(
    private propostaRepository: PropostaTrocaRepositoryInMemory,
    private itemRepository: ItemRepositoryInMemory
  ) {}

  criarProposta(dados: CriarPropostaTrocaDTO): PropostaTroca {
    // Valida se os itens do solicitantes realmente pertencem a ele
    const itensSolicitante = dados.itensSolicitanteIds.map(id => this.itemRepository.buscarPorId(id));
    const pertenceAoSolicitante = itensSolicitante.every(item => item && item.colecionadorId === dados.solicitanteId);

    if (!pertenceAoSolicitante) {
      throw new Error('Algum item oferecido não pertence ao solicitante.');
    }

    return this.propostaRepository.criar(dados);
  }

  responderProposta(propostaId: number, aceitar: boolean): PropostaTroca {
    const proposta = this.propostaRepository.buscarPorId(propostaId);
    if (!proposta) throw new Error('Proposta não encontrada.');
    if (proposta.status !== 'PENDENTE') throw new Error('Proposta já finalizada.');

    if (!aceitar) {
      return this.propostaRepository.atualizar(propostaId, { status: 'RECUSADA' })!;
    }

    // Regra principal: Troca automática de propriedade dos itens
    proposta.itensSolicitanteIds.forEach(itemId => {
      this.itemRepository.atualizar(itemId, { colecionadorId: proposta.destinatarioId });
    });

    proposta.itensDestinatarioIds.forEach(itemId => {
      this.itemRepository.atualizar(itemId, { colecionadorId: proposta.solicitanteId });
    });

    return this.propostaRepository.atualizar(propostaId, { status: 'ACEITA' })!;
  }
}