import { Router, Request, Response } from 'express';
import { ItemFactory } from '@factories/ItemFactory.js';

const router = Router();
const controller = ItemFactory.criarController();

/**
 * @swagger
 * /api/itens:
 *   get:
 *     summary: Lista todos os itens ou busca por filtros (ex: colecionadorId)
 *     tags: [Itens]
 */
router.get('/itens', (req: Request, res: Response) => controller.listar(req, res));

/**
 * @swagger
 * /api/itens/{id}:
 *   get:
 *     summary: Busca detalhes de um item específico por ID
 *     tags: [Itens]
 */
router.get('/itens/:id', (req: Request, res: Response) => controller.buscarPorId(req, res));

/**
 * @swagger
 * /api/itens:
 *   post:
 *     summary: Cadastra um novo item (foto, estado de conservação, raridade e dono)
 *     tags: [Itens]
 */
router.post('/itens', (req: Request, res: Response) => controller.criar(req, res));

/**
 * @swagger
 * /api/itens/{id}:
 *   delete:
 *     summary: Exclui um item
 *     tags: [Itens]
 */
router.delete('/itens/:id', (req: Request, res: Response) => controller.excluir(req, res));

export default router;