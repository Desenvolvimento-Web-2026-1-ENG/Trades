import { Request, Response } from 'express';
import { ItemService } from '@services/ItemService.js';

export class ItemController {
  constructor(private itemService: ItemService) {}

  listar(req: Request, res: Response) {
    const itens = this.itemService.listarTodas();
    return res.status(200).json(itens);
  }

  buscarPorId(req: Request, res: Response) {
    const { id } = req.params;
    const item = this.itemService.buscarPorId(Number(id));
    if (!item) {
      return res.status(404).json({ mensagem: 'Item não encontrado' });
    }
    return res.status(200).json(item);
  }

  criar(req: Request, res: Response) {
    try {
      const item = this.itemService.criar(req.body);
      return res.status(201).json(item);
    } catch (error: any) {
      return res.status(400).json({ mensagem: error.message });
    }
  }

  excluir(req: Request, res: Response) {
    const { id } = req.params;
    const deletado = this.itemService.excluir(Number(id));
    if (!deletado) {
      return res.status(404).json({ mensagem: 'Item não encontrado' });
    }
    return res.status(204).send();
  }
}