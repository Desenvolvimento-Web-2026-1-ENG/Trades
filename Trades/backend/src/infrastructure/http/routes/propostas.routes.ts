import { Router, Request, Response } from 'express';
import { PropostaTrocaFactory } from '@factories/PropostaTrocaFactory.js';

const router = Router();
const controller = PropostaTrocaFactory.criarController();

/**
 * @swagger
 * /api/propostas:
 *   get:
 *     summary: Lista todas as propostas de troca
 *     tags: [Propostas]
 */
router.get('/propostas', (req: Request, res: Response) => controller.listar(req, res));

/**
 * @swagger
 * /api/propostas/{id}:
 *   get:
 *     summary: Busca uma proposta por ID
 *     tags: [Propostas]
 */
router.get('/propostas/:id', (req: Request, res: Response) => controller.buscarPorId(req, res));

/**
 * @swagger
 * /api/propostas:
 *   post:
 *     summary: Cria uma nova proposta de troca de itens entre dois colecionadores
 *     tags: [Propostas]
 */
router.post('/propostas', (req: Request, res: Response) => controller.criar(req, res));

/**
 * @swagger
 * /api/propostas/{id}/responder:
 *   patch:
 *     summary: Aceita ou recusa uma proposta (troca automaticamente os donos dos itens)
 *     tags: [Propostas]
 */
router.patch('/propostas/:id/responder', (req: Request, res: Response) => controller.responder(req, res));

export default router;