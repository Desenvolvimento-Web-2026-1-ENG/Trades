import { PropostaTroca } from "@entities/PropostaTroca";

let propostas: PropostaTroca[] = [];
let proximoId = 1;

export class PropostaTrocaRepositoryInMemory {
  listarTodas(): PropostaTroca[] {
    return propostas;
  }

  buscarPorId(id: number): PropostaTroca | undefined {
    return propostas.find((p) => p.id === id);
  }

  criar(dados: Omit<PropostaTroca, "id" | "status">): PropostaTroca {
    const novaProposta: PropostaTroca = {
      id: proximoId++,
      ...dados,
      status: 'PENDENTE',
      dataCriacao: new Date().toISOString()
    };
    propostas.push(novaProposta);
    return novaProposta;
  }

  atualizar(id: number, dados: Partial<PropostaTroca>): PropostaTroca | undefined {
    const index = propostas.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    propostas[index] = { ...propostas[index], ...dados, id };
    return propostas[index];
  }
}