import { Request, Response } from 'express';
import { ColecionadorService } from '@services/ColecionadorService.js';

export class ColecionadorController {
  constructor(private colecionadorService: ColecionadorService) {}

  listar(req: Request, res: Response) {
    const colecionadores = this.colecionadorService.listarTodas();
    return res.status(200).json(colecionadores);
  }

  buscarPorId(req: Request, res: Response) {
    const { id } = req.params;
    const colecionador = this.colecionadorService.buscarPorId(Number(id));
    if (!colecionador) {
      return res.status(404).json({ mensagem: 'Colecionador não encontrado' });
    }
    return res.status(200).json(colecionador);
  }

  criar(req: Request, res: Response) {
    try {
      const colecionador = this.colecionadorService.criar(req.body);
      return res.status(201).json(colecionador);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  }

  excluir(req: Request, res: Response) {
    const { id } = req.params;
    const deletado = this.colecionadorService.excluir(Number(id));
    if (!deletado) {
      return res.status(404).json({ mensagem: 'Colecionador não encontrado' });
    }
    return res.status(204).send();
  }
}