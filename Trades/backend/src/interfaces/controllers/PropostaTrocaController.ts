import { Request, Response } from 'express';
import { PropostaTrocaService } from '@services/PropostaTrocaService.js';

export class PropostaTrocaController {
  constructor(private propostaService: PropostaTrocaService) {}

  criar(req: Request, res: Response) {
    try {
      const proposta = this.propostaService.criarProposta(req.body);
      return res.status(201).json(proposta);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  }

  responder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { aceitar } = req.body;
      const proposta = this.propostaService.responderProposta(Number(id), aceitar);
      return res.status(200).json(proposta);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  }
}