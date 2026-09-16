import { PropostaTroca } from '@entities/PropostaTroca.js';
import { CriarPropostaTrocaDTO } from './dtos/PropostaTrocaDTOs.js';
import { ItemRepositoryInMemory } from '@infrastructure/database/ItemRepositoryInMemory.js';
import { PropostaTrocaRepositoryInMemory } from '@infrastructure/database/PropostaTrocaRepositoryInMemory.js';

export class PropostaTrocaService {
  constructor(
    private propostaRepository: PropostaTrocaRepositoryInMemory,
    private itemRepository: ItemRepositoryInMemory
  ) {}

  // MÉTODO CONECTADO AO REPOSITÓRIO:
  listarPropostas(): PropostaTroca[] {
    return this.propostaRepository.listarTodas();
  }

  criarProposta(dados: CriarPropostaTrocaDTO): PropostaTroca {
    const solId = Number(dados.solicitanteId);
    const itensSolicitanteIds = (dados.itensSolicitanteIds || []).map(Number);

    const itensSolicitante = itensSolicitanteIds.map(id => this.itemRepository.buscarPorId(id));
    const pertenceAoSolicitante = itensSolicitante.every(
      item => item && Number(item.colecionadorId) === solId
    );

    if (!pertenceAoSolicitante) {
      throw new Error('Algum item oferecido não pertence ao solicitante informado.');
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

    proposta.itensSolicitanteIds.forEach(itemId => {
      this.itemRepository.atualizar(itemId, { colecionadorId: proposta.destinatarioId });
    });

    proposta.itensDestinatarioIds.forEach(itemId => {
      this.itemRepository.atualizar(itemId, { colecionadorId: proposta.solicitanteId });
    });

    return this.propostaRepository.atualizar(propostaId, { status: 'ACEITA' })!;
  }
}